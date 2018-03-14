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
          <img ref="imgZoom" id="imgZoom" width="100%" :src="buildCoreboxUrl('2000', corebox[0].attachmentlink__attachment__url)" />
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

          </b-tab>

          <b-tab v-if="response.reference.count > 0" :title="'References (' + response.reference.count + ')'">

          </b-tab>

          <b-tab v-if="response.attachment.count > 0" :title="'Linked files (' + response.attachment.count + ')'">

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

  export default {
    components: {
      Sample
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
          attachment: { count: 0, results: [] },
        },
      }
    },
    watch: {
      'id': function () {
        this.getCoreboxById(this.id)
      //  TODO: add reset + analyses, samples, references and linked files
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
        })
      },

      getCoreboxRelatedData(table, coreboxId, startDepth, endDepth) {
        this.$http.jsonp('http://api.eurocore.rocks/' + table, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.corebox = response.body.results;
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
      //  TODO: add reset + analyses, samples, references and linked files
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
