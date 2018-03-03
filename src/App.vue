<template>
  <div id="app">
    <app-header/>
    <div id="main" class="container">
      <router-view/>
    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "./components/main/partial/AppHeader";
import AppFooter from "./components/main/partial/AppFooter";

export default {
  components: {
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  name: 'App'
}

// Enables tooltips
// $(function () {
//   $('[data-toggle="tooltip"]').tooltip()
// });
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #main {
    background-color: #fff!important;
    padding: 120px 15px 0;
    width: 100%;
    margin: 0 auto;
  }
</style>
