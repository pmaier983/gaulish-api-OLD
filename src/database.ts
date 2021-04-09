import { Pool } from "pg"

const {
  RDS_USER,
  RDS_PASSWORD,
  RDS_HOST,
  RDS_DATABASE,
  GRAPHQL_PORT,
} = process.env

const pool = new Pool({
  user: RDS_USER,
  host: RDS_HOST,
  database: RDS_DATABASE,
  password: RDS_PASSWORD,
  port: parseInt(GRAPHQL_PORT, 10),
})

// TODO: set this thing up to handle transactions
export const query = pool.query
