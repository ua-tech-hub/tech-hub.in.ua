<script lang="ts" setup></script>

<template>
  <div class="base-layout">
    <app-header class="app-header"/>
    <slot></slot>
  </div>
</template>

<style scoped>

.base-layout {
  min-height: 100vh;
}

@media (min-width: 800px) {
  .base-layout {
    display: flex;
  }

  .app-header {
    min-width: 20rem;
  }
}
</style>
