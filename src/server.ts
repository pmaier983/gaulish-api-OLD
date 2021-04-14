import express from "express"
import { graphqlHTTP } from "express-graphql"

import { schema } from "./schema"

// TODO: GZIP response
// TODO: setup a dataLoader

// Create a server:
const app = express()

// Use those to handle incoming requests:
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
)

// Start the server:
app.listen(8080, () =>
  console.log("Server started on port http://localhost:8080")
)
