<script setup lang="ts">
const { locale, locales, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <nav :aria-label="t('nav.language')" class="flex items-center rounded-md border border-white/15 p-0.5 text-xs font-bold uppercase">
    <NuxtLink
      v-for="l in locales"
      :key="l.code"
      :to="switchLocalePath(l.code)"
      :title="l.name"
      :aria-current="l.code === locale ? 'true' : undefined"
      class="rounded px-2.5 py-1.5 transition sm:px-2 sm:py-1"
      :class="l.code === locale ? 'bg-volt text-white' : 'text-steel/70 hover:text-white'"
    >
      {{ l.code }}
    </NuxtLink>
  </nav>
</template>
