// Price model for the instant estimate.
// The main source is CarHauler247's market price (see carhauler.ts) plus MARKET_MARKUP.
// When that API is unavailable we fall back to Carlos's rule of thumb:
// a cheap mile is about $0.50 and an expensive one about $1.00.
// Short trips pay the higher rate per mile; long cross-country trips pay the lower one.

export type VehicleType = 'sedan' | 'suv' | 'pickup' | 'van' | 'motorcycle'
export type TrailerType = 'open' | 'enclosed'

const MAX_RATE = 1.0 // $/mile for trips up to SHORT_TRIP_MILES
const MIN_RATE = 0.5 // $/mile for trips of LONG_TRIP_MILES or more
const SHORT_TRIP_MILES = 500
const LONG_TRIP_MILES = 2500
const MINIMUM_PRICE = 350 // TODO: confirm with Carlos the lowest price he'd accept for short trips

const VEHICLE_MULTIPLIER: Record<VehicleType, number> = {
  sedan: 1,
  suv: 1.12,
  pickup: 1.2,
  van: 1.25,
  motorcycle: 0.7
}

// Margin added on top of CarHauler247's price (0.10 = +10%). TODO: confirm with Carlos.
const MARKET_MARKUP = 0

const ENCLOSED_MULTIPLIER = 1.45
const INOPERABLE_FEE = 150

// Straight-line distance is shorter than the road; this approximates driving miles.
const ROAD_FACTOR = 1.18

export function haversineMiles(a: { lat: number, lon: number }, b: { lat: number, lon: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(h))
}

export function roadMiles(straightMiles: number) {
  return Math.round(straightMiles * ROAD_FACTOR)
}

export function ratePerMile(miles: number) {
  const t = Math.min(Math.max((miles - SHORT_TRIP_MILES) / (LONG_TRIP_MILES - SHORT_TRIP_MILES), 0), 1)
  return MAX_RATE - t * (MAX_RATE - MIN_RATE)
}

export function estimatePrice(miles: number, vehicle: VehicleType, trailer: TrailerType, runs: boolean) {
  let price = miles * ratePerMile(miles)
  price *= VEHICLE_MULTIPLIER[vehicle]
  if (trailer === 'enclosed') price *= ENCLOSED_MULTIPLIER
  if (!runs) price += INOPERABLE_FEE
  return priceRange(price)
}

// CarHauler247's v1 API has no trailer option, so enclosed is applied here.
export function priceFromMarket(marketPrice: number, trailer: TrailerType) {
  let price = marketPrice * (1 + MARKET_MARKUP)
  if (trailer === 'enclosed') price *= ENCLOSED_MULTIPLIER
  return priceRange(price)
}

function priceRange(price: number) {
  price = Math.max(price, MINIMUM_PRICE)
  const roundTo10 = (n: number) => Math.round(n / 10) * 10
  return { low: roundTo10(price * 0.92), high: roundTo10(price * 1.08) }
}
