// import express from "express"
// import postgraphile from "postgraphile"
// import compression from "compression"

// const app = express()

// const {
//   RDS_USER,
//   RDS_PASSWORD,
//   RDS_HOST,
//   RDS_DATABASE,
//   GRAPHQL_PORT,
// } = process.env

// app.use(compression())

// app.use(
//   postgraphile(
//     `postgres://${RDS_USER}:${RDS_PASSWORD}@${RDS_HOST}/${RDS_DATABASE}`,
//     "public",
//     // TODO: change this in production
//     {
//       watchPg: true,
//       graphiql: true,
//       enhanceGraphiql: true,
//       pgSettings: {
//         // This will help prevent DDoS attacks
//         statement_timeout: "6000",
//       },
//     }
//   )
// )

// app.listen(GRAPHQL_PORT, () =>
//   console.log(`Server running at http://localhost:${GRAPHQL_PORT}/graphiql`)
// )
