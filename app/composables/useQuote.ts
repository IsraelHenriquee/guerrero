export interface QuoteForm {
  from: string
  to: string
  vehicle: 'sedan' | 'suv' | 'pickup' | 'van' | 'motorcycle'
  trailer: 'open' | 'enclosed'
  runs: boolean
  car: string
  date: string
}

export interface QuoteEstimate {
  origin: string
  destination: string
  miles: number
  low: number
  high: number
}

// Shared so the "popular routes" signs can prefill the quote form.
export function useQuoteForm() {
  return useState<QuoteForm>('quote-form', () => ({
    from: '',
    to: '',
    vehicle: 'sedan',
    trailer: 'open',
    runs: true,
    car: '',
    date: ''
  }))
}

export function useWhatsAppLink() {
  const { company } = useAppConfig()
  return (message: string) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`
}
