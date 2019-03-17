<template>
  <div class="teaching-aids">

    <spinner v-show="isSearching" class="loading-overlay" size="huge" message="Searching..."></spinner>

    <div class="row">
      <div class="col">
        <h2>Teaching materials</h2>
      </div>
    </div>


    <div v-if="results !== null">

      <div class="mt-3" v-if="results.length > 0">

        <div class="row" v-for="module in results">
          <div class="col">

            <div class="module-details">
              <h3>{{ module.title }}</h3>

              <p v-if="module.author">
                <strong>Authors</strong>: {{ module.author }}, {{ module.institution__name }}
              </p>

              <p v-if="module.institution__name">
                <strong>Institution</strong>: {{ module.institution__name }}
              </p>

              <p><strong>Description</strong>: {{ module.description }}</p>

              <p>
                <strong>Downloads</strong>:
                <a v-if="module.files__title" href="javascript:void(0)" @click="openInNewWindow({url: module.files__url})">
                  {{ module.files__title }}</a>
                <a v-else href="javascript:void(0)" @click="openInNewWindow({url: module.files__url})">FILE</a>
              </p>

            </div>

          </div>
        </div>

      </div>

      <!-- NO RESULTS -->
      <div v-else>

        <!-- EMPTY UNAUTHENTICATED -->
        <div v-if="!isAuthenticated">
          <div class="row">
            <div class="col">
              <p class="text-center error-text">
                <b>Please note that some teaching materials are available for registered users only.</b>
                <br>
                For getting an account please contact project partners.
              </p>
            </div>
          </div>
        </div>

        <!-- EMPTY AUTHENTICATED -->
        <div v-else>
          Unfortunately we did not find any teaching materials, please try refreshing the web page or contact project partners.
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'

  export default {
    components: {
      Spinner
    },
    name: "TeachingAids",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/teaching_module/',
        isAuthenticated: false,
        isSearching: false,
        results: null,
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Teaching Aids'
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.isAuthenticated = true;
      }
      this.getModules();
    },
    methods: {
      getModules() {
        this.isSearching = true

        this.$http.get(this.API_URL, {
          params: {
            format: 'json'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            if (response.body.count > 0) this.results = response.body.results
            else this.results = []
          }
          this.isSearching = false
        }, errResponse => {
          this.isSearching = false
          console.log('ERROR: ' + JSON.stringify(errResponse));
        });
      },

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open('https://eurocore.rocks' + params.url, '', 'width=' + params.width + ', height=750');
      },
    }
  }
</script>

<style scoped>
  .error-text {
    font-size: 1.2rem;
    margin: 10% auto;
    border: 1px solid pink;
    padding: 10px;
    border-radius: 10px;
  }

  .module-details {
    margin-left: 3rem;
  }

  .module-details p {
    margin-left: 3rem;
    line-height: 2rem;
  }
</style>
