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
    />
    <p v-if="article.description">{{ article.description }}</p>
    <nuxt-link :to="article._path">Почати читання</nuxt-link>
  </article>
</template>


