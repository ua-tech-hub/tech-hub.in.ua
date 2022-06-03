<script lang="ts" setup>
import { definePageMeta } from "#imports";

definePageMeta({
  layout: 'base-layout',
});
</script>
<template>
  <main>
    <ContentDoc v-slot="{ doc }">
      <article>
        <article-head
          :date="doc.date"
          :title="doc.title"
          :path="doc._path"
          :tags="doc.tags"
        />
        <ContentRenderer :value="doc"/>
      </article>

      <section>
        <a :href="'/admin/#/collections/article/search/' + doc.title">Виправити цю статтю</a>
      </section>
    </ContentDoc>

  </main>
</template>


<style scoped>
article, section {
  background: white;
  padding: 1rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 55rem;
  margin: 0 auto;
}
</style>
