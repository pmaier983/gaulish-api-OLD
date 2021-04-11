import pgPromise from "pg-promise"

const { RDS_USER, RDS_PASSWORD, RDS_HOST, RDS_DATABASE, RDS_PORT } = process.env

// TODO: look into pg-promise config options
const pool = pgPromise({})({
  user: RDS_USER,
  host: RDS_HOST,
  database: RDS_DATABASE,
  password: RDS_PASSWORD,
  port: parseInt(RDS_PORT, 10),
})

// TODO: set this thing up to handle transactions
// TODO: properly type query
export default pool
