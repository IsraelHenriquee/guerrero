<script setup lang="ts">
import type { QuoteEstimate } from '~/composables/useQuote'

const { t } = useI18n()
const form = useQuoteForm()
const whatsAppLink = useWhatsAppLink()

const estimate = ref<QuoteEstimate | null>(null)
const loading = ref(false)
const error = ref('')
const resultEl = ref<HTMLElement | null>(null)

const vehicles = ['sedan', 'suv', 'pickup', 'van', 'motorcycle'] as const

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

async function submit() {
  loading.value = true
  error.value = ''
  estimate.value = null
  try {
    estimate.value = await $fetch<QuoteEstimate>('/api/estimate', { method: 'POST', body: form.value })
    // On phones the result renders below the fold, so bring it into view.
    await nextTick()
    resultEl.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  } catch (e: any) {
    const code = e?.data?.statusMessage
    error.value = code === 'invalid_zip' || code === 'zip_not_found'
      ? t(`quote.errors.${code}`, { zip: e.data.data?.zip })
      : t('quote.errors.generic')
  } finally {
    loading.value = false
  }
}

// Clear the old estimate when the route changes.
watch(() => [form.value.from, form.value.to], () => { estimate.value = null })

const whatsAppUrl = computed(() => {
  const f = form.value
  const e = estimate.value
  const lines = [
    t('quote.wa.intro'),
    `${t('quote.wa.from')}: ${e?.origin ?? ''} (${f.from})`,
    `${t('quote.wa.to')}: ${e?.destination ?? ''} (${f.to})`,
    `${t('quote.wa.vehicle')}: ${f.car || t(`quote.vehicles.${f.vehicle}`)}`,
    `${t('quote.wa.trailer')}: ${t(`quote.${f.trailer}`)}`,
    `${t('quote.wa.runs')}: ${f.runs ? t('quote.yes') : t('quote.no')}`
  ]
  if (f.date) lines.push(`${t('quote.wa.date')}: ${f.date}`)
  if (e) lines.push(`${t('quote.wa.estimate')}: ${money(e.low)} - ${money(e.high)}`)
  return whatsAppLink(lines.join('\n'))
})

const fieldClass = 'min-h-12 w-full rounded-md border-2 border-ink/15 bg-white px-3 py-2.5 text-ink placeholder:text-ink/40 focus:border-volt-deep focus:outline-none transition-colors'
const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/60'
</script>

<template>
  <div id="quote" class="scroll-mt-24 overflow-hidden rounded-xl bg-paper text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
    <div class="h-2 lane-line bg-ink" />

    <form class="p-5 sm:p-7" @submit.prevent="submit">
      <div class="mb-5 flex items-end justify-between gap-4">
        <h2 class="font-display text-3xl font-extrabold uppercase leading-none">{{ t('quote.title') }}</h2>
        <span class="shrink-0 text-xs font-semibold uppercase tracking-widest text-ink/50">{{ t('quote.badge') }}</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label :class="labelClass" for="from">{{ t('quote.from') }}</label>
          <input id="from" v-model="form.from" :class="fieldClass" inputmode="numeric" maxlength="5" pattern="\d{5}" placeholder="32801" required>
        </div>
        <div>
          <label :class="labelClass" for="to">{{ t('quote.to') }}</label>
          <input id="to" v-model="form.to" :class="fieldClass" inputmode="numeric" maxlength="5" pattern="\d{5}" placeholder="33130" required>
        </div>
      </div>

      <fieldset class="mt-4">
        <legend :class="labelClass">{{ t('quote.vehicleType') }}</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="v in vehicles" :key="v" class="cursor-pointer">
            <input v-model="form.vehicle" type="radio" name="vehicle" :value="v" class="peer sr-only">
            <span class="block rounded-md border-2 border-ink/15 px-3 py-2 text-sm font-semibold transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-volt-light peer-focus-visible:ring-2 peer-focus-visible:ring-volt">
              {{ t(`quote.vehicles.${v}`) }}
            </span>
          </label>
        </div>
      </fieldset>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label :class="labelClass" for="trailer">{{ t('quote.trailer') }}</label>
          <select id="trailer" v-model="form.trailer" :class="fieldClass">
            <option value="open">{{ t('quote.open') }}</option>
            <option value="enclosed">{{ t('quote.enclosed') }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass" for="runs">{{ t('quote.runs') }}</label>
          <select id="runs" v-model="form.runs" :class="fieldClass">
            <option :value="true">{{ t('quote.yes') }}</option>
            <option :value="false">{{ t('quote.no') }}</option>
          </select>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label :class="labelClass" for="car">{{ t('quote.car') }}</label>
          <input id="car" v-model="form.car" :class="fieldClass" :placeholder="t('quote.carPlaceholder')">
        </div>
        <div>
          <label :class="labelClass" for="date">{{ t('quote.date') }}</label>
          <input id="date" v-model="form.date" type="date" :class="fieldClass">
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="mt-6 w-full rounded-md bg-volt-deep px-5 py-3.5 font-display text-xl font-extrabold uppercase tracking-wide text-white transition hover:bg-volt disabled:opacity-60"
      >
        {{ loading ? t('quote.loading') : t('quote.submit') }}
      </button>

      <p v-if="error" class="mt-3 text-sm font-semibold text-red-700">{{ error }}</p>
    </form>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
    >
      <div v-if="estimate" ref="resultEl" class="scroll-mb-24 border-t-2 border-dashed border-ink/20 bg-paper-2 p-6 sm:p-7">
        <p class="text-sm font-semibold text-ink/60">
          {{ estimate.origin }} → {{ estimate.destination }} · ~{{ estimate.miles.toLocaleString('en-US') }} mi
        </p>
        <p class="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">{{ t('quote.priceLabel') }}</p>
        <p class="font-display text-5xl font-black leading-none">
          {{ money(estimate.low) }}<span class="text-ink/40"> – </span>{{ money(estimate.high) }}
        </p>
        <p class="mt-2 text-sm text-ink/60">{{ t('quote.disclaimer') }}</p>
        <a
          :href="whatsAppUrl"
          target="_blank"
          rel="noopener"
          class="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-3.5 font-semibold text-ink transition hover:brightness-95"
        >
          <WhatsAppIcon class="size-5" />
          {{ t('quote.whatsappCta') }}
        </a>
      </div>
    </Transition>
  </div>
</template>
