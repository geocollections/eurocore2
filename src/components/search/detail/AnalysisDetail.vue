<template>
  <div v-if="analysis != null">

    <div class="row">
      <div class="col">
        <h2>Analysis ID: {{id}}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <h3>Analysis details</h3>
        <table class="table table-bordered table-hover th-styles">
          <tr v-if="analysis[0].id">
            <td>ID</td>
            <td>{{analysis[0].id}}</td>
          </tr>

          <tr v-if="analysis[0].sample__drillcore__name">
            <td>Drillcore</td>
            <td>{{analysis[0].sample__drillcore__name}}</td>
          </tr>

          <tr v-if="analysis[0].sample__sample_number">
            <td>Sample</td>
            <td>
              <router-link :to="{ path: '/sample/' + analysis[0].sample__id }">{{analysis[0].sample__sample_number}}
              </router-link>
            </td>
          </tr>

          <tr v-if="analysis[0].depth">
            <td>Depth from (m)</td>
            <td>{{analysis[0].depth}}</td>
          </tr>

          <tr v-if="analysis[0].end_depth">
            <td>Depth to (m)</td>
            <td>{{analysis[0].end_depth}}</td>
          </tr>

          <tr v-if="analysis[0].analysis_method__method">
            <td>Method</td>
            <td>{{analysis[0].analysis_method__method}}</td>
          </tr>

          <tr v-if="analysis[0].lab__lab">
            <td>Lab</td>
            <td>{{analysis[0].lab__lab}}</td>
          </tr>

          <tr v-if="analysis[0].instrument__instrument">
            <td>Instrument</td>
            <td>{{analysis[0].instrument__instrument}}</td>
          </tr>

          <tr v-if="analysis[0].instrument__model">
            <td>Instrument model</td>
            <td>{{analysis[0].instrument__model}}</td>
          </tr>

          <tr v-if="analysis[0].analytical">
            <td>Analytical procedures & conditions</td>
            <td>{{analysis[0].analytical}}</td>
          </tr>

          <tr v-if="analysis[0].refs">
            <td>Reference sample(s) or standard(s)</td>
            <td>{{analysis[0].refs}}</td>
          </tr>

          <tr v-if="analysis[0].postProccessing">
            <td>Post-proccessing</td>
            <td>{{analysis[0].postProccessing}}</td>
          </tr>

          <tr v-if="analysis[0].agent__name">
            <td>Analyzed by</td>
            <td>{{analysis[0].agent__name}}</td>
          </tr>

          <tr v-if="analysis[0].date">
            <td>Date</td>
            <td>{{analysis[0].date}}</td>
          </tr>
        </table>
      </div>

      <div class="col" v-if="analysisResults != null">
        <h3>Analysis results</h3>
        <table class="table table-bordered table-hover">
          <thead class="thead-light">
          <tr>
            <th>Parameter</th>
            <th>Unit</th>
            <th>Value</th>
            <th>Error</th>
            <th>LOD</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="analysisResult in analysisResults">
            <td>{{analysisResult.parameter__parameter}}</td>
            <td>{{analysisResult.unit__unit}}</td>
            <td>{{analysisResult.value}} {{analysisResult.value_txt}}</td>
            <td>{{analysisResult.value_error}}</td>
            <td>{{analysisResult.lower_limit}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>


    <div class="row" v-if="spectraCount > 0">
      <div class="col">
        <router-link :to="{ path: '/spectrum/' + id }" class="btn btn-primary mb-3">Show spectra ({{spectraCount}})
        </router-link>
      </div>
    </div>

  </div>
  <div v-else>
    <div v-if="showLabel">
      <spinner size="large" message="Loading data..."></spinner>
    </div>
    <div v-else>
      Sorry but we didn't find any results!
      Check your id <b>{{id}}</b>
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
    name: "analysis-detail",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/analysis/',
        showLabel: true,
        analysis: null,
        analysisResults: null,
        spectraCount: 0
      }
    },
    metaInfo() {
      return {
        title: 'EUROCORE Data Portal: Analysis ' + this.id
      }
    },
    created: function () {
      this.resetData();
      this.getAnalysisById(this.id);
      this.getAnalysisResultById(this.id);
      this.getSpectraCount(this.id);
      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
    },
    watch: {
      'id': function () {
        this.resetData();
        this.getAnalysisById(this.id);
        this.getAnalysisResultById(this.id);
        this.getSpectraCount(this.id);
        setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      }
    },
    methods: {
      getAnalysisById(id) {
        this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.analysis = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getAnalysisResultById(id) {
        this.$http.jsonp('https://api.eurocore.rocks/analysis_result/', {
          params: {
            analysis__id: id,
            format: 'jsonp'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.analysisResults = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getSpectraCount(id) {
        this.$http.jsonp('https://api.eurocore.rocks/spectrum/', {
          params: {
            analysis__id: id,
            fields: 'id',
            format: 'jsonp'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.spectraCount = response.body.count;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      resetData() {
        this.showLabel = true;
        this.analysis = null;
        this.analysisResults = null;
        this.spectraCount = 0;
      }
    }
  }
</script>

<style scoped>
  h3 {
    color: #6bb745;
  }
</style>
