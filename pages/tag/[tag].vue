<script setup lang="ts">
import { definePageMeta } from "#imports";

definePageMeta({
  layout: 'base-layout',
});

</script>

<template>
  <main>
    <article-feed :where="{tags: {$contains: $route.params.tag}}"/>
  </main>
</template>

<style scoped>
main {
  max-width: 55rem;
  margin: 0 auto;
}
</style>
