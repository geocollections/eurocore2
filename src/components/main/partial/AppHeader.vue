<template>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
    <div class="container">
      <h1>
        <router-link class="navbar-brand" to="/">
          <img id="eurocoreLogo" src="../../../assets/eurocoreLogo.png" alt="Eurocore logo">
        </router-link>
      </h1>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">

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
            <a href="http://schema.eurocore.rocks/" class="nav-link" target="_blank">ABOUT DATABASE</a>
          </li>

          <li class="nav-item">
            <a href="http://eurocore.eitrawmaterials.univ-lorraine.fr/" class="nav-link" target="_blank">PROJECT HOME</a>
          </li>

          <!--TODO: Drillcore fast search-->
          <!--<li class="nav-item">-->
            <!--<input class="form-control"/>-->
          <!--</li>-->

        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
    export default {
      name: "app-header",
      mounted: function () {
        $(".navbar-nav li a").click(function() {
          $(".navbar-collapse").collapse('hide');
        });
      }
    }
</script>

<style scoped>
  .navbar {
    background-color: #FFF;
    border-bottom: 2px solid rgba(0,68,148,.1);
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
    color: #004393!important;
    font-weight: 700;
  }

  .nav-link:hover {
    opacity: 0.7;
  }

  .router-link-active {
    color: #6bb745!important;
    font-size: 1.05rem;
  }
</style>
