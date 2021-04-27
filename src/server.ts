import express from "express"
import passport from "passport"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import jwt from "jsonwebtoken"

import db from "@/database"

import { dataLoaders } from "./dataloaders"
import { schema } from "./schema"
import { googleOAuthStrategy } from "./googleOAuthStrategy"

// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?

// Create a server:
const app = express()

app.use(passport.initialize())

// SETUP user creation & Auth
passport.use(googleOAuthStrategy)

// compress all requests
app.use(compression())

app.get(
  "/google",
  // TODO: handle if req already has a JWT?
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    passReqToCallback: true,
  }),
  (req, res) => {
    // TODO: how to properly handle Errors next(error?)
    if (!req?.user) {
      throw Error("Something went very wrong")
    }
    // TODO best patter for api responses?
    res.send({
      user: req?.user,
      token: jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: "30 days",
      }),
    })
  }
)

// Use those to handle incoming requests:
app.use(
  "/graphql",
  graphqlHTTP(async (req) => ({
    schema,
    context: {
      db,
      dataLoaders,
      // TODO: is there a better way to do this?
      // setup more advanced JWT auth (JWT should only contain user ID)
      user: req?.headers?.authorization
        ? jwt.verify(
            req.headers.authorization?.slice(7),
            process.env.JWT_SECRET
          )
        : null,
    },
    // TODO is there a better pattern then this IIFE?
    ...(() => {
      if (process.env.NODE_ENV === "development") {
        return {
          graphiql: true,
          customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split("\n") : [],
            path: error.path,
          }),
        }
      }
    })(),
  }))
)

// Start the server:
app.listen(8080, () =>
  console.log("Server started on port http://localhost:8080/graphql")
)
