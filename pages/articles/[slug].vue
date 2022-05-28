<script lang="ts" setup>
import { definePageMeta } from "#imports";

definePageMeta({
  layout: 'base-layout'
})
</script>

<template>
  <main>
    <ContentDoc />
  </main>
</template>

<style scoped>
main {
  max-width: 55rem;
  margin: 0 auto;
  background: white;
  padding: 1rem;
}
</style>
