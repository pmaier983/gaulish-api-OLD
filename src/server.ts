import express from "express"
import passport from "passport"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import jwt from "jsonwebtoken"
import cors from "cors"
import { Server } from "socket.io"

import db from "@/database"

import { dataLoaders } from "./dataLoaders"
import { schema } from "./schema"
import { googleOAuthStrategy, authCallback } from "./auth"

// TODO: setup TypeDocs
// TODO: setup some database mocking (msw, json-server, etc?)
// TODO: setup some bundle size reporter?

const { NODE_ENV, FRONTEND_DEV_URL, FRONTEND_URL, JWT_SECRET } = process.env

const isDevEnv = NODE_ENV === "development"

const CORS = {
  origin: isDevEnv ? FRONTEND_DEV_URL : FRONTEND_URL,
  methods: "GET,PUT,POST,PATCH",
}

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

// TODO: look into https://github.com/uNetworking/uWebSockets.js
const io = new Server(server, {
  cors: CORS,
})

io.use(async (socket, next) => {
  // TODO: auth socket.io requests
  // Just because I have been defeated today, does not mean i will be defeated tomorrow.
  if (socket.request) {
    next()
  } else {
    next(new Error("unauthorized"))
  }
})

// TODO: integrate ws into gql as @live queries
io.on("connection", (socket) => {
  // console.log("we in bb", socket.id)

  socket.on("hello!", () => {
    console.log(`hello from ${socket.id}`)
  })

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`)
  })
})
