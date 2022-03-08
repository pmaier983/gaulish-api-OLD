import { User } from "./generated/graphql"
import type { Server } from "http"
import { Server as SocketServerCreator } from "socket.io"

import { CORS } from "@/utils/constants"
import { authSocket } from "@/sockets/authSocket"

interface ClientToServerEvents {
  globalChat: (message: string) => void
}

interface ServerToClientEvents {
  globalChat: (message: string) => void
}

/* eslint-disable @typescript-eslint/no-empty-interface */
interface InterServerEvents {}

interface SocketData {
  user: User
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export type SocketServer = SocketServerCreator<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export const socketServer = (server: Server) => {
  // TODO: look into https://github.com/uNetworking/uWebSockets.js
  const io: SocketServer = new SocketServerCreator(server, {
    cors: CORS,
  })

  authSocket(io)

  // TODO: integrate ws into gql as @live queries
  io.on("connection", async (socket) => {
    console.log("connection", socket.id, socket.data.user)

    let val = 1
    socket.on("globalChat", (stuff) => {
      console.log(`Chat from ${socket.id}, ${stuff}`)
      socket.emit("globalChat", `Pong${val}`)
      val++
    })

    socket.on("disconnect", () => {
      console.log(`disconnect: ${socket.id}`)
    })
  })
}
