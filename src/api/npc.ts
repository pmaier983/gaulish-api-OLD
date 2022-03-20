import { getShipTypeById } from "./ship_type"
import { getTilesFromXYPath } from "./../utils/utils"
import gql from "graphql-tag"

import { Resolvers } from "@/graphql-types"

export const typeDefs = gql`
  extend type Query {
    getAllNpcs: [Npc!]!
  }

  type Npc implements Node {
    id: ID!
    start_time: Int!
    path: [Tile!]!
    should_repeat: Boolean!
    ship_type: ShipType!
  }
`

export const resolvers: Resolvers = {
  Query: {
    getAllNpcs: async (obj, args, context) => {
      return [
        {
          id: "0",
          start_time: 0,
          path: await getTilesFromXYPath(context.db, [
            [5, 1],
            [4, 1],
            [3, 1],
            [3, 2],
            [3, 3],
            [2, 3],
            [2, 4],
            [2, 5],
            [3, 5],
            [4, 5],
            [4, 4],
            [5, 4],
            [5, 3],
            [5, 2],
          ]),
          should_repeat: true,
          ship_type: getShipTypeById(1),
        },
        {
          id: "1",
          start_time: 0,
          path: await getTilesFromXYPath(context.db, [
            [0, 4],
            [0, 5],
            [0, 6],
            [1, 6],
            [2, 6],
            [2, 5],
            [2, 4],
            [1, 4],
          ]),
          should_repeat: true,
          ship_type: getShipTypeById(2),
        },
      ]
    },
  },
}
