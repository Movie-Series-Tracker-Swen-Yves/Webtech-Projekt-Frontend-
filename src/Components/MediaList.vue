<script setup lang="ts">
type Item = {
  id: number | string
  title: string
  minute?: number
  note?: string
}

// props from parent
defineProps<{
  title: string
  items: Item[]
}>()
</script>

<template>
  <section class="card">
    <header class="row">
      <h2>{{ title }}</h2>
      <small>{{ items.length }} Einträge</small>
    </header>

    <!-- REQUIRED FOR M2: we are using v-for in our OWN subcomponent -->
    <ul class="list">
      <li
        v-for="it in items"
        :key="it.id"
        class="row-item"
      >
        <strong>{{ it.title }}</strong>
        <span v-if="it.minute != null"> — {{ it.minute }} min</span>
        <em v-if="it.note"> — {{ it.note }}</em>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin: 1rem 0;
  background: #fff;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.list {
  list-style: none;
  padding: 0;
  margin: .5rem 0 0;
}
.row-item {
  padding: .5rem 0;
  border-top: 1px solid #f3f4f6;
}
.row-item:first-child {
  border-top: 0;
}
small {
  color: #6b7280;
  font-size: .8rem;
}
em {
  color: #6b7280;
  font-style: italic;
}
</style>
