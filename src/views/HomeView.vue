<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MediaList from '../Components/MediaList.vue'

type FilmDto = {
  id: number
  title: string
  minutes?: number | null
  notes?: string | null
}

type SerieDto = {
  id: number
  title: string
  minutes?: number | null
  notes?: string | null
  season?: number | null
  episode?: number | null
}

// --- API base ---
const API =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  'http://localhost:8080'

console.log('API Base URL:', API)

const loading = ref(true)
const error = ref<string | null>(null)
const movies = ref<FilmDto[]>([])
const series = ref<SerieDto[]>([])

// --- fallback data (if backend not reachable) ---
const fallbackMovies: FilmDto[] = [
  { id: 1, title: 'Inception', minutes: 148, notes: 'Rewatch' },
  { id: 2, title: 'Interstellar', minutes: 169 }
]

const fallbackSeries: SerieDto[] = [
  { id: 1, title: 'Breaking Bad – S1E1', minutes: 58, notes: 'Pilot' },
  { id: 2, title: 'Dark – S1E1', minutes: 50 }
]

// --- lifecycle: fetch on mount ---
onMounted(async () => {
  try {
    const [filmsRes, seriesRes] = await Promise.all([
      axios.get<FilmDto[]>(`${API}/api/films`, { timeout: 5000 }),
      axios.get<SerieDto[]>(`${API}/api/series`, { timeout: 5000 })
    ])

    movies.value = filmsRes.data.length ? filmsRes.data : fallbackMovies
    series.value = seriesRes.data.length ? seriesRes.data : fallbackSeries
  } catch (err: any) {
    console.error('axios error →', err.message)
    error.value = err.message
    movies.value = fallbackMovies
    series.value = fallbackSeries
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <p v-if="loading">Lade Daten...</p>
    <p v-else-if="error" class="err">{{ error }}</p>

    <MediaList title="Filme" :items="movies" />
    <MediaList title="Serien" :items="series" />
  </section>
</template>

<style scoped>
.err {
  color: #c00;
  margin-bottom: 1rem;
}
</style>
