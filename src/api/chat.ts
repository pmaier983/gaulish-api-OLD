import gql from "graphql-tag"

import { Resolvers } from "@/graphql-types"
import { pubsub } from "@/pubSub"

enum PUBS_SUB_CHANNELS {
  GLOBAL_CHAT = "GLOBAL_CHAT",
}

export const typeDefs = gql`
  type Chat implements Node {
    id: ID!
    time: String! # Dont use a string? do something more gql?
    text: String!
    username: String
  }

  extend type Subscription {
    globalChat: Chat!
  }

  extend type Mutation {
    chatGlobally(text: String!, username: String!): Boolean
  }
`

export const resolvers: Resolvers = {
  // TODO: how to not Select * (Instead Use fieldNodes.selectionSet?)
  Subscription: {
    globalChat: {
      subscribe: () => pubsub.asyncIterator(PUBS_SUB_CHANNELS.GLOBAL_CHAT),
    },
  },
  Mutation: {
    chatGlobally: async (obj, { text, username }) => {
      // TODO: dont use time as the unique ID
      const currentTime = Date.now()
      pubsub.publish(PUBS_SUB_CHANNELS.GLOBAL_CHAT, {
        globalChat: {
          // TODO: probably use globalID instead of this...
          id: Buffer.from(text+username+currentTime).toString("base64"),
          time: currentTime.toString(),
          text,
          username,
        },
      })
      return true
    },
  },
}