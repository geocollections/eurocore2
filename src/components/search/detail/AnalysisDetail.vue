<template>
  <div v-if="analysis != null">

    <div class="row">
      <div class="col">
        <h2 v-if="analysis[0].analysis_method__method !== 'CT'">Analysis ID: {{id}}</h2>
        <h2 v-else>CT scan: {{id}}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-md-6">

        <div class="row">
          <div class="col">

            <h3 v-if="analysis[0].analysis_method__method !== 'CT'">Analysis details</h3>
            <h3 v-else>CT details</h3>

            <table class="table table-bordered table-hover th-styles">
              <tr v-if="analysis[0].id">
                <td>ID</td>
                <td>{{analysis[0].id}}</td>
              </tr>

              <tr v-if="analysis[0].sample__drillcore__name">
                <td>Drillcore</td>
                <td>
                  <router-link :to="{ path: '/drillcore/' + analysis[0].sample__drillcore__id }">{{analysis[0].sample__drillcore__name}}</router-link>
                </td>
              </tr>

              <tr v-if="analysis[0].sample__sample_number">
                <td>Sample</td>
                <td>
                  <a href="javascript:void(0)" @click="openInNewWindow({object: 'sample', id: analysis[0].sample__id})">{{analysis[0].sample__sample_number}}</a>
                  <!--<router-link target="_" :to="{ path: '/sample/' + analysis[0].sample__id }">{{analysis[0].sample__sample_number}}</router-link>-->
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
                <td>{{analysis[0].date | formatDate}}</td>
              </tr>

              <!-- TODO: Icon with link + file size -->
              <tr>
                <td>Raw data</td>
                <td></td>
              </tr>
            </table>

            <div class="row" v-if="spectraCount > 0">
              <div class="col">
                <a class="btn btn-primary mb-3" href="javascript:void(0)" @click="openInNewWindow({object: 'spectrum', id: id})">Show spectra ({{spectraCount}})</a>
                <!--<router-link :to="{ path: '/spectrum/' + id }" class="btn btn-primary mb-3">Show spectra ({{spectraCount}})</router-link>-->
              </div>
            </div>

          </div>

          <div class="col" v-if="analysisResults != null">
            <h3>Analysis results</h3>

            <div class="mb-2">
              <export-buttons filename="analysisResults" />
            </div>

            <table id="table-search" class="table table-bordered table-hover">
              <thead class="thead-light">
              <tr class="th-sort">
                <th>
              <span v-if="analysisResults.length > 1" @click="changeOrder('parameter__parameter')">
                <font-awesome-icon v-if="analysisResultsOrder !== 'parameter__parameter' && analysisResultsOrder !== '-parameter__parameter'" :icon="icon"/>
                <font-awesome-icon v-else :icon="sortingDirection" />
                Parameter
              </span>
                  <div v-else>Parameter</div>
                </th>
                <th>Unit</th>
                <th>
              <span v-if="analysisResults.length > 1" @click="changeOrder('value')">
                <font-awesome-icon v-if="analysisResultsOrder !== 'value' && analysisResultsOrder !== '-value'" :icon="icon"/>
                <font-awesome-icon v-else :icon="sortingDirection" />
                Value
              </span>
                  <div v-else>Value</div>
                </th>
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
      </div>

      <div class="col-md-6">

        <div class="row">
          <div class="col-12" v-if="attachments.length > 0">
            <h3>Slices</h3>

            <div v-for="entity in attachments" v-if="entity.filename.endsWith('png') || entity.filename.endsWith('jpg') || entity.filename.endsWith('jpeg') || entity.filename.endsWith('svg') || entity.filename.endsWith('tif')">

              <a data-fancybox="slices" :href="helper.getFileLink({size: 'large', filename: entity.filename})">
                <img :src="helper.getFileLink({size: 'small', filename: entity.filename})" class="img-responsive"/>
              </a>

            </div>

          </div>

          <div class="col-12" v-if="attachments.length > 0">
            <h3>Videos</h3>

            <div v-for="entity in attachments" v-if="entity.filename.endsWith('mp4') | entity.filename.endsWith('webm') || entity.filename.endsWith('gif')">

              <video width="100%" controls loop>
                <source :src="helper.getFileLink({filename: entity.filename})" type="video/mp4">
              </video>

            </div>

          </div>
        </div>

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
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSort from '@fortawesome/fontawesome-free-solid/faSort'
  import faSortUp from '@fortawesome/fontawesome-free-solid/faSortUp'
  import faSortDown from '@fortawesome/fontawesome-free-solid/faSortDown'
  import ExportButtons from './partial/ExportButtons'
  import helper from '@/assets/js/helper'

  export default {
    components: {
      Spinner,
      FontAwesomeIcon,
      ExportButtons
    },
    props: ['id'],
    name: "analysis-detail",
    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/analysis/',
        helper: helper,
        showLabel: true,
        analysis: null,
        analysisResults: null,
        analysisResultsOrder: 'parameter__parameter',
        spectraCount: 0,
        attachments: [],
      }
    },
    metaInfo() {
      return {
        title: 'EUROCORE Data Portal: Analysis ' + this.id
      }
    },
    computed: {
      icon() {
        return faSort;
      },

      sortingDirection() {
        return this.analysisResultsOrder.includes('-') ? faSortDown : faSortUp
      }
    },
    created: function () {
      this.resetData();
      this.getAnalysisById(this.id);
      this.getAnalysisResultById(this.id);
      this.getSpectraCount(this.id);
      this.getAnalysisAttachments(this.id)
      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
    },
    mounted: function () {
      $("[data-fancybox]").fancybox({
        buttons : [
          'slideShow',
          'fullScreen',
          'thumbs',
          'share',
          'download',
          'arrowLeft',
          'arrowRight',
          'close'
        ],
        thumbs : {
          autoStart : true
        },
        transitionEffect : "slide",
      });
    },
    watch: {
      'id': function () {
        this.resetData();
        this.getAnalysisById(this.id);
        this.getAnalysisResultById(this.id);
        this.getSpectraCount(this.id);
        this.getAnalysisAttachments(this.id)
        setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      },
      'analysisResultsOrder': function () {
        this.getAnalysisResultById(this.id);
      },
      'analysis': function (newVal, oldVal) {
        if (newVal == null) {
          $('body')[0].setAttribute('class', 'background-color-white')
        } else {
          $('body')[0].removeAttribute('class')
        }
      }
    },
    methods: {
      getAnalysisById(id) {
        this.$http.get(this.API_URL + id, {params: {format: 'json'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.analysis = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getAnalysisResultById(id) {
        this.$http.get('https://api.eurocore.rocks/analysis_result/', {
          params: {
            analysis__id: id,
            order_by: this.analysisResultsOrder,
            format: 'json'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.analysisResults = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getSpectraCount(id) {
        this.$http.get('https://api.eurocore.rocks/spectrum/', {
          params: {
            analysis__id: id,
            fields: 'id',
            format: 'json'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.spectraCount = response.body.count;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getAnalysisAttachments(id) {
        this.$http.get('https://api.eurocore.rocks/attachment/', {
          params: {
            analysis__id: id,
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            if (response.body.count > 0) this.attachments = response.body.results
            else this.attachments = []
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      changeOrder(orderValue) {
        if (this.analysisResultsOrder === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.analysisResultsOrder = orderValue;
      },

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(location.origin + '/#/' + params.object + '/' + params.id,'', 'width=' + params.width + ', height=750');
      },

      resetData() {
        this.showLabel = true;
        this.analysis = null;
        this.analysisResults = null;
        this.analysisResultsOrder = 'parameter__parameter';
        this.spectraCount = 0;
      }
    }
  }
</script>

<style scoped>
  h3 {
    color: #6bb745;
  }

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
  }
</style>
