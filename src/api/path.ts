import gql from "graphql-tag"

import { Path, Resolvers } from "@/generated/graphql"
import { shipTypes } from "./ship_type"
import { shipPathArrayFromString } from "@/utils"
import { LogTypes, setLog } from "./log"

import type { Context } from "@/context"
import type { Database } from "@/database"

export const typeDefs = gql`
  extend type Mutation {
    isShipSailing(ship_id: Int!): Boolean
    setShipPath(ship_id: Int!, shipPath: String!): String #TODO: error properly?
  }

  type Path implements Node {
    id: ID!
    path_id: Int!
    ship_id: Int!
    start_time: Int!
    path: String! # x,y,tile_id|x,y,tile_id|x,y,tile_id|...
  }
`

type IsShipSailingTask = {
  (param: { ship_id: number; taskDb: Database }): Promise<boolean>
}

const isShipSailingTask: IsShipSailingTask = async ({ taskDb, ship_id }) => {
  const mostRecentPath: Path = await taskDb.one(
    `SELECT * FROM public.path 
WHERE ship_id = $(ship_id) 
ORDER BY path_id DESC 
LIMIT 1`,
    { ship_id }
  )

  const shipPathArray = shipPathArrayFromString(mostRecentPath.path)

  const ship_type_id = await taskDb.one(
    `select ship_type_id from public.ship where ship_id = $1`,
    ship_id,
    (val) => val.ship_type_id
  )

  const shipSpeed = shipTypes[ship_type_id].speed

  const journeyLength = shipPathArray.length

  /* Calculate Time to Destination */
  const endTime = journeyLength * shipSpeed + mostRecentPath.start_time

  return endTime < Date.now()
}

interface IsShipSailingOverload extends IsShipSailingTask {
  (param: { ship_id: number; context: Context }): Promise<boolean>
}

const isShipSailingOverload: IsShipSailingOverload = async ({
  ship_id,
  context,
  taskDb,
}) => {
  if (taskDb) return isShipSailingTask({ ship_id, taskDb })
  return context.db.task(async (newTaskDb) =>
    isShipSailingTask({ ship_id, taskDb: newTaskDb })
  )
}

export { isShipSailingOverload as isShipSailing }

export const resolvers: Resolvers = {
  Mutation: {
    isShipSailing: async (_obj, { ship_id }, context) =>
      await isShipSailingOverload({ ship_id, context }),
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
