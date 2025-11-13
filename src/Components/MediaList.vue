<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{ id:number; title:string; minute?:number|null; minutes?:number|null; notes?:string|null; note?:string|null }>
}>()
</script>

<template>
  <section class="card">
    <header>
      <h2>{{ title }}</h2>
      <small>{{ items.length }} Einträge</small>
    </header>

    <ul>
      <li v-for="it in items" :key="it.id">
        <strong>{{ it.title }}</strong>
        <span v-if="(it.minutes ?? it.minute) != null"> — {{ it.minutes ?? it.minute }} min</span>
        <em v-if="(it.notes ?? it.note)">{{ it.notes ?? it.note }}</em>
      </li>
    </ul>
  </section>
</template>
