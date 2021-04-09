import gql from "graphql-tag"

export const typeDefs = gql`
  extend type Query {
    tiles: [Tile]
  }
  type Tile implements Node {
    id: ID!
    tile_id: Int
    x: Int
    y: Int
  }
`

export const resolvers = {
  Query: {
    tiles: async (props) => [
      {
        id: 1,
        tile_id: 1,
        x: 1,
        y: 1,
      },
    ],
  },
}
