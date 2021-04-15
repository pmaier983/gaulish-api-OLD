import db from "@/database"
import pgPromise from "pg-promise"
import pg from "pg-promise/typescript/pg-subset"

export interface Context {
  db: pgPromise.IDatabase<any, pg.IClient>
}

export const context: Context = {
  db,
}
