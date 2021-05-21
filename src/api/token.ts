import gql from "graphql-tag"

export const typeDefs = gql`
  extend type Query {
    verifyToken: Boolean!
  }
`

export const resolvers = {
  Query: {
    verifyToken: async (obj, args, context) => {
      if (context.user) {
        return true
      }
      return false
    },
  },
}
