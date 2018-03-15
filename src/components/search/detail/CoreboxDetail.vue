<template>
  <div v-if="corebox != null">

    <div class="row">
      <div class="col">
        <h2>Box: {{corebox[0].number}}</h2>
      </div>
    </div>


    <div class="row mt-2 mb-3">
      <div class="col">
        <a :href="'http://eurocore.rocks/' + corebox[0].attachmentlink__attachment__url" target="_blank">
          <img width="100%" :src="buildCoreboxUrl('2000', corebox[0].attachmentlink__attachment__url)" />
        </a>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <table class="table table-bordered table-hover th-styles">
          <tr>
            <td>ID</td>
            <td>{{corebox[0].id}}</td>
          </tr>

          <tr>
            <td>Drillcore</td>
            <td>{{corebox[0].drillcore__name}}</td>
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


    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab v-if="response.sample.count > 0" :title="'Samples (' + response.sample.count + ')'">
            <sample :results="response.sample.results"></sample>
          </b-tab>

          <b-tab v-if="response.analysis.count > 0" :title="'Analyses (' + response.analysis.count + ')'">
            <analysis :results="response.analysis.results"></analysis>
          </b-tab>

          <b-tab v-if="response.reference.count > 0" :title="'References (' + response.reference.count + ')'">
            <!--<reference :results="response.reference.results"></reference>-->
          </b-tab>

          <b-tab v-if="response.attachment_link.count > 0" :title="'Linked files (' + response.attachment_link.count + ')'">

          </b-tab>
        </b-tabs>
      </div>
    </div>

  </div>
  <div v-else>
    Sorry but we didn't find any results!
    Check your id <b>{{id}}</b>
  </div>
</template>

<script>
  import Sample from './tables/Sample';
  import Analysis from './tables/Analysis'
  // import Reference from './tables/Reference'

  export default {
    components: {
      Sample,
      Analysis,
      // Reference
    },
    props: ['id'],
    name: "corebox-detail",
    data() {
      return {
        API_URL: 'http://api.eurocore.rocks/drillcore_box/',
        corebox: null,
        response: {
          sample: { count: 0, results: [] },
          analysis: { count: 0, results: [] },
          reference: { count: 0, results: [] },
          attachment_link: { count: 0, results: [] },
        },
      }
    },
    watch: {
      'id': function () {
        this.getCoreboxById(this.id);
        //  TODO: add reset + analyses, samples, references and linked files
      },
      'corebox': function () {
        this.getCoreboxDataByDepth('sample', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
        this.getCoreboxDataByDepth('analysis', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
        // this.getCoreboxDataById('reference', this.corebox[0].drillcore_box__id);
        // this.getCoreboxDataById('attachment', this.corebox[0].drillcore_box__id);
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
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        });
      },

      getCoreboxDataByDepth(table, drillcoreId, startDepth, endDepth) {
        this.$http.jsonp('http://api.eurocore.rocks/' + table + '/', {params: {drillcore__id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
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
      },

      getCoreboxDataById(table, coreboxId) {
        this.$http.jsonp('http://api.eurocore.rocks/' + table + '/', {params: {format: 'jsonp'}}).then(response => {
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
      },

      buildCoreboxUrl(size, url) {
        return 'http://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
      },

    },
    created: function () {
      this.getCoreboxById(this.id);
    },
  }
</script>

<style scoped>
  .th-styles tr td:first-child {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
    font-weight: bold;
  }

  #overlay{
    margin-top: 20px;
    border:1px solid black;
    width:100%;
    height:250px;
    display:inline-block;
    background-repeat:no-repeat;
  }
</style>
