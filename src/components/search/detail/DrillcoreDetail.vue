<template>
  <div v-if="drillcore != null">

    <div class="row">
      <div class="col">
        <h2>{{drillcore[0].name}}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <table class="table table-bordered table-hover th-styles">
          <tr v-if="drillcore[0].id">
            <td>ID</td>
            <td>{{drillcore[0].id}}</td>
          </tr>

          <tr v-if="drillcore[0].deposit__name">
            <td>Deposit</td>
            <td>
              <router-link :to="{ path: '/deposit/' + drillcore[0].deposit__id }">{{drillcore[0].deposit__name}}</router-link>
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
            <td>Deposited by </td>
            <td>{{drillcore[0].core_depositor__name}}</td>
          </tr>
        </table>
      </div>

      <div class="col">
        <!--TODO: MAP goes here-->
      </div>
    </div>


    <div class="row">
      <div class="col" id="tab-styles">
        <b-tabs>
          <b-tab :title="tab.name + ' (' + tab.count + ')'" v-for="tab in response">
            <br>I'm the first fading tab
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
    export default {
      props: ['id'],
      data() {
        return {
          API_URL: 'http://api.eurocore.rocks/drillcore/',
          drillcore: null,
          response: [
            { name: 'Core boxes', count: 0, results: [] },
            { name: 'Lithology', count: 0, results: [] },
            { name: 'Dip/Azimuth', count: 0, results: [] },
            { name: 'RQD', count: 0, results: [] },
            { name: 'Structures', count: 0, results: [] },
            { name: 'Stratigraphy', count: 0, results: [] },
            { name: 'Samples', count: 0, results: [] },
            { name: 'Analyses', count: 0, results: [] },
            { name: 'CT scans', count: 0, results: [] },
            { name: 'Linked files', count: 0, results: [] },
            { name: 'References', count: 0, results: [] },
          ]
        }
      },
      name: "drillcore-detail",
      watch: {
        'id': function () {
          this.getDrillcoreById(this.id);
        }
      },
      methods: {
        getDrillcoreById(id) {
          this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
            console.log(response.body.results);
            if (response.status === 200) {
              this.drillcore = response.body.results;
            }
          }, errResponse => {
            console.log('ERROR: ');
            console.log(errResponse);
            console.log(errResponse.status);
          })
        }
      },

      getLithologyByDrillcoreId(drillcoreId) {
        this.$http.jsonp('http://api.eurocore.rocks/lithology/', {params: {drillcore__id__exact: drillcoreId, format: 'jsonp'}}).then(response => {
          console.log(response.body.results);
          if (response.status === 200) {
            this.drillcore = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      created: function () {
        this.getDrillcoreById(this.id)
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

  #tab-styles > div {
    background-color: #fff!important;
  }

  .card {
    border: none;
  }
</style>
