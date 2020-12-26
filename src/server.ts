import express from "express";
import postgraphile from "postgraphile";

const app = express();

const { RDS_USER, RDS_PASSWORD, RDS_HOST, RDS_DATABASE, PORT } = process.env;

app.use(
  postgraphile(
    `postgres://${RDS_USER}:${RDS_PASSWORD}@${RDS_HOST}/${RDS_DATABASE}`,
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  )
);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/graphiql`)
);
