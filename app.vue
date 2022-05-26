<script lang="ts" setup></script>

<template>
  <Html lang="uk"></Html>

  <Head>
    <Title>
      🇺🇦 Хаб — Сайт в розробці
    </Title>
    <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></Script>
    <Script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
          if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }
    </Script>
  </Head>

  <under-construction-message/>
</template>

<style>
html {
  font-size: 26px;
  text-align: center;
  margin: 0;
  min-height: 100vh;
  display: flex;
  font-family: -apple-system,
  "Segoe UI",
  Roboto,
  "Helvetica Neue", Arial,
  "Noto Sans",
  "Liberation Sans",
  sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

body {
  max-width: 30rem;
  padding: 2rem;
  margin: auto;
}
</style>
