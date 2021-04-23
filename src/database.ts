import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"

const { RDS_USER, RDS_PASSWORD, RDS_HOST, RDS_DATABASE, RDS_PORT } = process.env

// TODO: look into pg-promise config options
// TODO: setup some "sql views" to make queries efficient!
const db = pgPromise({})({
  user: RDS_USER,
  host: RDS_HOST,
  database: RDS_DATABASE,
  password: RDS_PASSWORD,
  port: parseInt(RDS_PORT, 10),
})

// TODO: proper type instead of unknown
export type Database = pgPromise.IDatabase<unknown, pg.IClient>

// TODO: setup logging (speed & error)
// Winston? aws-alternative?
export default db
