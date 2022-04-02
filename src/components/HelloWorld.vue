<script setup lang="ts">
import { ref, onMounted } from "vue";
defineProps<{
  msg: string;
}>();

const count = ref(0);
const clima = ref("-");
const url = "https://wttr.in/?format=3";

function increment() {
  count.value++;
}

async function get() {
  let request = await fetch(url);
  clima.value = await request.text();
}

onMounted(() => {
  console.log(`Valor sumador: ${count.value}. Clima: ${clima.value}`);
});
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      Botones: sumador y reporte de clima
      <!-- <a target="_blank" href="https://vitejs.dev/">Vite</a> + -->
      <!-- <a target="_blank" href="https://vuejs.org/">Vue 3</a>. -->
      <button @click="increment">Sumar: {{ count }}</button>
      <button @click="get">Clima: {{ clima }}</button>
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
