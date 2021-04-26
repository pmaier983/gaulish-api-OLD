import db from "@/database"
import { Database } from "database"
import { DataLoaders, dataLoaders } from "./dataloaders"

export interface Context {
  db: Database
  dataLoaders: DataLoaders
}

export const context: Context = {
  db,
  dataLoaders,
}
