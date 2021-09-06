import { makeExecutableSchema } from "@graphql-tools/schema"
import gql from "graphql-tag"

import { typeDefs, resolvers } from "./api"

const globalTypeDefs = gql`
  interface Node {
    id: ID!
  }
  type Query
  type Mutation
  type Subscription
`

// TODO: setup global resolvers

// Create a schema and a root resolver:
export const schema = makeExecutableSchema({
  typeDefs: [globalTypeDefs, ...typeDefs],
  resolvers,
})
