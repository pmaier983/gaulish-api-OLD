import gql from "graphql-tag"

import { Ship, City, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"

export const typeDefs = gql`
  extend type Query {
    getShipsByUUID(username: Int): [Ship]!
  }

  type Ship implements Node {
    id: ID!
    ship_id: Int!
    name: String!
    city_id: Int!
    uuid: Int!
    ship_type_id: Int!
  }
`

type ShipFromDB = Omit<Ship, "id"> & Omit<City, "id"> & Omit<Tile, "id">

const buildShipsResponse = (noIdShips: ShipFromDB[]) => {
  return addGlobalID("ship", "ship_id", noIdShips)
}

export const resolvers = {
  Query: {
    getShipsByUUID: async (_obj, { uuid }, context) => {
      const ships: ShipFromDB[] = await context.db.any(
        `select * from public.ship Ships
        join public.city Cities
        on Cities.city_id = Ships.city_id
        join public.tile Tiles
        on Tiles.tile_id = Cities.tile_id
        where uuid = ($1)`,
        uuid
      )
      return buildShipsResponse(ships)
    },
  },
}
