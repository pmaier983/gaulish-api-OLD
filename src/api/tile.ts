import gql from "graphql-tag"

import { Resolvers, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"
import DataLoader from "dataloader"

// TODO use edge's to link User & their owned boats
// https://www.apollographql.com/blog/explaining-graphql-connections-c48b7c3d6976/
export const typeDefs = gql`
  extend type Query {
    getAllTiles: [Tile]
    getTilesWithinRectangle: [Tile]
    getTilesAroundTile: [Tile]
    getTileByID: Tile
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
    getAllTiles: async (obj, args, context) => {
      // TODO: how to not Select *. Use fieldNodes.selectionSet?
      const tiles: Tile[] = await context.db.query("SELECT * from public.tile")
      return addGlobalID("tile", "tile_id", tiles)
    },
    getTilesWithinRectangle: async (obj, args, context) => {
      // TODO: build some magic sql to get this
      return [{ id: 1, tile_id: "1", x: 0, y: 0 }]
    },
    getTilesAroundTile: async (obj, args, context) => {
      // TODO: build some magic sql to get this
      return [{ id: 1, tile_id: "1", x: 0, y: 0 }]
    },
    getTileByID: async (obj, args, context) => {
      // TODO: set this up with a data loader
      // SELECT BY ID --- vai data loader
      return { id: 1, tile_id: "1", x: 0, y: 0 }
    },
  },
}
