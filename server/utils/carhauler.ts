// Market price from CarHauler247's free public quote API (v1, no key, rate-limited by IP).
// Docs: https://carhauler247.com/api-docs
import type { VehicleType } from './pricing'

interface CarHaulerResponse {
  success: boolean
  quote?: {
    price: number
    distance: number
    from: { city: string, state: string }
    to: { city: string, state: string }
  }
}

// CarHauler247 doesn't quote motorcycles; those fall back to our own formula.
const SUPPORTED: Partial<Record<VehicleType, string>> = {
  sedan: 'sedan',
  suv: 'suv',
  pickup: 'pickup',
  van: 'van'
}

export async function fetchMarketQuote(fromZip: string, toZip: string, vehicle: VehicleType, runs: boolean) {
  const vehicleType = SUPPORTED[vehicle]
  if (!vehicleType) return null

  try {
    const data = await $fetch<CarHaulerResponse>('https://carhauler247.com/api/public/v1/quote', {
      query: { fromZip, toZip, vehicleType, isOperational: runs },
      timeout: 6000
    })
    const q = data.quote
    if (!data.success || !q || !(q.price > 0)) return null
    return {
      price: q.price,
      miles: q.distance,
      origin: `${q.from.city}, ${q.from.state}`,
      destination: `${q.to.city}, ${q.to.state}`
    }
  } catch {
    return null
  }
}
