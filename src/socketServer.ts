import type { Server } from "http"
import { Server as SocketServerCreator } from "socket.io"

import { CORS } from "@/utils/constants"
import db from "@/database"
import { authSocket } from "@/sockets/authSocket"
import { User } from "@/graphql-types"

interface ClientAndServerEvents {
  globalChat: (message: string, timeSent: number) => void
}

type ClientToServerEvents = ClientAndServerEvents

type ServerToClientEvents = ClientAndServerEvents

/* eslint-disable @typescript-eslint/no-empty-interface */
interface InterServerEvents {}

interface SocketData {
  user: Omit<User, "id">
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
  const io = new SocketServerCreator(server, {
    cors: CORS,
  })

  authSocket(io)

  // TODO: integrate ws into gql as @live queries
  io.on("connection", async (socket) => {
    console.log("connection", socket.id, socket.data.user)

    const { uuid } = socket.data.user

    socket.on("globalChat", (message, timeSent) => {
      io.emit("globalChat", message, timeSent)
      // TODO: log chats in some blob store... sql isn't super efficient for this
      db.none(
        "insert into public.chat (uuid, timestamp, room_id, recipient_uuid, text) values (${uuid}, ${timestamp}, null, null, ${text})",
        { uuid, timestamp: timeSent, text: message }
      )
    })

    socket.on("disconnect", () => {
      console.log(`disconnect: ${socket.id}`)
    })
  })
}
