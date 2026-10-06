<script setup lang="ts">
const props = defineProps<{
  from: { city: string, zip: string }
  to: { city: string, zip: string }
  miles: number
  interstate: string
}>()

const { t } = useI18n()
const form = useQuoteForm()

function pick() {
  form.value.from = props.from.zip
  form.value.to = props.to.zip
  document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <button
    type="button"
    class="group relative w-full rounded-lg border-[3px] border-white/90 bg-[#0d6b45] p-5 text-left text-white shadow-[0_0_0_4px_#0d6b45] transition hover:-translate-y-1 hover:bg-[#0a5536] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-volt"
    @click="pick"
  >
    <div class="flex items-start justify-between gap-3">
      <span class="inline-flex h-9 min-w-9 items-center justify-center rounded-t-md rounded-b-[45%] border-2 border-white bg-[#1f4aa8] px-1.5 font-display text-sm font-extrabold">
        {{ interstate }}
      </span>
      <span class="font-display text-lg font-semibold opacity-80">{{ miles.toLocaleString('en-US') }} mi</span>
    </div>
    <p class="mt-4 font-display text-2xl font-extrabold uppercase leading-tight">{{ from.city }}</p>
    <p class="font-display text-2xl font-extrabold uppercase leading-tight">
      <span class="inline-block transition group-hover:translate-x-1">→</span> {{ to.city }}
    </p>
    <p class="mt-4 text-sm font-semibold text-white/70 group-hover:text-white">{{ t('routes.cta') }}</p>
  </button>
</template>
