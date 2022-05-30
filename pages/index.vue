<script lang="ts" setup>
import { useHead } from "#imports";

useHead({
  htmlAttrs: {
    lang: 'uk',
  },
  title: 'Хаб — IT матеріали українською мовою',
  meta: [
    {property: 'og:title', content: 'IT матеріали українською мовою'},
    {property: 'og:site_name', content: '🇺🇦 Хаб'},
    {property: 'og:url', content: 'tech-hub.in.ua'},
    {
      property: 'og:description',
      content: 'Збірник навчальних матеріалів та статей від спеціалістів у технічній галузі Українською мовою',
    },
    {property: 'og:type', content: 'book'},
  ],
  script: [
    {src: 'https://identity.netlify.com/v1/netlify-identity-widget.js'},
  ],

});
</script>

<template>
  <under-construction-message/>
</template>
