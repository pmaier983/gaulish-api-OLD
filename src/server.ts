import express from "express"
import passport from "passport"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import jwt from "jsonwebtoken"
import cors from "cors"

import db from "@/database"

import { socketServer } from "./socketServer"
import { dataLoaders } from "./dataLoaders"
import { schema } from "./schema"
import { googleOAuthStrategy, authCallback } from "./auth"
import { CORS, isDevEnv } from "./utils/constants"

// TODO: setup TypeDocs
// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?
// TODO: shift to ESM (https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-move-my-commonjs-project-to-esm)

const { JWT_SECRET } = process.env

// Create a server:
const app = express()

app.use(cors(CORS))

app.use(passport.initialize())

// SETUP user creation & Auth
passport.use(googleOAuthStrategy)

// compress all requests
app.use(compression())

// TODO: auth/callback
app.get(
  "/google",
  // TODO: handle if req already has a JWT?
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    passReqToCallback: true,
  }),
  authCallback
)

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
    graphiql: isDevEnv ? { headerEditorEnabled: true } : false,
    customFormatErrorFn: isDevEnv
      ? (error) => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack ? error.stack.split("\n") : [],
          path: error.path,
        })
      : undefined,
  }))
)

// Start the server
const server = app.listen(8080, () => {
  console.log("Server started on port http://localhost:8080/graphql")
})

socketServer(server)
