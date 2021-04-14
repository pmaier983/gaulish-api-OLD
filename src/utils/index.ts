import _ from "lodash/fp"

// a generic arrayItem will have an id added
// id = Base64Encode(table_title + table_PK_id)
// we use base64 encoding to make the id smaller & to ensure the id is only used as an id
// TODO: should I use another
export const addGlobalID = _.curry(
  <arrayItem>(
    table_title: string,
    path: string,
    array: arrayItem[]
  ): ({ id: string } & arrayItem)[] => {
    return array.map((item) => ({
      ...item,
      // binary to handle non-ascii characters
      id: Buffer.from(`${table_title}:${_.get(path, item)}`, "binary").toString(
        "base64"
      ),
    }))
  }
)
