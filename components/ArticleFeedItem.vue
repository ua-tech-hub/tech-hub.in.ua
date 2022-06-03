<script lang="ts" setup>
import { Article } from "~/types/ArticleMeta";

defineProps<{
  article: Article
}>();


</script>

<template>
  <article>
    <article-head
      :date="article.date"
      :title="article.title"
      :path="article._path"
      :tags="article.tags"
    />
    <p v-if="article.description">{{ article.description }}</p>
    <nuxt-link :to="article._path">Почати читання</nuxt-link>
  </article>
</template>

<style scoped>
article {
  padding: 1rem;
  margin: 1.5rem 0;
  background: white;
}
</style>
