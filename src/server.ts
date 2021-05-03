import express from "express"
import passport from "passport"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import jwt from "jsonwebtoken"
import cors from "cors"

import db from "@/database"

import { dataLoaders } from "./dataloaders"
import { schema } from "./schema"
import { googleOAuthStrategy } from "./googleOAuthStrategy"

// TODO: setup TypeDocs
// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?

const { NODE_ENV, FRONTEND_DEV_URL, FRONTEND_URL, JWT_SECRET } = process.env

const isDevEnv = NODE_ENV === "development"

// Create a server:
const app = express()

app.use(
  cors({
    // TODO: add gaulish.io when I get it running
    // TODO: include dash (3000/ vs. 3000) or no...
    origin: isDevEnv ? FRONTEND_DEV_URL : FRONTEND_URL,
    // TODO: limit this? (remove delete? or...)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
)

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
    // TODO best pattern for api responses?
    res.send({
      user: req?.user,
      token: jwt.sign(req.user, JWT_SECRET, {
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
        ? jwt.verify(req.headers.authorization?.slice(7), JWT_SECRET)
        : null,
    },
    // TODO is there a better pattern then this IIFE?
    ...(() => {
      if (isDevEnv) {
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
