<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
      <h1>
        <router-link class="navbar-brand" to="/">
          <img id="eurocoreLogo" src="https://eurocore.rocks/images/logo_Eurocore_small_no_text_preview.png" alt="Eurocore logo">
        </router-link>
      </h1>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
              aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">

          <li class="nav-item" id="fast-search">
            <span class="icon" @click="doFastSearch()">
              <font-awesome-icon :icon="icon" />
            </span>
            <input class="form-control" placeholder="Drillcore search" aria-label="Drillcore search" v-model="fastSearch" @keyup.enter="doFastSearch()"/>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/drillcore">DRILLCORES</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/data_search">DATA</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/teaching_aids">TEACHING</router-link>
          </li>

          <li class="nav-item">
            <a href="https://schema.eurocore.rocks/" class="nav-link">ABOUT DATABASE</a>
          </li>

          <li class="nav-item">
            <a href="http://eurocore.eitrawmaterials.univ-lorraine.fr/" class="nav-link" target="_blank">PROJECT
              HOME</a>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/login">LOGIN</router-link>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "app-header",

    data() {
      return {
        fastSearch: ''
      }
    },

    computed: {
      icon() {
        return faSearch
      }
    },

    mounted: function () {
      $(".navbar-nav li a").click(function () {
        $(".navbar-collapse").collapse('hide');
      });
      $(".navbar img").click(function () {
        $(".navbar-collapse").collapse('hide');
      });
    },

    methods: {
      doFastSearch() {
        this.fastSearch = this.fastSearch.trim()
        if (this.fastSearch.length > 0) {
          this.$router.push({ path: '/drillcore', query: { fastSearch: this.fastSearch } })
        }
      }
    }
  }
</script>

<style scoped>
  .navbar {
    background-color: #FFF;
    border-bottom: 2px solid rgba(0, 68, 148, .1);
  }

  h1 {
    margin-bottom: 0;
  }

  #eurocoreLogo {
    height: 70px;
  }

  #eurocoreLogo:hover {
    opacity: 0.7;
  }

  .nav-link {
    color: #004393 !important;
    font-weight: 700;
  }

  .nav-link:hover {
    opacity: 0.7;
  }

  /*a.router-link-exact-active {*/
    /*color: #6bb745 !important;*/
    /*font-size: 1.05rem;*/
  /*}*/

  a.router-link-active {
    color: #6bb745 !important;
    font-size: 1.05rem;
  }

  @media (min-width: 992px) {
    #fast-search {
      width: 20%;
    }
  }

  #fast-search {
    position: relative;
  }

  #fast-search > input {
    border: 2px solid #004393;
    color: #6bb745;
    font-weight: bold;
    border-radius: 30px;
    padding-right: 35px;
  }

  #fast-search > input:focus {
    outline: 0 !important;
    border-color: #6bb745;
    color: #004393;
    -webkit-transition : border 500ms ease-out;
    -moz-transition : border 500ms ease-out;
    -o-transition : border 500ms ease-out;
    -webkit-transition : color 500ms ease-out;
    -moz-transition : color 500ms ease-out;
    -o-transition : color 500ms ease-out;
  }

  .form-control:focus {
    border-color: #FFF;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0), 0 0 8px rgba(255, 255, 255, 0);
  }

  .icon {
    position: absolute;
    right: 1%;
    top: -2%;
    padding: 10px;
    color: #004393;
  }

  .icon:hover {
    cursor: pointer;
  }


  @media (max-width: 991px) {
    #fast-search > input {
      padding-right: 40px;
    }
  }

  @media (max-width: 767px) {
    .icon {
      right: 2%;
    }
    #fast-search > input {
      padding-right: 45px;
    }

    /* Part of removing fixed navbar on smaller screens */
    .fixed-top {
      position: unset;
    }

  }

  ::placeholder {
    font-weight: normal;
    font-size: 0.9rem;
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    font-weight: normal;
    font-size: 0.9rem;
  }
  :-ms-input-placeholder { /* Microsoft Edge */
    font-weight: normal;
    font-size: 0.9rem;
  }

</style>
