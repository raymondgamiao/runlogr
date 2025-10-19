<template>
  <nav class="uk-navbar-container uk-margin" uk-navbar>
    <div class="uk-navbar-left">
      <ul class="uk-navbar-nav">
        <li>
          <router-link to="/" class="uk-link-reset">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/runs" class="uk-link-reset">Runs</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.uk-navbar-container {
  background-color: #f7f7f7;
  padding: 0.5rem 1rem;
}
</style>
