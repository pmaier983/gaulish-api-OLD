import gql from "graphql-tag"

import { Resolvers } from "@/generated/graphql"

export const typeDefs = gql`
  extend type Mutation {
    setShipPath(ship_id: Int!, shipPath: String!): Boolean #TODO: error properly?
  }

  type Path implements Node {
    id: ID!
    path_id: Int!
    ship_id: Int!
    start_time: Int!
    path: String! # x,y,tile_id|x,y,tile_id|x,y,tile_id|...
  }
`

export const resolvers: Resolvers = {
  Mutation: {
    setShipPath: async (_obj, { ship_id, shipPath }, context) => {
      // TODO: duplicate validation here!
      // TODO why not just use template literals
      context.db.one(
        "insert into public.path (ship_id, start_time, path) values (${ship_id}, ${start_time}, ${shipPath})",
        {
          ship_id,
          start_time: Date.now(),
          shipPath,
        }
      )
      return false
    },
  },
}
