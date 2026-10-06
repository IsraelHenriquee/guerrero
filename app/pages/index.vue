<script setup lang="ts">
const { company } = useAppConfig()
const { t, tm, rt } = useI18n()
const whatsAppLink = useWhatsAppLink()
const chatUrl = computed(() => whatsAppLink(t('chatMessage')))

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
  ogImage: '/img/truck.jpg'
})

type Step = { title: string, text: string }
type Faq = { q: string, a: string }
const steps = computed(() => tm('how.steps') as unknown as Step[])
const faqs = computed(() => tm('faq.items') as unknown as Faq[])
const perks = computed(() => tm('hero.perks') as unknown as string[])
const clients = computed(() => tm('serve.items') as unknown as string[])

const routes = [
  { from: { city: 'Orlando, FL', zip: '32801' }, to: { city: 'Miami, FL', zip: '33130' }, miles: 235, interstate: '95' },
  { from: { city: 'Miami, FL', zip: '33130' }, to: { city: 'New York, NY', zip: '10001' }, miles: 1280, interstate: '95' },
  { from: { city: 'Los Angeles, CA', zip: '90012' }, to: { city: 'New York, NY', zip: '10001' }, miles: 2790, interstate: '80' },
  { from: { city: 'Houston, TX', zip: '77002' }, to: { city: 'Chicago, IL', zip: '60601' }, miles: 1085, interstate: '55' },
  { from: { city: 'Dallas, TX', zip: '75201' }, to: { city: 'Atlanta, GA', zip: '30303' }, miles: 780, interstate: '20' },
  { from: { city: 'New York, NY', zip: '10001' }, to: { city: 'Orlando, FL', zip: '32801' }, miles: 1070, interstate: '95' }
]
</script>

<template>
  <div>
    <!-- HEADER -->
    <header class="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <NuxtLinkLocale to="/" class="shrink-0">
          <img src="/img/logo.png" :alt="company.name" width="900" height="453" class="h-12 w-auto">
        </NuxtLinkLocale>
        <nav class="hidden items-center gap-7 text-sm font-semibold text-steel/80 md:flex">
          <a href="#how" class="hover:text-white">{{ t('nav.how') }}</a>
          <a href="#routes" class="hover:text-white">{{ t('nav.routes') }}</a>
          <a href="#faq" class="hover:text-white">{{ t('nav.faq') }}</a>
        </nav>
        <div class="flex items-center gap-2">
          <LanguageSwitcher />
          <a :href="chatUrl" target="_blank" rel="noopener" aria-label="WhatsApp" class="flex items-center gap-2 rounded-md bg-[#25D366] px-3 py-2 text-sm font-bold text-ink hover:brightness-95">
            <WhatsAppIcon class="size-4" />
            <span class="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="grain relative overflow-hidden pt-16">
      <div class="absolute inset-y-0 right-0 -z-10 w-full lg:w-[64%]">
        <img src="/img/truck.jpg" alt="" class="h-full w-full object-cover object-[65%_center] opacity-40 lg:opacity-100">
        <div class="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/10" />
        <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      </div>
      <div class="pointer-events-none absolute -top-10 bottom-0 left-[60%] -z-10 hidden w-3 -skew-x-[12deg] bg-volt shadow-[0_0_40px_6px_rgba(31,143,255,0.55)] lg:block" />

      <div class="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-8 sm:px-6 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-24">
        <div>
          <p class="rise mb-5 inline-flex items-center gap-2 rounded-full border border-volt/50 bg-night/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-volt-light" style="animation-delay: 0.05s">
            <span class="size-1.5 rounded-full bg-volt" /> {{ t('hero.badge') }}
          </p>
          <h1 class="rise font-display text-[3.4rem] font-black uppercase italic leading-[0.88] tracking-tight sm:text-7xl lg:text-[5.5rem]" style="animation-delay: 0.15s">
            <span class="chrome">{{ t('hero.title1') }}<br>{{ t('hero.title2') }}</span><br>
            <span class="text-volt">{{ t('hero.title3') }}</span>
          </h1>
          <p class="rise mt-5 max-w-md text-base text-steel sm:text-lg" style="animation-delay: 0.3s">
            {{ t('hero.subtitle') }}
          </p>
          <ul class="rise mt-8 hidden max-w-md grid-cols-2 lg:grid gap-x-6 gap-y-3 text-sm font-semibold" style="animation-delay: 0.45s">
            <li v-for="perk in perks" :key="rt(perk)" class="flex items-center gap-2">
              <span class="h-[3px] w-4 shrink-0 bg-volt" /> {{ rt(perk) }}
            </li>
          </ul>
        </div>
        <div class="rise" style="animation-delay: 0.25s">
          <QuoteForm />
        </div>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-semibold lg:hidden">
          <li v-for="perk in perks" :key="rt(perk)" class="flex items-center gap-2">
            <span class="h-[3px] w-4 shrink-0 bg-volt" /> {{ rt(perk) }}
          </li>
        </ul>
      </div>
      <div class="h-[5px] lane-line opacity-90" />
    </section>

    <!-- WHO WE SERVE -->
    <section class="border-b border-white/10 bg-night-2">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span class="text-xs font-bold uppercase tracking-[0.2em] text-steel/60">{{ t('serve.label') }}</span>
          <span v-for="c in clients" :key="rt(c)" class="flex items-center gap-2 font-display text-xl font-extrabold uppercase">
            <span class="size-2 rounded-full bg-volt" /> {{ rt(c) }}
          </span>
        </div>
        <a :href="company.phoneHref" class="shrink-0 text-sm font-semibold text-steel hover:text-white">
          {{ t('contact.callOrText') }}: <span class="text-white">{{ company.phone }}</span>
        </a>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section id="how" class="scroll-mt-16 bg-paper text-ink">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-volt-deep">{{ t('how.label') }}</p>
        <h2 class="mt-2 max-w-xl font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">{{ t('how.title') }}</h2>
        <ol class="mt-10 grid gap-10 md:grid-cols-3">
          <li v-for="(step, i) in steps" :key="i" class="relative">
            <div class="mb-5 flex items-center gap-4">
              <span class="flex h-14 w-12 flex-col items-center justify-center rounded-sm bg-volt-deep font-display text-white shadow-[0_0_0_2px_white,0_0_0_4px_var(--color-volt-deep)]">
                <span class="text-[9px] font-semibold uppercase leading-none tracking-widest">{{ t('how.mile') }}</span>
                <span class="text-2xl font-black leading-none">{{ i + 1 }}</span>
              </span>
              <span v-if="i < steps.length - 1" class="hidden h-[3px] flex-1 bg-[repeating-linear-gradient(90deg,var(--color-ink)_0_14px,transparent_14px_24px)] opacity-25 md:block" />
            </div>
            <h3 class="font-display text-2xl font-extrabold uppercase">{{ rt(step.title) }}</h3>
            <p class="mt-2 text-ink/70">{{ rt(step.text, { name: company.shortName }) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- POPULAR ROUTES -->
    <section id="routes" class="grain scroll-mt-16 bg-night-2">
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-volt-light">{{ t('routes.label') }}</p>
            <h2 class="mt-2 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">{{ t('routes.title') }}</h2>
          </div>
          <p class="max-w-xs text-steel/80">{{ t('routes.text') }}</p>
        </div>
        <div class="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          <div v-for="r in routes" :key="r.from.zip + r.to.zip" class="w-[78%] shrink-0 snap-center p-1 sm:w-auto sm:p-0">
            <RouteSign v-bind="r" />
          </div>
        </div>
      </div>
    </section>

    <!-- OPEN VS ENCLOSED -->
    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
        <div class="rounded-xl border-2 border-ink p-8">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">{{ t('trailers.open.label') }}</p>
          <h3 class="mt-2 font-display text-4xl font-black uppercase">{{ t('trailers.open.title') }}</h3>
          <p class="mt-3 text-ink/70">{{ t('trailers.open.text') }}</p>
        </div>
        <div class="rounded-xl bg-ink p-8 text-paper">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-volt-light">{{ t('trailers.enclosed.label') }}</p>
          <h3 class="mt-2 font-display text-4xl font-black uppercase">{{ t('trailers.enclosed.title') }}</h3>
          <p class="mt-3 text-steel">{{ t('trailers.enclosed.text') }}</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="scroll-mt-16 bg-paper text-ink">
      <div class="mx-auto max-w-3xl px-4 pb-14 sm:px-6 sm:pb-20">
        <h2 class="font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl">{{ t('faq.title') }}</h2>
        <div class="mt-8 divide-y-2 divide-ink/10 border-y-2 border-ink/10">
          <details v-for="(f, i) in faqs" :key="i" class="group py-5">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
              {{ rt(f.q) }}
              <span class="font-display text-2xl text-volt-deep transition group-open:rotate-45">+</span>
            </summary>
            <p class="mt-3 text-ink/70">{{ rt(f.a) }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative overflow-hidden bg-volt-deep text-white">
      <div class="pointer-events-none absolute -right-10 inset-y-0 w-40 -skew-x-[22deg] bg-white/10" />
      <div class="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
        <h2 class="font-display text-4xl font-black uppercase italic leading-none sm:text-5xl">{{ t('cta.title') }}</h2>
        <div class="flex flex-wrap gap-3">
          <a href="#quote" class="rounded-md bg-night px-6 py-3.5 font-display text-lg font-extrabold uppercase text-white hover:bg-night-3">{{ t('cta.quote') }}</a>
          <a :href="chatUrl" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-md border-2 border-white px-6 py-3.5 font-display text-lg font-extrabold uppercase hover:bg-white hover:text-volt-deep">
            <WhatsAppIcon class="size-5" /> {{ t('cta.chat') }}
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-night pb-20 md:pb-0">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-steel/70 sm:px-6 md:grid-cols-[auto_1fr] md:items-center">
        <div>
          <img src="/img/logo.png" :alt="company.name" width="900" height="453" class="h-20 w-auto">
          <p class="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-steel/60">{{ company.tagline }}</p>
        </div>
        <div class="space-y-1 md:text-right">
          <p class="font-semibold text-white">{{ company.owner }}</p>
          <p><a :href="company.phoneHref" class="hover:text-white">{{ company.phone }}</a> · <a :href="`mailto:${company.email}`" class="hover:text-white">{{ company.email }}</a></p>
          <p>{{ company.usdot }} · {{ company.mc }}</p>
          <p>© {{ new Date().getFullYear() }} {{ company.name }} · {{ t('footer.broker') }}</p>
        </div>
      </div>
    </footer>

    <!-- MOBILE ACTION BAR -->
    <div class="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-white/10 bg-night/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <a href="#quote" class="flex flex-1 items-center justify-center rounded-md bg-volt-deep py-3 font-display text-lg font-extrabold uppercase text-white">
        {{ t('mobileBar.quote') }}
      </a>
      <a :href="chatUrl" target="_blank" rel="noopener" class="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 font-bold text-ink">
        <WhatsAppIcon class="size-5" /> WhatsApp
      </a>
    </div>

    <!-- FLOATING WHATSAPP (desktop) -->
    <a
      :href="chatUrl"
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      class="fixed bottom-5 right-5 z-50 hidden size-14 items-center md:flex justify-center rounded-full bg-[#25D366] text-ink shadow-lg shadow-black/40 transition hover:scale-105"
    >
      <WhatsAppIcon class="size-7" />
    </a>
  </div>
</template>
