import gql from "graphql-tag"

import { Resolvers, City } from "@/graphql-types"
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
    x: Int!
    y: Int!
    type: TileTypes!
  }
`

export const resolvers: Resolvers = {
  Query: {
    getAllCities: async (_obj, _args, context) => {
      const cities: City[] = await context.db
        .any(`select * from public.city Cities
              join public.tile Tiles
              on Cities.tile_id = Tiles.tile_id`)
      return addGlobalID<City[]>("city", "city_id", cities)
    },
  },
}
