import db from "@/database"
import { Database } from "database"
import { DataLoaders, dataLoaders } from "./dataLoaders"
import { User } from "@/generated/graphql"

export interface Context {
  db: Database
  dataLoaders: DataLoaders
  user: User
}

export const context: Context = {
  db,
  dataLoaders,
  user: { id: "Shit Something went wrong" }, // TODO: how to initialize this?
}
