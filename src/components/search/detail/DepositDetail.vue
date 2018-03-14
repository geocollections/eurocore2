<template>
  <div v-if="deposit != null">

    <div class="row">
      <div class="col">
        <h2>{{deposit[0].name}} deposit</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <table class="table table-bordered table-hover th-styles">
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
        }
      }
    },
    watch: {
      'id': function () {
      //  TODO: reset + requests
        this.getDepositById(this.id);
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
