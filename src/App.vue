<template>
  <div id="app">
    <app-header/>
    <div id="main" class="container">
      <router-view/>
    </div>

    <cookie-policy-modal></cookie-policy-modal>

    <app-footer/>
  </div>
</template>

<script>
import AppHeader from "./components/main/partial/AppHeader";
import AppFooter from "./components/main/partial/AppFooter";
import CookiePolicyModal from "./components/main/partial/CookiePolicy";

export default {
  components: {
    CookiePolicyModal,
    'app-header': AppHeader,
    'app-footer': AppFooter
  },
  name: 'App'
}
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    /*width: inherit;*/
  }

  #main {
    background-color: #fff!important;
    /*padding: 120px 15px 0;*/
    /*width: 100%;*/
    /*margin: 0 auto;*/

    padding: 120px 15px 0;
    margin: 0 auto;
    flex: 1;
  }

  /* Part of removing fixed navbar on smaller screens */
  @media (max-width: 767px) {
    #main {
      padding-top: 22px; /* Current height(120px) - Height of navbar(98px) = 22px */
    }
  }

</style>
