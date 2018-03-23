<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
      <h1>
        <router-link class="navbar-brand" to="/">
          <img id="eurocoreLogo" src="../../../assets/eurocoreLogo.png" alt="Eurocore logo">
        </router-link>
      </h1>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
              aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">

          <!--TODO: Drillcore fast search and make it little bit smaller-->
          <li class="nav-item" id="fast-search">
            <input class="form-control" placeholder="Drillcore search" v-model="fastSearch" @keyup.enter="doFastSearch()"/>
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

          <!--<li class="nav-item dropdown">-->
          <!--<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
          <!--USER-->
          <!--</a>-->
          <!--<div class="dropdown-menu" aria-labelledby="navbarDropdown">-->
          <!--<router-link class="dropdown-item" to="/login">Sign In</router-link>-->
          <!--<a class="dropdown-item" href="#">Log out</a>-->
          <!--</div>-->
          <!--</li>-->

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: "app-header",
    data() {
      return {
        fastSearch: ''
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
</style>
