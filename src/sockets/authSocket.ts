import jwt from "jsonwebtoken"
import fetch from "node-fetch"

import db from "@/database"

import { SocketServer } from "@/socketServer"
import { User } from "@/graphql-types"

const { SERVER_URL } = process.env

export const authSocket = (io: SocketServer) => {
  io.use(async (socket, next) => {
    const bearerToken = socket.handshake.headers.authorization
    const token = bearerToken.substring(7, bearerToken.length)

    if (token === "null" || !token) {
      return next(new Error("No Bearer Token Present on socket.io request"))
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
        return next(new Error("Users Token Was Invalid"))
      }
    } catch (e) {
      next(e)
    }

    // TODO: properly type this
    const userEmail = (jwt.decode(token) as User)?.email

    const user: User = await db.one(
      "SELECT email, time_created, username, uuid FROM public.user WHERE email = $1",
      userEmail
    )

    socket.data = { user }

    next()
  })
}
