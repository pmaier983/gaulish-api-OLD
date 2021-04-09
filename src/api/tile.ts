import gql from "graphql-tag"

// TODO handle typescript global import path thing
import { query } from "../database"

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
      const res = await query("SELECT * from public.tile")
      return res.rows
    },
  },
}
