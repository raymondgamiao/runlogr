<template>
  <div id="app" class="uk-container uk-margin-top">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>


<style scoped>
body {
  font-family: 'Inter', sans-serif;
  background-color: #fafafa;
  color: #333;
}
</style>

