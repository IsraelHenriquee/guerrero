<script setup lang="ts">
const head = useLocaleHead()

useHead({
  htmlAttrs: { lang: () => head.value.htmlAttrs.lang },
  link: () => head.value.link ?? [],
  meta: () => head.value.meta ?? []
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
