import express from "express"
import { graphqlHTTP } from "express-graphql"

import { schema } from "./schema"
import db from "@/database"

// TODO: GZIP response
// TODO: setup a dataLoader

// Create a server:
const app = express()

// Use those to handle incoming requests:
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    context: {
      db,
    },
    // TODO is there a better pattern then this IIFE?
    ...(() => {
      if (process.env.NODE_ENV === "development")
        return {
          graphiql: true,
          customFormatErrorFn: (error) => ({
            message: error.message,
            locations: error.locations,
            stack: error.stack ? error.stack.split("\n") : [],
            path: error.path,
          }),
        }
    })(),
  })
)

// Start the server:
app.listen(8080, () =>
  console.log("Server started on port http://localhost:8080")
)
