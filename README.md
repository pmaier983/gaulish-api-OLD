# API for Gaulish.io

## V1

### Queries

- createUser (password, username, email) => user
- loginUser/verifyUser? (password, username) => user

- getMap () => tiles[]
- getCities () => cities[]
- getShips (uuid) => ships[]

### Mutations

- setSail (path, shipId): => {success: boolean, message: string}
