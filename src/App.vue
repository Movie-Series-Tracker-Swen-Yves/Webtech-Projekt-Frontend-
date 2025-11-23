<script setup lang="ts">
const APP_TITLE = 'Movie / Series Tracker'
</script>

<template>
  <main class="container">
    <h1>{{ APP_TITLE }}</h1>
    <RouterView />
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}
</style>
