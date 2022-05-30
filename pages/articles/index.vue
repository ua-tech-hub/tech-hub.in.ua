<script setup lang="ts">
import { definePageMeta, queryContent, ref, useAsyncData, watch } from "#imports";

definePageMeta({
  layout: 'base-layout',
});


const {data: articles, pending} = await useAsyncData(
  'home',
  () => queryContent('/articles')
    .sort({
      date: 0,
      $numeric: true,
    })
    .find(),
);

</script>

<template>
  <main role="feed" :aria-busy="pending">
    <article-feed-item
      v-for="article of articles"
      :article="article"
    />
  </main>
</template>

<style scoped>
main {
  max-width: 55rem;
  margin: auto;
}

article {
  padding: 1rem;
  margin: 1.5rem 0;
  background: white;
}

h2:first-child {
  margin-top: 0;
}

h2 a {
  color: inherit;
}

h2 a:not(:hover, :focus-visible) {
  text-decoration: none;
}
</style>
