<script lang="ts" setup>
import { toRef } from "#imports";
import { useLocalDate } from "~/composables/useLocalDate";
import { Article } from "~/types/ArticleMeta";

const props = defineProps<{
  article: Article
}>();

const pubDate = useLocalDate(toRef(props.article, 'date'));

</script>

<template>
  <article>
    <time :datetime="article.date" v-if="pubDate">{{ pubDate }}</time>
    <h2 v-if="article._title || article.title">
      <nuxt-link :to="article._path">{{ article.title }}</nuxt-link>
    </h2>
    <p v-if="article.description">{{ article.description }}</p>
    <nuxt-link :to="article._path">Почати читання</nuxt-link>
    <details>
    </details>
  </article>

</template>

<style scoped>
a {
  color: inherit;
}

a:not(:hover) {
  text-decoration: none;
}
</style>
