import gql from "graphql-tag"

import { Ship, City, Tile } from "@/graphql-types"
import { addGlobalID } from "@/utils"
import { buildCitiesResponseItem } from "./city"
import { getShipTypeById } from "./ship_type"

export const typeDefs = gql`
  extend type Query {
    getShipsByUUID(uuid: Int): [Ship!]!
  }

  type Ship implements Node {
    id: ID!
    ship_id: Int!
    name: String!
    city: City!
    uuid: Int!
    ship_type: ShipType!
  }
`

interface ShipWithShipTypeId extends Omit<Ship, "id"> {
  ship_type_id: number
}

type ShipFromDB = ShipWithShipTypeId &
  Omit<City, "id"> &
  Omit<Tile, "id"> & { ship_name: string; city_name: string }

const buildShipsResponseItem = (noIdShip: ShipFromDB) => {
  const city = buildCitiesResponseItem(noIdShip)
  const ship = {
    ship_id: noIdShip.ship_id,
    city: { ...city, name: noIdShip.city_name },
    name: noIdShip.ship_name,
    uuid: noIdShip.uuid,
    ship_type: getShipTypeById(noIdShip.ship_type_id),
  }
  return addGlobalID("ship", "ship_id", ship)
}

export const resolvers = {
  Query: {
    getShipsByUUID: async (_obj, { uuid }, context) => {
      const flatShips: ShipFromDB[] = await context.db.any(
        `select *, 
        Cities.name as city_name, 
        Ships.name as ship_name
        from public.ship Ships
        join public.city Cities
        on Cities.city_id = Ships.city_id
        join public.tile Tiles
        on Tiles.tile_id = Cities.tile_id
        where uuid = 1`,
        uuid
      )
      return flatShips.map((ship) => buildShipsResponseItem(ship))
    },
  },
}
