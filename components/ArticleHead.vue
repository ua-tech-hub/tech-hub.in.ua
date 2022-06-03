<script lang="ts" setup>
import { toRef } from "#imports";
import { useLocalDate } from "~/composables/useLocalDate";

const props = defineProps<{
  date?: string | number | Date
  title?: string
  path: string
  tags?: string[]
}>();

const pubDate = useLocalDate(toRef(props, 'date'));

</script>

<template>
  <small>
    <time :datetime="date" v-if="pubDate">{{ pubDate }}</time>
    <template v-if="tags">
      <nuxt-link v-for="tag in tags" :key="tag" :to="'/tag/'+tag">#{{tag}}</nuxt-link>
    </template>
  </small>
  <h2 v-if="title">
    <nuxt-link :to="path">{{ title }}</nuxt-link>
  </h2>
</template>

<style scoped>

small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
}

small a {
  color: #005bbb;
}

h2 {
  margin: 0.5rem 0 1rem;
}

a {
  color: inherit;
}

a:not(:hover) {
  text-decoration: none;
}
</style>
