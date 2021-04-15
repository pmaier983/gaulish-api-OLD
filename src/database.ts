import pgPromise from "pg-promise"

const { RDS_USER, RDS_PASSWORD, RDS_HOST, RDS_DATABASE, RDS_PORT } = process.env

// TODO: look into pg-promise config options
const db = pgPromise({})({
  user: RDS_USER,
  host: RDS_HOST,
  database: RDS_DATABASE,
  password: RDS_PASSWORD,
  port: parseInt(RDS_PORT, 10),
})

// TODO: setup logging (speed & error)
export default db
