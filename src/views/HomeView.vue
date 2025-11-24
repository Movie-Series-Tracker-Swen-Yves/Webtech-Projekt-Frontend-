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


const API =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  'https://webtech-projekt-d919.onrender.com'

console.log('API Base URL:', API)

// Axios.
const api = axios.create({
  baseURL: API

})

const loading = ref(true)
const error = ref<string | null>(null)
const movies = ref<FilmDto[]>([])
const series = ref<SerieDto[]>([])

// Fallback
const fallbackMovies: FilmDto[] = [
  { id: 1, title: 'Inception', minutes: 148, notes: 'Rewatch' },
  { id: 2, title: 'Interstellar', minutes: 169 }
]

const fallbackSeries: SerieDto[] = [
  { id: 1, title: 'Breaking Bad – S1E1', minutes: 58, notes: 'Pilot' },
  { id: 2, title: 'Dark – S1E1', minutes: 50 }
]

// Daten vom Backend holen
onMounted(async () => {
  try {
    const [filmsRes, seriesRes] = await Promise.all([
      api.get<FilmDto[]>('/api/films'),
      api.get<SerieDto[]>('/api/series')
    ])

    console.log('filmsRes', filmsRes.status, filmsRes.data)
    console.log('seriesRes', seriesRes.status, seriesRes.data)

    movies.value = filmsRes.data && filmsRes.data.length ? filmsRes.data : fallbackMovies
    series.value = seriesRes.data && seriesRes.data.length ? seriesRes.data : fallbackSeries
  } catch (e: any) {
    console.error('axios error →', e)
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
