import { gql } from "@apollo/client/core"
import { makeExecutableSchema } from "graphql-tools"

import { typeDefs, resolvers } from "./api"

const globalTypeDefs = gql`
  interface Node {
    id: ID!
  }
  type Query
`

// TODO: setup global resolvers

// Create a schema and a root resolver:
export const schema = makeExecutableSchema({
  typeDefs: [globalTypeDefs, ...typeDefs],
  resolvers,
})
