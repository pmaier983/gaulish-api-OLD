import express from "express"
import passport from "passport"
import { graphqlHTTP } from "express-graphql"
import jwt from "jsonwebtoken"

import db from "@/database"
import { schema } from "./schema"
import { googleOAuthStrategy } from "./googleOAuth"

// TODO: GZIP response
// TODO: setup a dataLoader
// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?

const { JWT_SECRET } = process.env

// Create a server:
const app = express()

app.use(passport.initialize())

passport.use(googleOAuthStrategy)

// TODO: change all of these to GRAPHQL (/graphql) url if possible!
app.get(
  "/google",
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
      token: jwt.sign(req.user, JWT_SECRET, { expiresIn: "30 days" }),
    })
  }
)

// Use those to handle incoming requests:
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    // TODO setup passport-jwt auth.
    context: {
      db,
    },
    // TODO is there a better pattern then this IIFE?
    ...(() => {
      if (process.env.NODE_ENV === "development")
        return {
          graphiql: true,
          customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split("\n") : [],
            path: error.path,
          }),
        }
    })(),
  })
)

// Start the server:
app.listen(8080, () =>
  console.log("Server started on port http://localhost:8080")
)
