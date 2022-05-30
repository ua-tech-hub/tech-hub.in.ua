<script lang="ts" setup>
import { definePageMeta } from "#imports";

definePageMeta({
  layout: 'base-layout',
});
</script>
<template>
  <main>
    <article>
      <ContentDoc v-slot="{ doc }">
        <article-head
          :date="doc.date"
          :title="doc.title"
          :path="doc._path"
        />
        <ContentRenderer :value="doc"/>
      </ContentDoc>
    </article>

  </main>
</template>


<style scoped>
article, section {
  background: white;
  padding: 1rem;
}

main {
  max-width: 55rem;
  margin: 0 auto;
}
</style>
