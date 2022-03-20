import { isArray } from "lodash"

import { Database } from "@/database"
import { Tile } from "@/generated/graphql"

// TODO: make add GlobalID take a unique id instead of inferring one
// a generic Item will have an id added
// id = Base64Encode(table_title + table_PK_id)
// we use base64 encoding to make the id smaller & to ensure the id is only used as an id
export const addGlobalID = <Item>(
  table_title: string,
  path: string,
  item: Item
  // TODO Figure out generics here...
): ({ id: string } & Item)[] | any => {
  if (isArray(item)) {
    return item.map((entity) => ({
      ...entity,
      // binary to handle non-ascii characters
      id: Buffer.from(`${table_title}:${entity?.[path]}`, "binary").toString(
        "base64"
      ),
    }))
  }
  return {
    ...item,
    id: Buffer.from(`${table_title}:${item?.[path]}`, "binary").toString(
      "base64"
    ),
  }
}

export const getTilesFromXYPath = async (
  db: Database,
  path: [x: number, y: number][]
): Promise<Tile[]> => {
  const querySectionPoints = path
    .map(([x, y]) => `((x=${x}) AND (y=${y}))`)
    .join(" OR ")
  const query = `SELECT * FROM public.tile WHERE ${querySectionPoints}`
  const tiles: Tile[] = await db.many(query)
  const tilesDictionary = tiles.reduce((acc, cur) => {
    acc[`${cur.x}:${cur.y}`] = cur
    return acc
  }, {})
  const sortedTiles = path.map(([x, y]) => {
    return tilesDictionary[`${x}:${y}`]
  })
  return addGlobalID<Tile[]>("tile", "tile_id", sortedTiles)
}
