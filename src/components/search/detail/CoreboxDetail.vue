<template>
  <div v-if="corebox != null">

    <div class="row">
      <div class="col">
        <h2>Box: {{corebox[0].number}}</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <router-link v-if="previousBoxExists" class="pull-left" :to="{ path: '/corebox/' + previousBoxId  }">Previous</router-link>
        <router-link v-if="nextBoxExists" class="pull-right" :to="{ path: '/corebox/' + nextBoxId  }">Next</router-link>
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
            <td>Depth from (m)</td>
            <td>{{corebox[0].start_depth}}</td>
          </tr>

          <tr>
            <td>Depth to (m)</td>
            <td>{{corebox[0].end_depth}}</td>
          </tr>
        </table>
      </div>

      <div class="col-6">
        <!--TODO: Wet and dry box clickable previews here-->
      </div>

    </div>


    <div class="row">
      <div class="col">

        <social-sharing :url="'https://eurocore.rocks/#/corebox/' + id"
                        :title="'Corebox from ' + corebox[0].drillcore__name + ' drillcore starting at ' + corebox[0].start_depth + ' m - ' + corebox[0].end_depth + ' m'"
                        :quote="'Corebox from ' + corebox[0].drillcore__name + ' drillcore starting at ' + corebox[0].start_depth + ' m - ' + corebox[0].end_depth + ' m'"
                        :hashtags="'EUROCORE,drillcore,corebox,' + corebox[0].drillcore__name "
                        inline-template>
          <div>

            <network v-b-tooltip.hover.bottom title="LinkedIn" class="btn-share btn btn-primary btn-sm linkedin mr-2" network="linkedin">
              <i class="fab fa-linkedin-in"></i>
            </network>

            <network class="btn-share btn btn-primary btn-sm facebook mr-2" network="facebook">
              <i class="fab fa-facebook-f"></i>
            </network>

              <network class="btn-share btn btn-primary btn-sm twitter" network="twitter">
                <i class="fab fa-twitter"></i>
              </network>

          </div>
        </social-sharing>
      </div>
    </div>


    <div class="row mt-2 mb-3" v-for="image in corebox">
      <div class="col">
        <!--TODO: Show only 1 which is choosed in preview-->

        <!--<a :href="'https://eurocore.rocks/' + image.image__url" :title="'https://eurocore.rocks/' + image.image__url" target="_blank">-->
        <a href="javascript:void(0)" @click="openUrlInNewWindow({url: 'https://eurocore.rocks' + image.image__url })" :title="'https://eurocore.rocks' + image.image__url">
          <img width="100%" :src="buildCoreboxUrl('2000', image.image__url)" />
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
            <plotly-chart :results="response.analysis_summary.results" :parameters="parameters" :name="corebox[0].number" :drillcore-id="corebox[0].drillcore__id" v-if="isChartOpen"></plotly-chart>
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
      Spinner,
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
        availableBoxes: {
          count: 0,
          results: []
        },
        previousBoxExists: false,
        previousBoxId: null,
        nextBoxExists: false,
        nextBoxId: null,
        oldDrillcoreId: null,
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
      if (this.corebox !== null) {
        return {
          title: 'EUROCORE Data Portal: Corebox ' + this.id,
          link: [
            { rel: 'stylesheet',
              href: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
              integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
              crossorigin: 'anonymous'}
          ],
          meta: [
            { 'vmid': 'og:url',
              'property': 'og:url',
              'content': 'https://eurocore.rocks/#/corebox/' + this.id
            },
            { 'vmid': 'og:type',
              'property': 'og:type',
              'content': 'website'
            },
            { 'vmid': 'og:title',
              'property': 'og:title',
              'content': 'EUROCORE Data Portal: Corebox ' + this.id
            },
            { 'vmid': 'og:description',
              'property': 'og:description',
              'content': 'Corebox from ' + this.corebox[0].drillcore__name + ' drillcore starting at ' + this.corebox[0].start_depth + ' m - ' + this.corebox[0].end_depth + ' m'
            },
            { 'vmid': 'og:image',
              'property': 'og:image',
              'content': 'https://eurocore.rocks' + this.corebox[0].image__url
            },
          ]
        }
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
      'corebox': function (newVal, oldVal) {
        if (oldVal !== null && typeof (oldVal) !== 'undefined') {
          this.oldDrillcoreId = oldVal[0].drillcore__id;
        }

        if (this.corebox != null) {
          this.$meta().refresh()

          // This code block needed if user changes ID from url.
          if (this.oldDrillcoreId !== null) {
            if (this.oldDrillcoreId !== this.corebox[0].drillcore__id) {
              this.resetAvailableBoxes();
            }
          }

          if (this.availableBoxes.count === 0) {
            this.getAvailableCoreboxes(this.corebox[0].drillcore__id);
          }
          if (this.availableBoxes.count > 0) {
            this.previousBoxId = this.getPreviousBoxId(this.corebox[0].number, this.availableBoxes.results);
            this.nextBoxId = this.getNextBoxId(this.corebox[0].number, this.availableBoxes.results);
          }

          this.getCoreboxDataByDepth('sample', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getCoreboxDataByDepth('analysis', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getAnalysisSummary(this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
          this.getAllParameters();
          $('body')[0].removeAttribute('class')
        } else {
          $('body')[0].setAttribute('class', 'background-color-white')
        }
      },
      'availableBoxes.results': function (newVal, oldVal) {
        if (newVal.length > 0) {
          this.previousBoxId = this.getPreviousBoxId(this.corebox[0].number, this.availableBoxes.results);
          this.nextBoxId = this.getNextBoxId(this.corebox[0].number, this.availableBoxes.results);
        }
      },
      'previousBoxId': function (newVal, oldVal) {
        if (newVal !== null && typeof (newVal) !== 'undefined') {
          this.previousBoxExists = true;
        }
      },
      'nextBoxId': function (newVal, oldVal) {
        if (newVal !== null && typeof (newVal) !== 'undefined') {
          this.nextBoxExists = true;
        }
      }
    },
    methods: {

      getCoreboxById(id) {
        this.$http.jsonp(this.API_URL + id, {
          before(request) {

            // abort previous request, if exists
            if (this.previousRequest) {
              this.previousRequest.abort();
            }

            // set previous request on Vue instance
            this.previousRequest = request;
          },
          params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.corebox = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        });
      },

      getAvailableCoreboxes(id) {
        this.$http.jsonp(this.API_URL, {params: {drillcore__id: id, fields: 'id,number', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.availableBoxes.count = response.body.count;
            this.availableBoxes.results = response.body.results;
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
        this.$http.jsonp('https://api.eurocore.rocks/analysis_summary/', { params: {drillcore_id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
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
        this.$http.jsonp('https://api.eurocore.rocks/analysis_result/', {params: {format: 'jsonp', distinct: 'true', order_by: 'parameter__parameter', fields: 'parameter__parameter,unit__unit,analysis__analysis_method__method'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.parameters = []; // BUG FIX FOR DUPLICATES
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
          this.goLeft(this.previousBoxId)
        }
        if (event.keyCode === 39) {
          //  RIGHT KEY
          this.goRight(this.nextBoxId)
        }
      },

      goLeft(previousBoxId) {
        if (this.corebox !== null && this.previousBoxExists) {
          this.$router.push({ path: '/corebox/' + previousBoxId })

        }
      },

      goRight(nextBoxId) {
        if (this.corebox !== null && this.nextBoxExists) {
          this.$router.push({ path: '/corebox/' + nextBoxId })
        }
      },

      getPreviousBoxId(currentBoxNumber, availableBoxes) {
        const previousBoxNumber = parseInt(currentBoxNumber) - 1;

        for (const box in availableBoxes) {
          if (previousBoxNumber == availableBoxes[box].number) {
            return availableBoxes[box].id;
          }
        }
      },

      getNextBoxId(currentBoxNumber, availableBoxes) {
        const nextBoxNumber = parseInt(currentBoxNumber) + 1;

        for (const box in availableBoxes) {
          if (nextBoxNumber == availableBoxes[box].number) {
            return availableBoxes[box].id;
          }
        }
      },

      openChart() {
        this.isChartOpen = true;
      },

      openUrlInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(params.url,'', 'width=' + params.width + ', height=750');
      },

      resetData() {
        this.showLabel = true;
        this.corebox = null;
        this.parameters = [];
        this.isChartOpen = false;
        this.previousBoxExists = false;
        this.previousBoxId = null;
        this.nextBoxExists = false;
        this.nextBoxId = null;
        // Do not reset oldDrillcoreId, it is needed!
        this.response = {
          sample: { count: 0, results: [] },
          analysis: { count: 0, results: [] },
          analysis_summary: { count: 0, results: [] },
          reference: { count: 0, results: [] },
          attachment_link: { count: 0, results: [] },
        }
      },

      resetAvailableBoxes() {
        this.availableBoxes = {
          count: 0,
          results: []
        };
      }

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

  .btn:hover {
    opacity: 0.7 !important;
  }
</style>
