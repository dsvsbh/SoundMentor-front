<template>
  <div class="app">
    <header-nav />
    <router-view />
  </div>
</template>

<script>
import HeaderNav from "./components/HeaderNav.vue";

export default {
  name: "App",
  components: {
    HeaderNav,
  },
};
</script>

<style scoped>
</style>
