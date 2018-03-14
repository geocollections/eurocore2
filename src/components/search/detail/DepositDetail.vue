<template>
  <div v-if="deposit != null">

    <div class="row">
      <div class="col">
        <h2>{{deposit[0].name}} deposit</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab title="Deposit data">
            <table class="table table-bordered table-hover th-styles mt-2">
              <tr v-if="deposit[0].id">
                <td>ID</td>
                <td>{{deposit[0].id}}</td>
              </tr>

              <tr v-if="deposit[0].name">
                <td>Deposit</td>
                <td>{{deposit[0].name}}</td>
              </tr>

              <tr v-if="deposit[0].alternative_names">
                <td>Alternative names</td>
                <td>{{deposit[0].alternative_names}}</td>
              </tr>

              <tr v-if="deposit[0].latitude">
                <td>Latitude</td>
                <td>{{deposit[0].latitude}}</td>
              </tr>

              <tr v-if="deposit[0].longitude">
                <td>Longitude</td>
                <td>{{deposit[0].longitude}}</td>
              </tr>

              <tr v-if="deposit[0].genetic_type__name">
                <td>Ore genetic type</td>
                <td>{{deposit[0].genetic_type__name}} m</td>
              </tr>

              <tr v-if="deposit[0].metal_group__name">
                <td>Metal group</td>
                <td>{{deposit[0].metal_group__name}}</td>
              </tr>

              <tr v-if="deposit[0].metal_subgroup__name">
                <td>Metal subgroup</td>
                <td>{{deposit[0].metal_subgroup__name}}</td>
              </tr>

              <tr v-if="deposit[0].main_commodity">
                <td>Main commodity</td>
                <td>{{deposit[0].main_commodity}}</td>
              </tr>

              <tr v-if="deposit[0].other_commodities">
                <td>Other commodities</td>
                <td>{{deposit[0].other_commodities}}</td>
              </tr>
            </table>
          </b-tab>
          <b-tab title="Mining data">
            <table class="table table-hover table-bordered th-styles mt-2">
              <tr v-if="deposit[0].size_cat">
                <td>Size</td>
                <td>{{deposit[0].size_cat}}</td>
              </tr>

              <tr v-if="deposit[0].shape">
                <td>Shape</td>
                <td>{{deposit[0].shape}}</td>
              </tr>

              <tr v-if="deposit[0].status">
                <td>Status</td>
                <td>{{deposit[0].status}}</td>
              </tr>

              <tr v-if="deposit[0].discovery">
                <td>Year of discovery</td>
                <td>{{deposit[0].discovery}}</td>
              </tr>

              <tr v-if="deposit[0].mining_start">
                <td>Mining started</td>
                <td>{{deposit[0].mining_start}}</td>
              </tr>

              <tr v-if="deposit[0].mining_time">
                <td>Mined during</td>
                <td>{{deposit[0].mining_time}}</td>
              </tr>

              <tr v-if="deposit[0].mining_method">
                <td>Mining method</td>
                <td>{{deposit[0].mining_method}}</td>
              </tr>

              <tr v-if="deposit[0].resource">
                <td>Resource Mt</td>
                <td>{{deposit[0].resource}}</td>
              </tr>

              <tr v-if="deposit[0].reserve">
                <td>Reserve Mt</td>
                <td>{{deposit[0].reserve}}</td>
              </tr>

              <tr v-if="deposit[0].mined_mt">
                <td>Mined Mt</td>
                <td>{{deposit[0].mined_mt}}</td>
              </tr>

              <tr v-if="deposit[0].tonnage">
                <td>Total tonnage</td>
                <td>{{deposit[0].tonnage}}</td>
              </tr>

              <tr v-if="deposit[0].grade">
                <td>Commodity grade</td>
                <td>{{deposit[0].grade}}</td>
              </tr>
            </table>
          </b-tab>
          <b-tab title="Geological data">
            <table class="table table-hover table-bordered th-styles mt-2">
              <tr v-if="deposit[0].district">
                <td>Geological district</td>
                <td>{{deposit[0].district}}</td>
              </tr>
              <tr v-if="deposit[0].metgen_area">
                <td>Metallogenic area</td>
                <td>{{deposit[0].metgen_area}}</td>
              </tr>
              <tr v-if="deposit[0].host_rock1 || deposit[0].host_rock2">
                <td>Host rock</td>
                <td>{{deposit[0].host_rock1}}<br>{{deposit[0].host_rock2}}</td>
              </tr>
              <tr v-if="deposit[0].adj_rock1 || deposit[0].adj_rock2 || deposit[0].adj_rock3 || deposit[0].adj_rock4">
                <td>Adjacent rock</td>
                <td>{{deposit[0].adj_rock1}}<br>{{deposit[0].adj_rock2}}<br>{{deposit[0].adj_rock3}}<br>{{deposit[0].adj_rock4}}</td>
              </tr>
              <tr v-if="deposit[0].age_host__age">
                <td>Age of host rocks</td>
                <td>{{deposit[0].age_host__age}}</td>
              </tr>
              <tr v-if="deposit[0].radiom_age_host">
                <td>Radiometric age of host rocks</td>
                <td>{{deposit[0].radiom_age_host}}</td>
              </tr>
              <tr v-if="deposit[0].age_min__age">
                <td>Age of mineralization</td>
                <td>{{deposit[0].age_min__age}}</td>
              </tr>
              <tr v-if="deposit[0].radiom_age_min">
                <td>Radiometric age of mineralization</td>
                <td>{{deposit[0].radiom_age_min}}</td>
              </tr>
              <tr v-if="deposit[0].mineralogy1 || deposit[0].mineralogy2">
                <td>Ore mineralogy</td>
                <td>{{deposit[0].mineralogy1}}<br>{{deposit[0].mineralogy2}}</td>
              </tr>
              <tr v-if="deposit[0].ore_distrib">
                <td>Ore mineral distribution</td>
                <td>{{deposit[0].ore_distrib}}</td>
              </tr>
              <tr v-if="deposit[0].alteration">
                <td>Alteration</td>
                <td>{{deposit[0].alteration}}</td>
              </tr>
              <tr v-if="deposit[0].metam_grade">
                <td>Regional metamorphic grade</td>
                <td>{{deposit[0].metam_grade}}</td>
              </tr>
              <tr v-if="deposit[0].texture">
                <td>Texture</td>
                <td>{{deposit[0].texture}}</td>
              </tr>
              <tr v-if="deposit[0].structure">
                <td>Structure</td>
                <td>{{deposit[0].structure}}</td>
              </tr>
              <tr v-if="deposit[0].strike">
                <td>Main direction of deposit strike</td>
                <td>{{deposit[0].strike}}</td>
              </tr>
              <tr v-if="deposit[0].dip">
                <td>Main direction of deposit dip</td>
                <td>{{deposit[0].dip}}</td>
              </tr>
              <tr v-if="deposit[0].plunge">
                <td>Main direction of deposit plunge</td>
                <td>{{deposit[0].plunge}}</td>
              </tr>
              <tr v-if="deposit[0].tect_ctrl">
                <td>Tectonic control</td>
                <td>{{deposit[0].tect_ctrl}}</td>
              </tr>
              <tr v-if="deposit[0].remarks">
                <td>Comments</td>
                <td>{{deposit[0].remarks}}</td>
              </tr>
            </table>
          </b-tab>
        </b-tabs>
      </div>

      <div class="col" v-if="deposit[0].latitude != null || deposit[0].longitude != null">
        <detail-map :lat="deposit[0].latitude" :lon="deposit[0].longitude" :name="deposit[0].name"></detail-map>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab v-if="response.drillcore.count > 0" :title="'Drillcores (' + response.drillcore.count + ')'">
            <drillcore :results="response.drillcore.results"></drillcore>
          </b-tab>

          <b-tab v-if="response.reference.count > 0" :title="'References (' + response.reference.count + ')'">
            <reference :results="response.reference.results"></reference>
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
  import DetailMap from './partial/DetailMap';
  import Drillcore from './tables/Drillcore';
  import Reference from './tables/Reference';

  export default {
    components: {
      DetailMap,
      Drillcore,
      Reference
    },
    props: ['id'],
    name: "deposit-detail",
    data() {
      return {
        API_URL: 'http://api.eurocore.rocks/deposit/',
        deposit: null,
        response: {
          drillcore: { count: 0, results: [] },
          reference: { count: 0, results: [] }
        },
      }
    },
    watch: {
      'id': function () {
        this.resetData();
        this.getDepositById(this.id);
        this.getResultsByDepositId('drillcore', this.id, 'id');
        this.getResultsByDepositId('reference', this.id, 'id');
      }
    },
    methods: {

      getDepositById(id) {
        this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.deposit = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getResultsByDepositId(table, depositId, orderBy) {
        if (!(this.response[table].count > 0 && this.response[table].results.length > 0 && typeof(this.response[table].results !== 'undefined'))) {
          this.$http.jsonp('http://api.eurocore.rocks/' + table + '/', {params: {deposit__id: depositId, order_by: orderBy, format: 'jsonp'}}).then(response => {
            console.log(response.body.results);
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

      resetData() {
        this.deposit = null;
        this.response = {
          drillcore: { count: 0, results: [] },
          reference: { count: 0, results: [] }
        }
      },

    },
    created: function () {
      this.getDepositById(this.id);
      this.getResultsByDepositId('drillcore', this.id, 'id');
      this.getResultsByDepositId('reference', this.id, 'id');
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

  .card {
    border: none;
  }
</style>
