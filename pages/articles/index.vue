<script setup lang="ts">
import { queryContent, ref, useAsyncData, watch } from "#imports";

const skip = ref(2)
const limit = ref(2)

const {data: articles, refresh} = await useAsyncData(
    'home',
    () => queryContent('/')
        .only(['title', 'description', '_path'])
        .skip(skip.value)
        .limit(limit.value)
        .find(),
);

watch([skip, limit], () => {
  refresh()
})

</script>

<template>
<main>
  <label for="skip">Skip ({{ skip }})</label>
  <input id="skip" v-model="skip" type="range" min="0" max="5">
  <label for="skip">Limit ({{ limit }})</label>
  <input id="limit" v-model="limit" type="range" min="1" max="5">
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
