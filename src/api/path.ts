import gql from "graphql-tag"

import { Path, Resolvers } from "@/generated/graphql"
import { shipTypes } from "./ship_type"
import { shipPathArrayFromString } from "@/utils"
import { LogTypes, setLog } from "./log"

import type { Context } from "@/context"
import type { ITask } from "pg-promise"

export const typeDefs = gql`
  extend type Mutation {
    isShipSailing(ship_id: Int!): Boolean
    setShipPath(ship_id: Int!, shipPath: String!): String
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
  (param: { ship_id: number; taskDb: ITask<unknown> }): Promise<boolean>
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

type IsShipSailing = {
  (param: { ship_id: number; context: Context }): Promise<boolean>
  // TODO: don't use unknown
  (param: { ship_id: number; taskDb: ITask<unknown> }): Promise<boolean>
}

const isShipSailing: IsShipSailing = async ({
  ship_id,
  context,
  taskDb,
}: {
  ship_id: number
  context: Context
  taskDb: ITask<unknown>
}) => {
  if (taskDb) return isShipSailingTask({ ship_id, taskDb })
  return context.db.task(async (newTaskDb) =>
    isShipSailingTask({ ship_id, taskDb: newTaskDb })
  )
}

export const resolvers: Resolvers = {
  Mutation: {
    isShipSailing: async (_obj, { ship_id }, context) =>
      isShipSailing({ ship_id, context }),
    setShipPath: async (_obj, { ship_id, shipPath }, context) =>
      context.db.task(async (taskDb) => {
        // TODO: duplicate shipPath validation here!
        const shipPathArray = shipPathArrayFromString(shipPath)

        if (isShipSailing({ ship_id, taskDb })) {
          throw new Error(`You ship (ship_id: ${ship_id}) is already sailing`)
        }

        const startTime = Date.now()

        const ship_type_id = await taskDb.one(
          `select ship_type_id from public.ship where ship_id = $1`,
          ship_id,
          (val) => val.ship_type_id
        )

        const shipSpeed = shipTypes[ship_type_id].speed

        const journeyLength = shipPathArray.length

        const timeToDestination = journeyLength * shipSpeed

        const destinationCityId = await taskDb.one(
          `select city_id from public.city where tile_id = $1`,
          shipPathArray.at(-1).tile_id,
          (val) => val?.city_id
        )

        /* Calculate the events of the journey */

        /* Insert the Path into the path table */
        taskDb.one(
          "insert into public.path (ship_id, start_time, path) values (${ship_id}, ${start_time}, ${shipPath})",
          {
            ship_id,
            start_time: startTime,
            shipPath,
          }
        )

        /* Move the ship to its destination city */
        taskDb.one(
          "update public.ship set city_id = ${destinationCityId} where ship_id = ${ship_id}",
          { destinationCityId, ship_id }
        )

        /* Update the logs in the future to reflect the journey */
        setLog({
          context,
          timestamp: startTime + timeToDestination,
          text: "TODO: Ship sailed",
          type: LogTypes.IMPORTANT,
        })

        return "" // TODO: return proper ship path
      }),
  },
}
