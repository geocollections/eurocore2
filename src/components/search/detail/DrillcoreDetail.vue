<template>
  <div v-if="drillcore != null">

    <div class="row">
      <div class="col">
        <h2>{{drillcore[0].name}}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-md-12 col-lg-6">
        <table class="table table-bordered table-hover th-styles">
          <tr v-if="drillcore[0].id">
            <td>ID</td>
            <td>{{drillcore[0].id}}</td>
          </tr>

          <tr v-if="drillcore[0].deposit__name">
            <td>Deposit</td>
            <td>
              <router-link :to="{ path: '/deposit/' + drillcore[0].deposit__id }">{{drillcore[0].deposit__name}}
              </router-link>
            </td>
          </tr>

          <tr v-if="drillcore[0].latitude">
            <td>Latitude</td>
            <td>{{drillcore[0].latitude}}</td>
          </tr>

          <tr v-if="drillcore[0].longitude">
            <td>Longitude</td>
            <td>{{drillcore[0].longitude}}</td>
          </tr>

          <tr v-if="drillcore[0].hole_length">
            <td>Length</td>
            <td>{{drillcore[0].hole_length}} m</td>
          </tr>

          <tr v-if="drillcore[0].hole_dip">
            <td>Dip</td>
            <td>{{drillcore[0].hole_dip}}</td>
          </tr>

          <tr v-if="drillcore[0].hole_azimuth">
            <td>Azimuth</td>
            <td>{{drillcore[0].hole_azimuth}}</td>
          </tr>

          <tr v-if="drillcore[0].drilling_year">
            <td>Drilling year</td>
            <td>{{drillcore[0].drilling_year}}</td>
          </tr>

          <tr v-if="drillcore[0].drilling_agent__name">
            <td>Drilling company</td>
            <td>{{drillcore[0].drilling_agent__name}}</td>
          </tr>

          <tr v-if="drillcore[0].number_boxes">
            <td>Number of boxes</td>
            <td>{{drillcore[0].number_boxes}}</td>
          </tr>

          <tr v-if="drillcore[0].core_depositor__name">
            <td>Deposited by</td>
            <td>{{drillcore[0].core_depositor__name}}</td>
          </tr>
        </table>
      </div>

      <div class="col-md-12 col-lg-6" v-if="drillcore[0].latitude != null || drillcore[0].longitude != null">
        <detail-map :lat="drillcore[0].latitude" :lon="drillcore[0].longitude" :name="drillcore[0].name"></detail-map>
        <br>
        <router-link :to="{ path: '/drillcore_data/' + drillcore[0].id }" class="btn btn-primary mb-3">Show analytical data
        </router-link>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs v-if="drillcoreSummary != null" v-model="tabIndex">

          <!-- TODO: Hide disabled tabs from user view -->

          <b-tab v-show="drillcoreSummary[0].boxes > 0"
                 @click="addTabToUrl('core_boxes')"
                 :disabled="drillcoreSummary[0].boxes === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].boxes === 0 }"
                 :title="'Core boxes' + ' (' + drillcoreSummary[0].boxes + ')'">
            <drillcore-box :results="response.drillcore_box.results"></drillcore-box>
            <infinite-loading @infinite="infiniteHandler">
              <span slot="no-more"></span>
            </infinite-loading>
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].lithologies > 0"
                 :disabled="drillcoreSummary[0].lithologies === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].lithologies === 0 }"
                 :title="'Lithology' + ' (' + drillcoreSummary[0].lithologies + ')'"
                 @click="getResultsByDrillcoreId('lithology', id, 'start_depth')">
            <lithology :results="response.lithology.results"></lithology>
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].dips > 0"
                 :disabled="drillcoreSummary[0].dip === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].dips === 0 }"
                 :title="'Dip/Azimuth' + ' (' + drillcoreSummary[0].dips + ')'"
                 @click="getResultsByDrillcoreId('dip', id, 'depth')">
            <dip :results="response.dip.results"></dip>
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].rqds > 0"
                 :disabled="drillcoreSummary[0].rqds === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].rqds === 0 }"
                 :title="'RQD' + ' (' + drillcoreSummary[0].rqds + ')'"
                 @click="getResultsByDrillcoreId('rqd', id, 'depth')">
            <rqd :results="response.rqd.results"></rqd>
          </b-tab>

          <b-tab v-if="drillcoreSummary[0].structures > 0"
                 :title="'Structures' + ' (' + drillcoreSummary[0].structures + ')'">
            <br>I'm the first fading tab
          </b-tab>

          <b-tab v-if="drillcoreSummary[0].stratigraphies > 0"
                 :title="'Stratigraphy' + ' (' + drillcoreSummary[0].stratigraphies + ')'">
            <br>I'm the first fading tab
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].samples > 0"
                 :disabled="drillcoreSummary[0].samples === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].samples === 0 }"
                 :title="'Samples' + ' (' + drillcoreSummary[0].samples + ')'"
                 @click="getResultsByDrillcoreId('sample', id, 'depth')">
            <sample :results="response.sample.results"></sample>
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].analyses > 0"
                 :disabled="drillcoreSummary[0].analyses === 0"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].analyses === 0 }"
                 :title="'Analyses' + ' (' + drillcoreSummary[0].analyses + ')'"
                 @click="getResultsByDrillcoreId('analysis', id, 'depth')">
            <analysis :results="response.analysis.results"></analysis>
          </b-tab>

          <b-tab v-show="drillcoreSummary[0].ctscans > 0"
                 :disabled="drillcoreSummary[0].ctscans === null"
                 :title-item-class="{ 'd-none' : drillcoreSummary[0].ctscans === null }"
                 :title="'CT scans' + ' (' + drillcoreSummary[0].ctscans + ')'"
                 @click="getCTscansByDrillcoreId(id)">
            <ct-scans :results="response.ctscans.results"></ct-scans>
          </b-tab>

          <b-tab v-if="drillcoreSummary[0].attachments > 0"
                 :title="'Linked files' + ' (' + drillcoreSummary[0].attachments + ')'"
                 @click="getResultsByDrillcoreId('attachment_link', id, 'depth')">
            <br>I'm the first fading tab
          </b-tab>

          <b-tab v-if="drillcoreSummary[0].references > 0"
                 :title="'References' + ' (' + drillcoreSummary[0].references + ')'">
            <br>I'm the first fading tab
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
  import InfiniteLoading from 'vue-infinite-loading';
  import DetailMap from './partial/DetailMap';
  import DrillcoreBox from './tables/DrillcoreBox';
  import Lithology from './tables/Lithology';
  import Dip from './tables/Dip';
  import Rqd from './tables/Rqd';
  import Sample from './tables/Sample';
  import Analysis from './tables/Analysis';
  import CtScans from './tables/CtScans';
  import Spinner from 'vue-simple-spinner'

  export default {
    components: {
      InfiniteLoading,
      DetailMap,
      DrillcoreBox,
      Lithology,
      Dip,
      Rqd,
      Sample,
      Analysis,
      CtScans,
      Spinner
    },
    props: ['id'],
    name: "drillcore-detail",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/drillcore/',
        showLabel: true,
        drillcore: null,
        drillcoreSummary: null,
        tabIndex: 0,
        response: {
          drillcore_box: {page: 0, paginateBy: 5, count: 0, results: []},
          lithology: {count: 0, results: []},
          dip: {count: 0, results: []},
          rqd: {count: 0, results: []},
          structures: {count: 0, results: []},
          stratigraphy: {count: 0, results: []},
          sample: {count: 0, results: []},
          analysis: {count: 0, results: []},
          ctscans: {count: 0, results: []},
          attachment_link: {count: 0, results: []},
          references: {count: 0, results: []}
        }
      }
    },

    metaInfo() {
      return {
        title: 'EUROCORE Data Portal: Drillcore ' + this.id
      }
    },

    beforeRouteUpdate: function (to, from, next) {
      if (to.query.tab === 'lithology') {
        this.tabIndex = 1;
      } else if (to.query.tab === 'dip') {
        this.tabIndex = 2;
      } else if (to.query.tab === 'rqd') {
        this.tabIndex = 3;
      } else if (to.query.tab === 'sample') {
        this.tabIndex = 4;
      } else if (to.query.tab === 'analysis') {
        this.tabIndex = 5;
      } else if (to.query.tab === 'ct_scans') {
        this.tabIndex = 6;
      } else {
        this.tabIndex = 0;
      }
      next()
    },

    created: function () {
      this.setTabFromUrl(this.id);
      this.getDrillcoreById(this.id);
      this.getDrillcoreSummary(this.id);
      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
    },

    watch: {
      'id': function () {
        this.resetData();
        this.setTabFromUrl(this.id)
        this.getDrillcoreById(this.id);
        this.getDrillcoreSummary(this.id);
        setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      },
      'drillcore': function (newVal, oldVal) {
        if (newVal == null) {
          $('body')[0].setAttribute('class', 'background-color-white')
        } else {
          $('body')[0].removeAttribute('class')
        }
      }
    },

    methods: {
      getDrillcoreById(id) {
        this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.drillcore = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getDrillcoreSummary(id) {
        this.$http.jsonp('https://api.eurocore.rocks/drillcore_summary/' + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.drillcoreSummary = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getCTscansByDrillcoreId(id) {
        this.addTabToUrl('ct_scans')

        if (!(this.response.ctscans.count > 0 && this.response.ctscans.results.length > 0 && typeof(this.response.ctscans.results !== 'undefined'))) {
          this.$http.jsonp('https://api.eurocore.rocks/analysis/', {
            params: {
              drillcore__id: id,
              analysis_method__method: 'CT',
              format: 'jsonp'
            }
          }).then(response => {
            console.log(response.body.results);
            if (response.status === 200) {
              this.response.ctscans.count = response.body.count;
              this.response.ctscans.results = response.body.results;
            }
          }, errResponse => {
            console.log('ERROR: ');
            console.log(errResponse);
            console.log(errResponse.status);
          })
        }
      },

      getResultsByDrillcoreId(table, drillcoreId, orderBy) {
        this.addTabToUrl(table);

        if (!(this.response[table].count > 0 && this.response[table].results.length > 0 && typeof(this.response[table].results !== 'undefined'))) {
          this.$http.jsonp('https://api.eurocore.rocks/' + table + '/', {
            params: {
              drillcore__id: drillcoreId,
              order_by: orderBy,
              format: 'jsonp'
            }
          }).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.response[table].count = response.body.count;
              this.response[table].results = response.body.results;
            }
          }, errResponse => {
            console.log('ERROR: ');
            console.log(errResponse);
            console.log(errResponse.status);
          })
        }
      },

      infiniteHandler($state) {
        if (this.response.drillcore_box.results.length < this.drillcoreSummary[0].boxes) {
          this.response.drillcore_box.page += 1;
          this.$http.jsonp('https://api.eurocore.rocks/drillcore_box/', {
            params: {
              drillcore__id: this.id,
              page: this.response.drillcore_box.page,
              paginate_by: this.response.drillcore_box.paginateBy,
              order_by: 'start_depth',
              format: 'jsonp'
            }
          }).then(response => {
            console.log(response);
            console.log(response.body.results);
            if (response.status === 200) {
              // this.response.drillcore_box.count = response.body.count;
              for (const item in response.body.results) {
                this.response.drillcore_box.results.push(response.body.results[item]);
              }
              $state.loaded();
            }
          }, errResponse => {
            console.log('ERROR: ');
            console.log(errResponse);
            console.log(errResponse.status);
          })
        } else {
          $state.complete();
        }
      },

      setTabFromUrl(drillcoreId) {
        if (this.$route.query.tab === 'lithology') {
          this.getResultsByDrillcoreId('lithology', drillcoreId, 'start_depth')
          this.tabIndex = 1;
        } else if (this.$route.query.tab === 'dip') {
          this.getResultsByDrillcoreId('dip', drillcoreId, 'depth')
          this.tabIndex = 2;
        } else if (this.$route.query.tab === 'rqd') {
          this.getResultsByDrillcoreId('rqd', drillcoreId, 'depth')
          this.tabIndex = 3;
        } else if (this.$route.query.tab === 'sample') {
          this.getResultsByDrillcoreId('sample', drillcoreId, 'depth')
          this.tabIndex = 4;
        } else if (this.$route.query.tab === 'analysis') {
          this.getResultsByDrillcoreId('analysis', drillcoreId, 'depth')
          this.tabIndex = 5;
        } else if (this.$route.query.tab === 'ct_scans') {
          this.getCTscansByDrillcoreId(drillcoreId)
          this.tabIndex = 6;
        } else {
          this.tabIndex = 0;
        }
      },

      addTabToUrl(table) {
        if (this.$route.query.tab !== table) {
          this.$router.push({ path: '/drillcore/' + this.id, query: { tab: table } })
        }
      },

      resetData() {
        this.showLabel = true;
        this.drillcore = null;
        this.drillcoreSummary = null;
        // this.tabIndex = 0; Not Resetting it!
        this.response = {
          drillcore_box: {page: 0, paginateBy: 5, count: 0, results: []},
          lithology: {count: 0, results: []},
          dip: {count: 0, results: []},
          rqd: {count: 0, results: []},
          structures: {count: 0, results: []},
          stratigraphy: {count: 0, results: []},
          sample: {count: 0, results: []},
          analysis: {count: 0, results: []},
          ctscans: {count: 0, results: []},
          attachment_link: {count: 0, results: []},
          references: {count: 0, results: []}
        }
      },

    },
  }
</script>

<style>
  .th-styles tr td:first-child {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
    font-weight: bold;
  }

  .card {
    border: none;
  }

</style>
