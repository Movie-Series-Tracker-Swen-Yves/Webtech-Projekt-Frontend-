<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MediaList from './Components/MediaList.vue'

const API = (import.meta.env.VITE_API_BASE as string | undefined) ?? ''
const APP_TITLE =
  (import.meta.env.VITE_APP_TITLE as string | undefined) ?? 'Movie / Series Tracker'

interface FilmDto {
  id: number
  title: string
  minutes?: number | null
  notes?: string | null
}
interface SeriesDto {
  id: number
  title: string
  season: number
  episode: number
  minutes?: number | null
}

const fallbackMovies: FilmDto[] = [
  { id: 1, title: 'Inception', minutes: 42, notes: 're-watch' },
  { id: 2, title: 'Interstellar', minutes: 0,  notes: null }
]
const fallbackRawSeries: SeriesDto[] = [
  { id: 1, title: 'Dark',     season: 1, episode: 3, minutes: 12 },
  { id: 2, title: 'The Bear', season: 2, episode: 5, minutes: null }
]

const movies    = ref<FilmDto[]>([])
const rawSeries = ref<SeriesDto[]>([])
const loading   = ref(true)
const error     = ref<string | null>(null)

const series = computed(() =>
  rawSeries.value.map(s => ({
    id: s.id,
    title: `${s.title} S${s.season}E${s.episode}`,
    minutes: s.minutes ?? null
  }))
)

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

onMounted(async () => {
  document.title = APP_TITLE

  if (!API) {
    movies.value = fallbackMovies
    rawSeries.value = fallbackRawSeries
    loading.value = false
    return
  }

  try {
    // optionaler Healthcheck (nur Log)
    fetch(`${API}/api/health`).then(r => r.text()).then(t => console.log('health:', t)).catch(()=>{})

    const films  = await getJSON<FilmDto[]>(`${API}/api/films`)
    const series = await getJSON<SeriesDto[]>(`${API}/api/series`)

    movies.value    = films  && films.length  ? films  : fallbackMovies
    rawSeries.value = series && series.length ? series : fallbackRawSeries
  } catch (e: any) {
    error.value = e?.message ?? String(e)
    movies.value = fallbackMovies
    rawSeries.value = fallbackRawSeries
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container">
    <h1>{{ APP_TITLE }}</h1>

    <p v-if="loading">Lade…</p>
    <p v-else-if="error" class="err">Fehler: {{ error }}</p>

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
h1 { margin: 0 0 1rem; color: #111; }
.err { color: #c00; }
</style>
