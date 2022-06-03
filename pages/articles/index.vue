<script setup lang="ts">
import { definePageMeta, queryContent, ref, useAsyncData, watch } from "#imports";
import ArticleFeed from "~/components/ArticleFeed.vue";

definePageMeta({
  layout: 'base-layout',
});

</script>

<template>
  <main>
    <article-feed/>
  </main>
</template>

<style scoped>
main {
  max-width: 55rem;
  margin: 0 auto;
}
</style>
