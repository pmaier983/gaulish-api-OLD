import _ from "lodash/fp"

import * as tile from "./tile"
import * as token from "./token"
import * as user from "./user"
import * as chat from "./chat"
import * as city from "./city"

const types = [tile, token, user, chat, city]

export const typeDefs = _.flow(_.map("typeDefs"), _.flatten)(types)
export const resolvers = _.flow(_.map("resolvers"), _.mergeAll)(types)
