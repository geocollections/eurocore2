<template>
  <div class="cookie-policy" v-if="showCookiePolicy">

    <div class="cookie-ribbon">
      <div class="col-lg-12 text-center">
        <span>
          This site uses cookies. By continuing to browse the site, you are agreeing to our use of cookies.
        </span>

        <span>
          Read our
          <a id="activate-modal-button" @click="showModal = !showModal">conditions of use.</a>
        </span>

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


    <!--MODAL -->
    <b-modal id="cookie-policy" :busy="true"
             v-model="showModal" centered
             scrollable title="Cookie and Privacy Policy">
      <div v-if="cookiePolicy !== null" v-html="cookiePolicy.content_en"></div>

      <hr>

      <div v-if="privacyPolicy !== null" v-html="privacyPolicy.content_en"></div>

      <div slot="modal-footer"></div>
    </b-modal>

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
      } else {
        this.showCookiePolicy = true
      }
      fetchPage(67).then((response) => {this.cookiePolicy = response.body.results[0]});
      fetchPage(68).then((response) => {this.privacyPolicy = response.body.results[0]});
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

  #activate-modal-button {
    color: #007bff;
    text-decoration: none;
  }

  #activate-modal-button:hover {
    cursor: pointer;
    color: #0056B3;
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
