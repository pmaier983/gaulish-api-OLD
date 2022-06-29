import gql from "graphql-tag"

import { Resolvers } from "@/generated/graphql"
import { shipTypes } from "./ship_type"
import { shipPathArrayFromString } from "@/utils"

export const typeDefs = gql`
  extend type Mutation {
    setShipPath(ship_id: Int!, shipPath: String!): Boolean #TODO: error properly?
  }

  type Path implements Node {
    id: ID!
    path_id: Int!
    ship_id: Int!
    start_time: Int!
    path: String! # x,y,tile_id|x,y,tile_id|x,y,tile_id|...
  }
`

export const resolvers: Resolvers = {
  Mutation: {
    setShipPath: async (_obj, { ship_id, shipPath }, context) => {
      // TODO: duplicate validation here!
      // TODO why not just use template literals

      const shipPathArray = shipPathArrayFromString(shipPath)

      context.db.task(async (taskDb) => {
        taskDb.one(
          "insert into public.path (ship_id, start_time, path) values (${ship_id}, ${start_time}, ${shipPath})",
          {
            ship_id,
            start_time: Date.now(),
            shipPath,
          }
        )

        const ship_type_id = await taskDb.one(
          `select ship_type_id from public.ship where ship_id = $1`,
          ship_id
        )
        const shipSpeed = shipTypes[ship_type_id].speed

        const journeyLength = shipPathArray.length
        const timeToDestination = journeyLength * shipSpeed

        const destinationCityId = await taskDb.one(
          `select city_id from public.city where tile_id = $1`,
          shipPathArray.at(-1).tile_id
        )

        setTimeout(() => {
          taskDb.one(
            "update public.ship set city_id = ${destinationCityId} where ship_id = ${ship_id}",
            { destinationCityId, ship_id }
          )
        }, timeToDestination)
      })

      return false
    },
  },
}
