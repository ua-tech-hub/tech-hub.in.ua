import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  css: [
    'assets/styles/global.css',
  ],
  content: {
    ignores: [
      'LICENSE'
    ],
    // https://content.nuxtjs.org/api/configuration
  },
});
