import gql from "graphql-tag"

import type { User } from "@/graphql-types"
import { addGlobalID } from "@/utils"

export const typeDefs = gql`
  extend type Query {
    getUserByUsername(username: String): User
  }

  type User implements Node {
    id: ID!
    email: String
    time_created: String # Postgres return BigInts as strings to avoid Overflow
    username: String
    uuid: Int # TODO possibly limit access to this
  }
`

export const resolvers = {
  Query: {
    getUserByUsername: async (obj, { username }, context) => {
      const user: User = await context.dataLoaders.userByUsernameDataLoader.load(
        username
      )
      return addGlobalID<User>("user", "uuid", user)
    },
  },
}
