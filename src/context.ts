import db from "@/database"
import { Database } from "database"
import { DataLoaders, dataLoaders } from "./dataLoaders"

export interface Context {
  db: Database
  dataLoaders: DataLoaders
}

export const context: Context = {
  db,
  dataLoaders,
}
