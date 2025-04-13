<template>
  <div class="app">
    <header-nav />
    <router-view />
  </div>
</template>

<script>
import HeaderNav from "./components/headFoot/HeaderNav.vue";
export default {
  name: "App",
  components: {
    HeaderNav,
  },
};
</script>

<style scoped>
.app {
  background-color: #f5f7fa;
  width: 100%;
}
</style>

