<script setup lang="ts">
import { ref, computed } from 'vue'
import MediaList from './components/MediaList.vue'

// Hardcoded demo data for now.
// This replaces Thymeleaf templates for milestone purposes.
// We will later fetch from backend for M3.

const movies = ref([
  { id: 1, title: 'Inception', minute: 42, note: 're-watch' },
  { id: 2, title: 'Interstellar', minute: 0 }
])

const rawSeries = ref([
  { id: 1, title: 'Dark', season: 1, episode: 3, minute: 12 },
  { id: 2, title: 'The Bear', season: 2, episode: 5 }
])

// Turn series data into pretty title strings like "Dark S1E3"
const series = computed(() =>
  rawSeries.value.map(s => ({
    id: s.id,
    title: `${s.title} S${s.season}E${s.episode}`,
    minute: s.minute
  }))
)
</script>

<template>
  <main class="container">
    <h1>Movie / Series Tracker</h1>

    <!-- Using our child component twice with different data -->
    <MediaList title="Filme" :items="movies" />
    <MediaList title="Serien" :items="series" />
  </main>
</template>

<style scoped>
.container {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
}
h1 {
  margin: 0 0 1rem;
  color: #111;
}
</style>
