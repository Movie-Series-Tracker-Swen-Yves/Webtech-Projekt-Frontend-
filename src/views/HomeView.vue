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

// Backend-Basis-URL: aus Env-Var, fallback auf Render-URL
const API =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  'https://webtech-projekt-d919.onrender.com'

console.log('API Base URL:', API)

// Axios-Instanz
const api = axios.create({
  baseURL: API,
  timeout: 15000
})

const loading = ref(true)
const error = ref<string | null>(null)
const movies = ref<FilmDto[]>([])
const series = ref<SerieDto[]>([])

// --- Formular-State für neuen Film (POST)
const newFilmTitle = ref('')
const newFilmMinutes = ref<number | null>(null)
const newFilmNotes = ref('')

// Fallback-Daten
const fallbackMovies: FilmDto[] = [
  { id: 1, title: 'Inception', minutes: 148, notes: 'Rewatch' },
  { id: 2, title: 'Interstellar', minutes: 169 }
]

const fallbackSeries: SerieDto[] = [
  { id: 1, title: 'Breaking Bad – S1E1', minutes: 58, notes: 'Pilot' },
  { id: 2, title: 'Dark – S1E1', minutes: 50 }
]

// --- GET: Daten vom Backend holen ------------------------------------------
onMounted(async () => {
  try {
    const [filmsRes, seriesRes] = await Promise.all([
      api.get<FilmDto[]>('/api/films'),
      api.get<SerieDto[]>('/api/series')
    ])

    console.log('filmsRes', filmsRes.status, filmsRes.data)
    console.log('seriesRes', seriesRes.status, seriesRes.data)

    movies.value =
      filmsRes.data && filmsRes.data.length ? filmsRes.data : fallbackMovies
    series.value =
      seriesRes.data && seriesRes.data.length ? seriesRes.data : fallbackSeries
  } catch (e: any) {
    console.error('axios error →', e)
    error.value = e?.message ?? String(e)
    movies.value = fallbackMovies
    series.value = fallbackSeries
  } finally {
    loading.value = false
  }
})

// --- POST: neuen Film anlegen
async function createFilm() {
  try {
    const payload = {
      title: newFilmTitle.value,
      minutes: newFilmMinutes.value,
      notes: newFilmNotes.value || null
    }

    const res = await api.post<FilmDto>('/api/films', payload)
    console.log('created film', res.status, res.data)

    // neuen Film an Liste anhängen
    movies.value = [...movies.value, res.data]

    // Formular zurücksetzen
    newFilmTitle.value = ''
    newFilmMinutes.value = null
    newFilmNotes.value = ''
  } catch (e: any) {
    console.error('createFilm error →', e)
    error.value = e?.message ?? String(e)
  }
}
</script>

<template>
  <section>
    <p v-if="loading">Lade Daten…</p>
    <p v-else-if="error" class="err">{{ error }}</p>

    <!-- Formular für POST /api/films -->
    <form @submit.prevent="createFilm" class="film-form">
      <h2>Neuen Film anlegen</h2>

      <div class="field">
        <label>
          Titel
          <input v-model="newFilmTitle" required />
        </label>
      </div>

      <div class="field">
        <label>
          Minuten
          <input v-model.number="newFilmMinutes" type="number" min="1" />
        </label>
      </div>

      <div class="field">
        <label>
          Notizen
          <input v-model="newFilmNotes" />
        </label>
      </div>

      <button type="submit">Film speichern</button>
    </form>

    <MediaList title="Filme" :items="movies" />
    <MediaList title="Serien" :items="series" />
  </section>
</template>

<style scoped>
.err {
  color: #c00;
  margin-bottom: 1rem;
}

.film-form {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.field {
  margin-bottom: 0.75rem;
}

.field input {
  display: block;
  margin-top: 0.25rem;
  padding: 0.3rem 0.4rem;
}
</style>
