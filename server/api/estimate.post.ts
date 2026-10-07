import { fetchMarketQuote } from '../utils/carhauler'
import { estimatePrice, haversineMiles, priceFromMarket, roadMiles, type TrailerType, type VehicleType } from '../utils/pricing'

interface ZippopotamResponse {
  places: { 'place name': string, 'state abbreviation': string, latitude: string, longitude: string }[]
}

async function lookupZip(zip: string) {
  try {
    const data = await $fetch<ZippopotamResponse>(`https://api.zippopotam.us/us/${zip}`)
    const place = data.places[0]!
    return {
      label: `${place['place name']}, ${place['state abbreviation']}`,
      lat: Number(place.latitude),
      lon: Number(place.longitude)
    }
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'zip_not_found', data: { zip } })
  }
}

const VEHICLES: VehicleType[] = ['sedan', 'suv', 'pickup', 'van', 'motorcycle']

export default defineEventHandler(async (event) => {
  const body = await readBody<{ from?: string, to?: string, vehicle?: string, trailer?: string, runs?: boolean }>(event)
  const from = String(body.from ?? '').trim()
  const to = String(body.to ?? '').trim()

  if (!/^\d{5}$/.test(from) || !/^\d{5}$/.test(to)) {
    throw createError({ statusCode: 400, statusMessage: 'invalid_zip' })
  }

  const vehicle = VEHICLES.includes(body.vehicle as VehicleType) ? (body.vehicle as VehicleType) : 'sedan'
  const trailer: TrailerType = body.trailer === 'enclosed' ? 'enclosed' : 'open'
  const runs = body.runs !== false

  const market = await fetchMarketQuote(from, to, vehicle, runs)
  if (market) {
    return {
      origin: market.origin,
      destination: market.destination,
      miles: market.miles,
      ...priceFromMarket(market.price, trailer)
    }
  }

  const [origin, destination] = await Promise.all([lookupZip(from), lookupZip(to)])
  const miles = roadMiles(haversineMiles(origin, destination))

  return {
    origin: origin.label,
    destination: destination.label,
    miles,
    ...estimatePrice(miles, vehicle, trailer, runs)
  }
})
