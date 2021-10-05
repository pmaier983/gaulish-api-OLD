# API for Gaulish.io

## Queries

- createUser (password, username, email) => user
- loginUser/verifyUser? (password, username) => user

- getMap () => tiles[]
- getCities () => cities[]
- getVisibleTileObjects () => tile_object[]

## Mutations

- setSail (path, shipId): {success: boolean, message: string}

- buyCargo (type, amount): {success: boolean, message: string}
- sellCargo (type, amount): {success: boolean, message: string}

- buyShip (type): {success: boolean, message: string}
