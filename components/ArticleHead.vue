<script lang="ts" setup>
import { toRef } from "#imports";
import { useLocalDate } from "~/composables/useLocalDate";

const props = defineProps<{
  date?: string | number | Date
  title?: string
  path: string
}>();

const pubDate = useLocalDate(toRef(props, 'date'));

</script>

<template>
  <header>
    <time :datetime="date" v-if="pubDate">{{ pubDate }}</time>
    <h2 v-if="title">
      <nuxt-link :to="path">{{ title }}</nuxt-link>
    </h2>
  </header>
</template>

<style scoped>
a {
  color: inherit;
}

a:not(:hover) {
  text-decoration: none;
}
</style>
