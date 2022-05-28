<script lang="ts" setup></script>

<template>
  <div class="base-layout">
    <app-header class="app-header"/>
    <slot></slot>
  </div>
</template>

<style scoped>
@media (min-width: 800px) {
  .base-layout {
    display: flex;
  }

  .app-header {
    min-width: 20rem;
  }
}
</style>
