import express from "express"
import ws from "ws"
import passport from "passport"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import { useServer } from "graphql-ws/lib/use/ws"
import { execute, subscribe } from "graphql"
import jwt from "jsonwebtoken"
import cors from "cors"

import db from "@/database"

import { dataLoaders } from "./dataLoaders"
import { schema } from "./schema"
import { googleOAuthStrategy, authCallback } from "./auth"

// TODO: setup TypeDocs
// TODO: can socket.io work with graphql-ws?
// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?

const { NODE_ENV, FRONTEND_DEV_URL, FRONTEND_URL, JWT_SECRET } = process.env

const isDevEnv = NODE_ENV === "development"

// Create a server:
const app = express()

app.use(
  cors({
    origin: isDevEnv ? FRONTEND_DEV_URL : FRONTEND_URL,
    methods: "GET,PUT,POST,PATCH",
  })
)

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
  // create and use the websocket server
  const wsServer = new ws.Server({
    server,
    path: "/graphql",
  })

  // create auth as seen here: https://github.com/enisdenjo/graphql-ws#ws-auth-handling
  useServer(
    {
      schema,
      context: {
        db,
        dataLoaders,
        // TODO: pass the user in each query
      },
      execute,
      subscribe,
      onConnect: (ctx) => {
        console.log("Connect")
      },
      onSubscribe: (ctx, msg) => {
        console.log("Subscribe")
      },
      onNext: (ctx, msg, args, result) => {
        console.debug("Next")
      },
      onError: (ctx, msg, errors) => {
        console.error("Error")
      },
      onComplete: (ctx, msg) => {
        console.log("Complete")
      },
    },
    wsServer
  )

  console.log("Server started on port http://localhost:8080/graphql")
})
