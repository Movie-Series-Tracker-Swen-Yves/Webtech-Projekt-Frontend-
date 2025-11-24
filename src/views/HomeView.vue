<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MediaList from '../Components/MediaList.vue'

type FilmDto = {
  id: number
  title: string
  minutes?: number | null
  minute?: number | null
  notes?: string | null
  note?: string | null
}

type SerieDto = {
  id: number
  title: string
  minutes?: number | null
  minute?: number | null
  notes?: string | null
  note?: string | null
  season?: number | null
  episode?: number | null
}

// API-Basis-URL: hart auf dein Backend auf Render gesetzt
const API = 'https://webtech-projekt-d919.onrender.com'
console.log('API at runtime (Axios):', API)

// Axios-Instanz mit Base-URL
const api = axios.create({
  baseURL: API,
})

const loading = ref(true)
const error = ref<string | null>(null)
const movies = ref<FilmDto[]>([])
const series = ref<SerieDto[]>([])

// Fallback-Daten, falls Backend leer oder nicht erreichbar ist
const fallbackMovies: FilmDto[] = [
  { id: 1, title: 'Inception', minutes: 148, notes: 'Rewatch' },
  { id: 2, title: 'Interstellar', minutes: 169 }
]

const fallbackSeries: SerieDto[] = [
  { id: 1, title: 'Breaking Bad – S1E1', minutes: 58, notes: 'Pilot' },
  { id: 2, title: 'Dark – S1E1', minutes: 50 }
]

onMounted(async () => {
  try {
    const [filmsRes, seriesRes] = await Promise.all([
      api.get<FilmDto[]>('/api/films'),
      api.get<SerieDto[]>('/api/series')
    ])

    const films = filmsRes.data
    const sers = seriesRes.data

    movies.value = films && films.length ? films : fallbackMovies
    series.value = sers && sers.length ? sers : fallbackSeries
  } catch (e: any) {
    console.error('axios error', e)
    error.value = e?.message ?? String(e)
    movies.value = fallbackMovies
    series.value = fallbackSeries
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <p v-if="loading">Lade Daten…</p>
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
