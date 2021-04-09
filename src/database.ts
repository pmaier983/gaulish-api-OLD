import { Pool } from "pg"

const { RDS_USER, RDS_PASSWORD, RDS_HOST, RDS_DATABASE, RDS_PORT } = process.env

// console.log(parseInt(GRAPHQL_PORT, 10))

const pool = new Pool({
  user: RDS_USER,
  host: RDS_HOST,
  database: RDS_DATABASE,
  password: RDS_PASSWORD,
  port: parseInt(RDS_PORT, 10),
})

// TODO: set this thing up to handle transactions
// TODO: properly type query
export const query = (props) => pool.query(props)
