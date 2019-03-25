<template>
  <div class="cookie-policy" v-if="showCookiePolicy">

    <div class="cookie-ribbon">
      <div class="col-lg-12 text-center">
        <span>
          This site uses cookies. By continuing to browse the site, you are agreeing to our use of cookies.
        </span>

        <!--<span>-->
          <!--Read our -->
          <!--<a>conditions of use.</a>-->
        <!--</span>-->

        <span class="pl-2">
          <b-button variant="primary" @click="agreeToCookiePolicy">Agree</b-button>
        </span>
      </div>

      <span class="exit-button" @click="showCookiePolicy = false">
          <a title="close cookie policy">
            <font-awesome-icon :icon="icon"/>
          </a>
        </span>
    </div>

    <!-- MODAL -->
    <!--<b-modal id="cookie-policy" centered scrollable title="Terms of Service, Cookie policy, Privacy Policy">-->
      <!--<p class="my-4" v-for="i in 20" :key="i">-->
        <!--Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis-->
        <!--in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.-->
      <!--</p>-->
    <!--</b-modal>-->

  </div>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
  import { fetchPage } from "../../../assets/js/api/apiCalls";

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "CookiePolicy",
    data() {
      return {
        showCookiePolicy: null,
        termsOfService: null,
        cookiePolicy: null,
        privacyPolicy: null,
        showModal: false,
      }
    },
    computed: {
      icon() { return faTimes }
    },
    created() {
      const userAgreedToCookiePolicy = this.$localStorage.get('eurocore_cookie_policy')
      if (userAgreedToCookiePolicy) {
        this.showCookiePolicy = false
        // fetchPage(67).then((response) => {this.cookiePolicy = response.results[0]});
        // fetchPage(68).then((response) => {this.privacyPolicy = response.results[0]});
        // fetchPage(69).then((response) => {this.termsOfService = response.results[0]});
      } else {
        this.showCookiePolicy = true
      }
    },
    methods: {
      agreeToCookiePolicy() {
        this.$localStorage.set('eurocore_cookie_policy', true)
        this.showCookiePolicy = false
      }
    }
  }
</script>

<style scoped>
  .cookie-ribbon {
    background-color: #ffffff;
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 8px 16px;
    box-shadow: 0 4px 10px #000;
    z-index: 1; /* Maybe need to make it even more higher */
  }

  .exit-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5em 1em;
    color: #007bff;
    font-size: smaller;
  }

  .exit-button:hover {
    cursor: pointer;
  }
</style>
