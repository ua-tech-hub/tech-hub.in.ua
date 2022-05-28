<script setup lang="ts">
import { definePageMeta, queryContent, ref, useAsyncData, watch } from "#imports";

definePageMeta({
  layout: 'base-layout'
})



const {data: articles} = await useAsyncData(
    'home',
    () => queryContent('/')
        .only(['title', 'description', '_path'])
        .find(),
);

</script>

<template>
  <main>
    <article
        v-for="article of articles"
        :key="article._path"
    >
      <h2>{{article.title}}</h2>
      <div v-if="article.description">{{article.description}}</div>
      <nuxt-link :to="article._path">go</nuxt-link>
    </article>
  </main>
</template>

<style scoped>
article {
  border: 3px solid #80808099;
  padding: 0.4rem 1rem;
  margin: 1.5rem 0;
}
</style>
