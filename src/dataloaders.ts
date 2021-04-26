import DataLoader from "dataloader"

import { Tile } from "@/graphql-types"
import db from "@/database"

type TileDataLoader = DataLoader<number, Tile>
export const tileDataLoader: () => TileDataLoader = () =>
  new DataLoader(async (ids) => {
    const tiles: Tile[] = await db.any(
      "SELECT * FROM public.tile where tile_id in ($1)",
      ids.join()
    )
    const tileMap = tiles.reduce((acc, tile) => {
      acc[tile.tile_id] = tile
      return acc
    }, {})
    return ids.map((id) => tileMap[id])
  })

export interface DataLoaders {
  tileDataLoader: TileDataLoader
}

export const dataLoaders = {
  tileDataLoader: tileDataLoader(),
}
