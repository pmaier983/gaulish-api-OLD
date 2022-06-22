import _ from "lodash/fp"

import * as tile from "./tile"
import * as token from "./token"
import * as user from "./user"
import * as city from "./city"
import * as ship from "./ship"
import * as chat from "./chat"
import * as npc from "./npc"
import * as path from "./path"
import * as ship_type from "./ship_type"

const types = [tile, token, user, city, ship, chat, npc, ship_type, path]

export const typeDefs = _.flow(_.map("typeDefs"), _.flatten)(types)
export const resolvers = _.flow(_.map("resolvers"), _.mergeAll)(types)
