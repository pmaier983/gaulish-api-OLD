import gql from "graphql-tag"

import { Resolvers } from "@/graphql-types"

export const typeDefs = gql`
  extend type Query {
    # TODO: paginate
    getChatHistory(room_id: Int, timestamp: Int!): [Chat!]!
  }

  type Chat implements Node {
    id: ID!
    chat_id: Int
    uuid: Int
    room_id: Int
    timestamp: Int
    recipient_uuid: Int
    text: String
  }
`

export const resolvers: Resolvers = {
  Query: {
    getChatHistory: async (obj, { room_id, timestamp }, context) => {
      // TODO: do this with proper pagination and stuff
      return []
    },
  },
}
