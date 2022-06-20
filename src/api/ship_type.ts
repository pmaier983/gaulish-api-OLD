import gql from "graphql-tag"

import { ShipType } from "@/generated/graphql"
import { Resolvers } from "@/graphql-types"
import { addGlobalID } from "@/utils"

export const typeDefs = gql`
  extend type Query {
    # TODO: paginate
    getShipTypeFromId(shipTypeId: Int): ShipType!
  }

  type ShipType implements Node {
    id: ID!
    ship_type_id: Int!
    name: String!
    cargo_capacity: Int!
    inventory_slots: Int!
    attack_rating: Int! # TODO: break this down? (cannons, ramming etc.)
    speed: Int! # in milliseconds
  }
`

const shipTypes: { [key: string]: Omit<ShipType, "id"> } = {
  1: {
    ship_type_id: 1,
    name: "Row Boat",
    cargo_capacity: 5,
    inventory_slots: 1,
    attack_rating: 1,
    speed: 10_000,
  },
  2: {
    ship_type_id: 2,
    name: "Sloop",
    cargo_capacity: 100,
    inventory_slots: 1,
    attack_rating: 10,
    speed: 5_000,
  },
}

export const getShipTypeById = (id: number): ShipType => {
  return addGlobalID("ship_type", "shipTypeId", shipTypes[id])
}

export const resolvers: Resolvers = {
  Query: {
    getShipTypeFromId: (obj, { shipTypeId }) => {
      return getShipTypeById(shipTypeId)
    },
  },
}
