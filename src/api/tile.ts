import gql from "graphql-tag"

import { Resolvers, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"

// TODO use edge's to link User & their owned boats
// https://www.apollographql.com/blog/explaining-graphql-connections-c48b7c3d6976/
export const typeDefs = gql`
  input Point {
    x: Int
    y: Int
  }

  extend type Query {
    getAllTiles: [Tile]
    getTilesWithinRectangle(pointA: Point, pointB: Point): [Tile]
    getTilesAroundTile(point: Point, radius: Int): [Tile]
    getTileByID(tileId: Int): Tile
  }
  type Tile implements Node {
    id: ID!
    tile_id: Int
    x: Int
    y: Int
  }
`

export const resolvers: Resolvers = {
  // TODO: how to not Select * (Instead Use fieldNodes.selectionSet?)
  Query: {
    getAllTiles: async (obj, args, context) => {
      const tiles: Tile[] = await context.db.any("SELECT * from public.tile")
      return addGlobalID<Tile[]>("tile", "tile_id", tiles)
    },
    getTilesWithinRectangle: async (
      obj,
      { pointA: { x: xA, y: yA }, pointB: { x: xB, y: yB } },
      context
    ) => {
      const tiles: Tile[] = await context.db.any(
        "SELECT * FROM public.tile WHERE x >= ${xMin} AND x <= ${xMax} AND y >= ${yMin} AND y <= ${yMax}",
        {
          xMin: Math.min(xA, xB),
          xMax: Math.max(xA, xB),
          yMin: Math.min(yA, yB),
          yMax: Math.max(yA, yB),
        }
      )
      return addGlobalID<Tile[]>("tile", "tile_id", tiles)
    },
    getTilesAroundTile: async (
      obj,
      { point: { x: xA, y: yA }, radius },
      context
    ) => {
      const tiles: Tile[] = await context.db.any(
        "SELECT * FROM public.tile WHERE x >= ${xMin} AND x <= ${xMax} AND y >= ${yMin} AND y <= ${yMax}",
        {
          xMin: xA - radius,
          xMax: xA + radius,
          yMin: yA - radius,
          yMax: yA + radius,
        }
      )
      return addGlobalID<Tile[]>("tile", "tile_id", tiles)
    },
    getTileByID: async (obj, { tileId }, context) => {
      const tile: Tile = await context.dataLoaders.tileDataLoader.load(tileId)
      console.log(tile)
      return addGlobalID<Tile>("tile", "tile_id", tile)
    },
  },
}
