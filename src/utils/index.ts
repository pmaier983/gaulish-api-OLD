import { isArray } from "lodash"

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
