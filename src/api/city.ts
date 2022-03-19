import gql from "graphql-tag"

import { Resolvers, City, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"

export const typeDefs = gql`
  extend type Query {
    getAllCities: [City!]!
  }

  type City implements Node {
    id: ID!
    city_id: Int!
    name: String!
    # would it be better to nest this under tile: Tile?
    tile: Tile!
  }
`

type CityFromDB = Omit<City, "id"> & Omit<Tile, "id">

export const buildCitiesResponseItem = (noIdCity: CityFromDB): City => {
  const tile = {
    tile_id: noIdCity.tile_id,
    x: noIdCity.x,
    y: noIdCity.y,
    type: noIdCity.type,
  }
  const city = {
    city_id: noIdCity.city_id,
    name: noIdCity.name,
    tile: addGlobalID("tile", "tile_id", tile),
  }
  return addGlobalID("city", "city_id", city)
}

export const resolvers: Resolvers = {
  Query: {
    getAllCities: async (_obj, _args, context) => {
      const flatCities: CityFromDB[] = await context.db
        .any(`select * from public.city Cities
              join public.tile Tiles
              on Cities.tile_id = Tiles.tile_id`)
      // TODO: is there a better way of doing this?
      return flatCities.map((city) => buildCitiesResponseItem(city))
    },
  },
}
