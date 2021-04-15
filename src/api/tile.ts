import gql from "graphql-tag"

import { Resolvers, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"

// TODO use edge's to link User & their owned boats
export const typeDefs = gql`
  extend type Query {
    tiles: [Tile]
  }
  type Tile implements Node {
    id: ID!
    tile_id: Int
    x: Int
    y: Int
  }
`

export const resolvers: Resolvers = {
  Query: {
    tiles: async (obj, args, context) => {
      const res: Tile[] = await context.db.query("SELECT * from public.tile")
      return addGlobalID("tile", "tile_id", res)
    },
  },
}
