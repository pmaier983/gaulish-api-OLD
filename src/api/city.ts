import gql from "graphql-tag"

import { Resolvers, City, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"

export const typeDefs = gql`
  extend type Query {
    getAllCities: [City]!
  }

  type City implements Node {
    id: ID!
    city_id: Int!
    name: String!
    tile_id: Int! # any way to have this be Tile.id?
    # would it be better to nest this under tile: Tile?
    tile: Tile!
  }
`

type CityFromDB = Omit<City, "id"> & Omit<Tile, "id">

export const buildCitiesResponse = (noIdCities: CityFromDB[]): City[] => {
  const cities = noIdCities.map((cur) => {
    const tile = {
      tile_id: cur.tile_id,
      x: cur.x,
      y: cur.y,
      type: cur.type,
    }
    return {
      city_id: cur.city_id,
      name: cur.name,
      tile: addGlobalID("tile", "tile_id", tile),
    }
  })
  return addGlobalID("city", "city_id", cities)
}

export const resolvers: Resolvers = {
  Query: {
    getAllCities: async (_obj, _args, context) => {
      const flatCities: CityFromDB[] = await context.db
        .any(`select * from public.city Cities
              join public.tile Tiles
              on Cities.tile_id = Tiles.tile_id`)
      // TODO: is there a better way of doing this?
      return buildCitiesResponse(flatCities)
    },
  },
}
