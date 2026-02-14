<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup>
// Initialize Firebase when app loads
import { initializeFirebase } from '~/utils/firebase-config';

onMounted(() => {
  initializeFirebase();
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  min-height: 100vh;
}
</style>
