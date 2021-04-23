import db from "@/database"
import { Database } from "database"

export interface Context {
  db: Database
}

export const context: Context = {
  db,
}
