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
    setLog(type: Int!, text: String!): Int! # TODO: return int or boolean?
  }

  type Log implements Node {
    id: ID!
    log_id: Int!
    uuid: Int!
    text: String
    type: Int!
  }
`

export const setLog = async ({
  type,
  text,
  context,
}: {
  type: typeof LogTypes
  text: string
  context: Context
}): Promise<number> =>
  context.db.one(
    `insert into public.log 
  (text, type, uuid) values 
  ($(text), $(type), $(uuid)) 
  returning log_id`,
    {
      uuid: 1,
      type,
      text,
    },
    (res) => parseInt(res.log_id, 10)
  )

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
    setLog: async (obj, { type, text }, context) => {
      // TODO: affirm type is LogTypes
      const theType: any = type
      return await setLog({ type: theType, text, context })
    },
  },
}
