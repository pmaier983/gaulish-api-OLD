import _ from "lodash/fp"

import * as tile from "./tile"
import * as token from "./token"
import * as user from "./user"
import * as city from "./city"
import * as ship from "./ship"

const types = [tile, token, user, city, ship]

export const typeDefs = _.flow(_.map("typeDefs"), _.flatten)(types)
export const resolvers = _.flow(_.map("resolvers"), _.mergeAll)(types)
