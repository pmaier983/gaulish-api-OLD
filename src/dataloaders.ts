import DataLoader from "dataloader"

import type { Tile, User } from "@/graphql-types"
import db from "@/database"

// TODO: Error if too few items returned for DataLoader!
type TileDataLoader = DataLoader<number, Tile>
export const tileDataLoader: () => TileDataLoader = () =>
  new DataLoader(async (ids) => {
    const tiles: Tile[] = await db.many(
      "SELECT * FROM public.tile WHERE tile_id in ($1)",
      ids.join()
    )
    const tileMap = tiles.reduce((acc, tile) => {
      acc[tile.tile_id] = tile
      return acc
    }, {})
    return ids.map((id) => tileMap[id])
  })

// TODO: this assumes usernames are unique... ensure this?
type UserByUsernameDataLoader = DataLoader<string, User>
export const userByUsernameDataLoader: () => UserByUsernameDataLoader = () =>
  new DataLoader(async (ids) => {
    const users: User[] = await db.many(
      "SELECT email, time_created, username, uuid, username_update_time from public.user WHERE username in ($1)",
      ids.join()
    )
    const userMap = users.reduce((acc, user) => {
      acc[user.username] = user
      return acc
    }, {})

    return ids.map((id) => userMap[id])
  })

export interface DataLoaders {
  tileDataLoader: TileDataLoader
  userByUsernameDataLoader: UserByUsernameDataLoader
}

export const dataLoaders = {
  tileDataLoader: tileDataLoader(),
  userByUsernameDataLoader: userByUsernameDataLoader(),
}
