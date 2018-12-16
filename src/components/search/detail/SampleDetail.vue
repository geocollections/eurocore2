<template>
  <div class="sample-detail">

    <spinner v-if="isSearching" class="loading-overlay" size="huge" message="Loading data..."></spinner>

    <div v-if="sample != null">

      <div class="row">
        <div class="col">
          <h2>Sample {{sample[0].sample_number}}</h2>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <h3>Sample details</h3>
          <table class="table table-bordered table-hover th-styles">
            <tr v-if="sample[0].id">
              <td>ID</td>
              <td>{{sample[0].id}}</td>
            </tr>
            <tr v-if="sample[0].sample_number">
              <td>Number</td>
              <td>{{sample[0].sample_number}}</td>
            </tr>
            <tr v-if="sample[0].drillcore__name">
              <td>Locality</td>
              <td>
                <router-link :to="{ path: '/drillcore/' + sample[0].drillcore__id }">{{sample[0].drillcore__name}}
                </router-link>
              </td>
            </tr>
            <tr v-if="sample[0].latitude">
              <td>Latitude</td>
              <td>{{sample[0].latitude}}</td>
            </tr>
            <tr v-if="sample[0].longitude">
              <td>Longitude</td>
              <td>{{sample[0].longitude}}</td>
            </tr>
            <tr v-if="sample[0].depth">
              <td>Depth from, m</td>
              <td>{{sample[0].depth}}</td>
            </tr>
            <tr v-if="sample[0].end_depth">
              <td>Depth to, m</td>
              <td>{{sample[0].end_depth}}</td>
            </tr>
            <tr v-if="sample[0].description">
              <td>Description</td>
              <td>{{sample[0].description}}</td>
            </tr>
            <tr v-if="sample[0].weight">
              <td>Weight, g</td>
              <td>{{sample[0].weight}}</td>
            </tr>
            <tr v-if="sample[0].preparation">
              <td>Preparation</td>
              <td>{{sample[0].preparation}}</td>
            </tr>
            <tr v-if="sample[0].takenBy">
              <td>Sample taken by</td>
              <td>{{sample[0].takenBy}}</td>
            </tr>
            <tr v-if="sample[0].date">
              <td>Date</td>
              <td>{{sample[0].date}}</td>
            </tr>
            <tr v-if="sample[0].storage">
              <td>Storage</td>
              <td>{{sample[0].storage}}</td>
            </tr>
          </table>
        </div>

        <div class="col">
          <h3>Analyses from sample</h3>
          <table class="table table-bordered table-hover">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>Method</th>
              <th>Analyzed by</th>
              <th>Date</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="entity in analysis">
              <td>
                <a href="javascript:void(0)" @click="openInNewWindow({object: 'analysis', id: entity.id, width: 600})">{{entity.id}}</a>
                <!--<router-link :to="{ path:  '/analysis/' + entity.id}">{{entity.id}}</router-link>-->
              </td>
              <td>{{entity.analysis_method__method}}</td>
              <td>{{entity.agent__name}}</td>
              <td>{{entity.date}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div v-else>
      <div v-if="!isSearching">
        Sorry but we didn't find any results!
        Check your id <b>{{id}}</b>
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
    props: ['id'],
    name: "sample-detail",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/sample/',
        isSearching: false,
        sample: null,
        analysis: null
      }
    },
    metaInfo() {
      return {
        title: 'EUROCORE Data Portal: Sample ' + this.id
      }
    },
    watch: {
      'id': function () {
        this.resetData();
        this.getSampleById(this.id);
        this.getAnalysisBySampleId(this.id);
      },
      'sample': function (newVal, oldVal) {
        if (newVal == null) {
          $('body')[0].setAttribute('class', 'background-color-white')
        } else {
          $('body')[0].removeAttribute('class')
        }
      }
    },
    created: function () {
      this.resetData();
      this.getSampleById(this.id);
      this.getAnalysisBySampleId(this.id);
    },
    methods: {
      getSampleById(id) {
        this.isSearching = true
        this.$http.get(this.API_URL + id, {params: {format: 'json'}}).then(response => {
          this.isSearching = false
          console.log(response);
          if (response.status === 200) {
            this.sample = response.body.results;
          }
        }, errResponse => {
          this.isSearching = false
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getAnalysisBySampleId(sampleId) {
        this.$http.get('https://api.eurocore.rocks/analysis/', {
          params: {
            sample__id: sampleId,
            format: 'json'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.analysis = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(location.origin + '/#/' + params.object + '/' + params.id, '', 'width=' + params.width + ', height=750');
      },

      resetData() {
        this.sample = null;
        this.analysis = null
      },
    }
  }
</script>

<style scoped>
  h3 {
    color: #6bb745;
  }
</style>
