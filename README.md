### API for Gaulish.io

MVP Plan:

On-Login

- Q createUser (password, username, email) => user
- Q loginUser/verifyUser? (password, username) => user
- Q getUserInfo => gold?

- Q getMapSection (size, x, y) => map matrix
- Q getEnemies (size, x, y) => enemies[]
- Q getShips (size, x, y) => ships[]

- M sendShipOnJourney (ship_id, uuid?, shipPath) => boolean
