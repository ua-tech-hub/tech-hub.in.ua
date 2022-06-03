<script setup lang="ts">
import { queryContent, useAsyncData, useRoute } from "#imports";

const props = defineProps<{
  where: any
}>();

const route = useRoute();
const {data: articles, pending} = await useAsyncData(
  route.fullPath,
  () => queryContent('/articles')
    .where(props.where)
    .sort({
      date: 0,
      $numeric: true,
    })
    .find(),
);

</script>

<template>
  <article-feed-item
    v-for="article of articles"
    :article="article"
  />
</template>
