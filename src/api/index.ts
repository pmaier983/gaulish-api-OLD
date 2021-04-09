import _ from "lodash/fp"

import * as book from "./book"
import * as tile from "./tile"

const types = [book, tile]

export const typeDefs = _.flow(_.map("typeDefs"), _.flatten)(types)
export const resolvers = _.flow(_.map("resolvers"), _.mergeAll)(types)
