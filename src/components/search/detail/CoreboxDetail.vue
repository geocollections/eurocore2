<template>
  <div v-if="corebox != null">

    <div class="row">
      <div class="col">
        <h2>Box: {{corebox[0].number}}</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <router-link class="pull-left" :to="{ path: '/corebox/' + (parseInt(id) - 1)  }">Previous</router-link>
        <router-link class="pull-right" :to="{ path: '/corebox/' + (parseInt(id) + 1)  }">Next</router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <table class="table table-bordered table-hover th-styles">
          <tr>
            <td>ID</td>
            <td>{{corebox[0].id}}</td>
          </tr>

          <tr>
            <td>Drillcore</td>
            <td>
              <router-link :to="{ path: '/drillcore/' + corebox[0].drillcore__id }" >{{corebox[0].drillcore__name}}</router-link>
            </td>
          </tr>

          <tr>
            <td>Depth form (m)</td>
            <td>{{corebox[0].start_depth}}</td>
          </tr>

          <tr>
            <td>Depth to (m)</td>
            <td>{{corebox[0].end_depth}}</td>
          </tr>
        </table>
      </div>
    </div>


    <div class="row mt-2 mb-3">
      <div class="col">
        <a :href="'https://eurocore.rocks/' + corebox[0].image__url" target="_blank">
          <img width="100%" :src="buildCoreboxUrl('2000', corebox[0].image__url)" />
        </a>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab v-if="response.sample.count > 0" :title="'Samples (' + response.sample.count + ')'">
            <sample :results="response.sample.results"></sample>
          </b-tab>

          <b-tab v-if="response.analysis.count > 0" :title="'Analyses (' + response.analysis.count + ')'">
            <!--TODO: make that into analysis_summary-->
            <analysis :results="response.analysis.results"></analysis>
          </b-tab>

          <b-tab v-if="response.analysis_summary.count > 0" title="Chart" @click="openChart()">
            <plotly-chart :results="response.analysis_summary.results" :parameters="parameters" :name="corebox[0].number" v-if="isChartOpen"></plotly-chart>
          </b-tab>

          <b-tab v-if="response.reference.count > 0" :title="'References (' + response.reference.count + ')'">
            <!--<reference :results="response.reference.results"></reference>-->
          </b-tab>

        </b-tabs>
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
  import Sample from './tables/Sample';
  import Analysis from './tables/Analysis'
  import PlotlyChart from './partial/PlotlyChart'
  import Spinner from 'vue-simple-spinner'
  // import Reference from './tables/Reference'

  export default {
    components: {
      Sample,
      Analysis,
      PlotlyChart,
      Spinner
      // Reference
    },
    props: ['id'],
    name: "corebox-detail",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/drillcore_box/',
        showLabel: true,
        corebox: null,
        parameters: [],
        isChartOpen: false,
        response: {
          sample: { count: 0, results: [] },
          analysis: { count: 0, results: [] },
          analysis_summary: { count: 0, results: [] },
          reference: { count: 0, results: [] },
          attachment_link: { count: 0, results: [] },
        },
      }
    },
    metaInfo () {
      return {
        title: 'EUROCORE Data Portal: Corebox ' + this.id
      }
    },
    created: function () {
      this.resetData();
      this.getCoreboxById(this.id);
      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      window.addEventListener('keyup', this.handleKeyup)
    },
    beforeDestroy: function () {
      window.removeEventListener('keyup', this.handleKeyup)
    },
    watch: {
      'id': function () {
        this.resetData();
        this.getCoreboxById(this.id);
        setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      },
      'corebox': function () {
        if (this.corebox != null) {
          this.getCoreboxDataByDepth('sample', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getCoreboxDataByDepth('analysis', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getAnalysisSummary(this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getAllParameters();
        }
      }
    },
    methods: {
      getCoreboxById(id) {
        this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.corebox = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        });
      },

      getCoreboxDataByDepth(table, drillcoreId, startDepth, endDepth) {
        this.$http.jsonp('https://api.eurocore.rocks/' + table + '/', {params: {drillcore__id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response[table].count = response.body.count;
            this.response[table].results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getAnalysisSummary(drillcoreId, startDepth, endDepth) {
        this.$http.jsonp('https://api.eurocore.rocks/analysis_summary/', {params: {drillcore_id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.analysis_summary.count = response.body.count;
            this.response.analysis_summary.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getAllParameters() {
        this.$http.jsonp('https://api.eurocore.rocks/analysis_result/' , {params: {format: 'jsonp', distinct: 'true', order_by: 'parameter__parameter', fields: 'parameter__parameter,unit__unit,analysis__analysis_method__method'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            const allParameters = response.body.results;
            for (const i in allParameters) {
              if (this.areParametersEligible(allParameters[i])) {
                this.parameters.push(this.getCorrectParameterFormat(allParameters[i]));
              }
            }
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      areParametersEligible(param) {
        return param.parameter__parameter != null && param.unit__unit != null;
      },

      getCorrectParameterFormat(param) {
        if (param !== 'undefined') {
          if (param.analysis__analysis_method__method != null) {
            return param.parameter__parameter + ' ' + param.unit__unit + ' (' + param.analysis__analysis_method__method + ')';
          }
          return param.parameter__parameter + ' ' + param.unit__unit;
        }
      },

      buildCoreboxUrl(size, url) {
        if (url != null) {
          return 'https://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
        }
      },

      handleKeyup(event) {
        if (event.keyCode === 37) {
          //  LEFT KEY
          this.goLeft(this.id)
        }
        if (event.keyCode === 39) {
          //  RIGHT KEY
          this.goRight(this.id)
        }
      },

      goLeft(id) {
        this.$router.push({ path: '/corebox/' + (parseInt(id) - 1) })
      },

      goRight(id) {
        this.$router.push({ path: '/corebox/' + (parseInt(id) + 1) })
      },

      resetData() {
        this.showLabel = true;
        this.corebox = null;
        this.parameters = [];
        this.isChartOpen = false;
        this.response = {
          sample: { count: 0, results: [] },
          analysis: { count: 0, results: [] },
          analysis_summary: { count: 0, results: [] },
          reference: { count: 0, results: [] },
          attachment_link: { count: 0, results: [] },
        }
      },

      openChart() {
        this.isChartOpen = true;
      },

    }
  }
</script>

<style scoped>
  .th-styles tr td:first-child {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
    font-weight: bold;
  }

  .pull-left {
    float: left;
  }

  .pull-right {
    float: right;
  }
</style>
