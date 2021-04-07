import gql from "graphql-tag"

export const typeDefs = gql`
  extend type Query {
    books: [Book]
  }
  type Book implements Node {
    title: String!
    author: String!
  }
`

export const resolvers = {
  Query: {
    books: async (props) => [
      {
        id: 1,
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
      },
      {
        id: 2,
        title: "The Wise Man's Fear",
        author: "Patrick Rothfuss",
      },
    ],
  },
}
