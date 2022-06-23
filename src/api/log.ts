import gql from "graphql-tag"

import { Resolvers } from "@/graphql-types"

export const typeDefs = gql`
  extend type Query {
    getRecentLogs(uuid: Int!): [Log]
  }

  extend type Mutation {
    setLog(uuid: Int!, type: Int!, text: String!): Boolean
  }

  type Log implements Node {
    id: ID!
    uuid: Int!
    text: String
    type: Int!
  }
`

export const resolvers: Resolvers = {
  Query: {
    getRecentLogs: async (obj, { uuid }, context) => {
      // context.db
      return []
    },
  },
  Mutation: {
    setLog: async (obj, { uuid, type, text }, context) => {
      // TODO
      return false
    },
  },
}
