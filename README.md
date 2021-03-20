### API for Gaulish.io

PATHWAYS:

- Q verifyUser (password, username) => token
- Q getUserStats (uuid) => gold?
- Q getMap (size, center tile_id?) => [number, number][]
- Q getShips (uuid) => ship[] (both moving and docked)
- Q getItems (uuid) => items (on ship & items)
- M sendShipOnJourney => ship&path
