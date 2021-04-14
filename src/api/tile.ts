import gql from "graphql-tag"

// TODO handle typescript global import path thing
import db from "@/database"
import { Tile } from "@/graphql-types"

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

export const resolvers = {
  Query: {
    tiles: async () => {
      const res = await db.query<Tile[]>("SELECT * from public.tile")
      // TODO: what is the best way to set these ids?
      return res.map((tile) => ({ ...tile, id: tile.tile_id }))
    },
  },
}
