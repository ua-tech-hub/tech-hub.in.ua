<script lang="ts" setup>
// TODO: Якимось чином формувати список категорій
const tags = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'Браузерні розширення',
  'Electron',
  'Vue',
  'WordPress',
  'Алгоритми',
  'Чат-боти',
  'Deno',
  'Accessibility',
];
</script>

<template>
  <header>
    <h1>
      <nuxt-link to="/articles">🇺🇦 Хаб</nuxt-link>
    </h1>
    <input type="checkbox" aria-label="Перемкнути меню категорій">
    <nav>
      <ul v-if="tags.length">
        <li v-for="tag of tags" :key="tag">
          <nuxt-link :to="'/tag/' + tag ">#{{ tag }}</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: #790606;
  color: white;
  padding: 1rem;

  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr auto;
  grid-template-rows: repeat(2, min-content);
  gap: 0;
  grid-template-areas:
    "logo toggler"
    "nav nav";
}

h1 {
  grid-area: logo;
  margin: 0;
}

a {
  color: inherit;
}

a:not(:hover, :focus-visible) {
  text-decoration: none;
}

input[type="checkbox"] {
  grid-area: toggler;
  appearance: none;
  width: 38px;
  height: 100%;
  border: 1px solid;
  border-radius: 5px;
  background: url("assets/icons/list.svg") no-repeat;
  background-size: cover;
  cursor: pointer;
}

@media (min-width: 800px) {
  input[type="checkbox"] {
    display: none;
  }
}

input[type="checkbox"]:hover,
input[type="checkbox"]:focus-visible {
  background-color: hsla(0, 0%, 100%, .3);
}

input[type="checkbox"]:checked {
  background-image: url("assets/icons/x.svg");
}

nav {
  grid-area: nav;
  position: sticky;
  top: 1rem
}

@media not (min-width: 800px) {
  input[type="checkbox"]:not(:checked) + nav {
    display: none;
  }
}

nav > ul {
  margin: 0;
  padding: 0.5rem 0;
}

ul {
  list-style: none;
}

ul > li:not(:first-child) > a {
  border-top: 1px solid hsla(0, 0%, 100%, .5);
}

ul a {
  padding: 0.5rem 1.2rem;
  display: block;
}
</style>
