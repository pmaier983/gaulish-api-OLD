import { gql } from "graphql-tag"
import type { Server } from "http"
import { Server as SocketServer } from "socket.io"
import jwt from "jsonwebtoken"
import fetch from "node-fetch"

import db from "@/database"

import { CORS } from "./utils/constants"
import { User } from "./generated/graphql"

const { SERVER_URL } = process.env

export const socketServer = (server: Server) => {
  // TODO: look into https://github.com/uNetworking/uWebSockets.js
  const io = new SocketServer(server, {
    cors: CORS,
  })

  io.use(async (socket, next) => {
    const bearerToken = socket.handshake.headers.authorization
    const token = bearerToken.substring(7, bearerToken.length)

    if (!token) {
      next(new Error("No Bearer Token Present on socket.io request"))
    }

    try {
      const verificationResponse = await fetch(`${SERVER_URL}/graphql`, {
        method: "POST",
        headers: {
          authorization: bearerToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query verifyToken {
              verifyToken
            }
          `,
        }),
      })

      const response = await verificationResponse.json()

      if (!response.data.verifyToken) {
        next(new Error("Users Token Was Invalid"))
      }
    } catch (e) {
      next(e)
    }

    next()
  })

  // TODO: integrate ws into gql as @live queries
  io.on("connection", async (socket) => {
    const bearerToken = socket.handshake.headers.authorization
    const token = bearerToken.substring(7, bearerToken.length)
    // TODO: properly type this
    const userEmail = (jwt.decode(token) as User)?.email

    const user: User = await db.one(
      "SELECT email, time_created, username, uuid FROM public.user WHERE email = $1",
      userEmail
    )

    console.log("connection", socket.id, user)

    socket.on("hello!", () => {
      console.log(`hello from ${socket.id}`)
    })

    socket.on("disconnect", () => {
      console.log(`disconnect: ${socket.id}`)
    })
  })
}
