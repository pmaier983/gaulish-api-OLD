import express from "express"
import { graphqlHTTP } from "express-graphql"
import { buildSchema } from "graphql"

// TODO: set things up using docker

// Create a server:
const app = express()

// Create a schema and a root resolver:
const schema = buildSchema(`
    type Book {
        title: String!
        author: String!
    }

    type Query {
        books: [Book]
    }
`)

const rootValue = {
  books: [
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
    },
    {
      title: "The Wise Man's Fear",
      author: "Patrick Rothfuss",
    },
  ],
}

// Use those to handle incoming requests:
app.use(
  graphqlHTTP({
    schema,
    rootValue,
  })
)

// Start the server:
app.listen(8080, () => console.log("Server started on port 8080"))
