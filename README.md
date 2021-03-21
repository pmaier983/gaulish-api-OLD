### API for Gaulish.io

PATHWAYS:

On-Login

- Q verifyUser (password, username) => token
- Q getUserStats (uuid) => gold?
- Q getItems (uuid) => items (on ship & items)

- Q getMap (size, center tile_id?) => [number, number][]
- Q getShips (uuid) => ship[] (both moving and docked) // subscription
- Q getEnemies (uuid?) => enemies[] // subscription?

Actions (Ship Journeys)

- M sendShipOnJourney (ship, path) => ship&path

City

- Q getItemsForPurchase (city, modifier) => items[]
- Q getCargoPrices (city) => prices[]
- M purchaseCargoFromCity (uuid) => cargo
- M sellToCity (item, amount, price?) => new cargo
