import gql from "graphql-tag"

import { Log, Resolvers } from "@/graphql-types"
import { Context } from "@/context"
import { addGlobalID } from "@/utils"

// TODO: share between code bases.
export enum LogTypes {
  "BASIC" = 10,
}

export const typeDefs = gql`
  extend type Query {
    getRecentLogs: [Log]
  }

  extend type Mutation {
    setLog(type: Int!, text: String!, timestamp: Int): Int! # TODO: return int or boolean?
  }

  type Log implements Node {
    id: ID!
    log_id: Int!
    uuid: Int!
    text: String!
    type: Int!
    timestamp: Int!
  }
`

type SetLog = {
  (params: {
    type: LogTypes
    text: string
    timestamp?: number
    context: Context
  }): Promise<number>
  (params: {
    type: LogTypes
    text: string
    timestamp?: number
    taskDb: Database
  }): Promise<number>
}

export const setLog: SetLog = async ({
  type,
  text,
  timestamp,
  context,
  taskDb,
}) => {
  const db = taskDb ? taskDb : context.db
  return db.one(
    `insert into public.log 
  (text, type, uuid, timestamp) values 
  ($(text), $(type), $(uuid), $(timestamp)) 
  returning log_id`,
    {
      uuid: 1,
      type,
      text,
      timestamp: Number.isNaN(timestamp) ? Date.now() : timestamp,
    },
    (res) => parseInt(res.log_id, 10)
  )
}

export const resolvers: Resolvers = {
  Query: {
    getRecentLogs: async (obj, {}, context) => {
      const logs: Log[] = await context.db.many(
        `select * from public.log 
      where uuid = $(uuid) 
      limit 10`,
        { uuid: 1 }
      )
      return addGlobalID<Log[]>("log", "log_id", logs)
    },
  },
  Mutation: {
    setLog: async (obj, { type, text, timestamp }, context) => {
      // TODO: affirm type is LogTypes
      const theType: any = type
      return await setLog({ type: theType, text, timestamp, context })
    },
  },
}
