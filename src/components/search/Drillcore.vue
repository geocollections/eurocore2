<template>
  <div id="search-component">

    <div class="row">
      <div class="col">
        <h2>Drillcore search</h2>
      </div>
    </div>


    <div class="row align-items-center">
      <div class="col">

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.drillcoreName.name"
            :options="drillcoreNames"
            placeholder="Drillcore Name"
            label="name"
            track-by="name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.depositName.name"
            :options="depositNames"
            placeholder="Deposit Name"
            label="deposit__name"
            track-by="deposit__name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.oreType.name"
            :options="oreTypes"
            placeholder="Ore type"
            label="deposit__genetic_type__name"
            track-by="deposit__genetic_type__name" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.commodity.name"
            :options="commodities"
            placeholder="Main commodity"
            label="deposit__main_commodity"
            track-by="deposit__main_commodity" />
        </div>

        <div class="form-group">
          <vue-multiselect
            v-model="searchParameters.coreDepositor.name"
            :options="coreDepositors"
            placeholder="Core depositor"
            track-by="core_depositor__acronym"
            :custom-label="customLabelForCoreDepositors" />
        </div>

        <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" @click="searchEntities(searchParameters)">SEARCH DRILLCORES</button>
          </span>

          <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
          </span>
        </div>
      </div>


      <div class="col">
        <drillcore-map></drillcore-map>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col">
        <p v-if="response.results != ''">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-dropdown text="EXPORT" variant="primary">
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              name="drillcore.xls">Export to XLS</export-button>
          </b-dropdown-item>
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              type="csv"
              name="drillcore.csv">Export to CSV</export-button>
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="col">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div v-if="response.count > 0" class="row">
      <div class="col">
          <div class="table-responsive">
            <table class="table table-hover table-bordered ">
              <thead class="thead-light">
                <tr class="th-sort">
                  <th><span v-b-tooltip.hover.bottom title="Order by ID" @click="changeOrder('id')">ID</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Name" @click="changeOrder('name')">Name</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Deposit" @click="changeOrder('deposit__name')">Deposit</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Commodity" @click="changeOrder('deposit__main_commodity')">Commodity</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Latitude" @click="changeOrder('latitude')">Latitude</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Longitude" @click="changeOrder('longitude')">Longitude</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Length" @click="changeOrder('hole_length')">Length</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Dip" @click="changeOrder('hole_dip')">Dip</span></th>
                  <th><span v-b-tooltip.hover.bottom title="Order by Azimuth" @click="changeOrder('hole_azimuth')">Azimuth</span></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drillcore in response.results">
                  <td>{{drillcore.id}}</td>
                  <td>
                    <router-link :to="{ path: '/drillcore/' + drillcore.id }">{{drillcore.name}}</router-link>
                  </td>
                  <td>
                    <router-link :to="{ path: '/deposit/' + drillcore.id }">{{drillcore.deposit__name}}</router-link>
                  </td>
                  <td>{{drillcore.deposit__main_commodity}}</td>
                  <td>{{drillcore.latitude}}</td>
                  <td>{{drillcore.longitude}}</td>
                  <td>{{drillcore.hole_length}}</td>
                  <td>{{drillcore.hole_dip}}</td>
                  <td>{{drillcore.hole_azimuth}}</td>
                  <td>
                    <router-link :to="{ path: '/drillcore_data/' + drillcore.id }">Show data</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>

    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3 mb-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import VueMultiselect from "vue-multiselect/src/Multiselect";
  import ExportButton from 'vue-json-excel';
  import DrillcoreMap from "../main/partial/DrillcoreMap";

  export default {
    components: {
      DrillcoreMap,
      VueMultiselect,
      ExportButton
    },
    name: "drillcore",
    data() {
      return {
        API_URL: 'http://api.eurocore.rocks/',
        searchParameters: {
          drillcoreName: { name: '', field: 'name' },
          depositName: { name: '', field: 'deposit__name' },
          oreType: { name: '', field: 'deposit__genetic_type__name', },
          commodity: { name: '', field: 'deposit__main_commodity' },
          coreDepositor: { name: '', field: 'core_depositor__acronym' },
          page: 1,
          paginateBy: 25,
          orderBy: 'id'
        },
        response: {
          count: 0,
          results: []
        },
        drillcoreNames: [],
        depositNames: [],
        oreTypes: [],
        commodities: [],
        coreDepositors: [],
        paginationOptions: [
          { value: 10, text: 'Show 10 results per page' },
          { value: 25, text: 'Show 25 results per page' },
          { value: 50, text: 'Show 50 results per page' },
          { value: 100, text: 'Show 100 results per page' },
          { value: 250, text: 'Show 250 results per page' },
          { value: 500, text: 'Show 500 results per page' },
          { value: 1000, text: 'Show 1000 results per page' }
        ],
        exportFields: {
          'ID': 'id',
          'Name': 'name',
          'Deposit': 'deposit__name',
          'Commodity': 'deposit__main_commodity',
          'Latitude': 'latitude',
          'Longitude': 'longitude',
          'length': 'hole_length',
          'Dip': 'hole_dip',
          'Azimuth': 'hole_azimuth',
        },
      }
    },
    watch: {
      // TODO: Got to test it performance wise, maybe dependent search isnt necessary here
      'searchParameters': {
        handler: function () {
          this.searchEntitiesAndPopulate(this.searchParameters)
        },
        deep: true
      }
    },
    methods: {

      searchEntitiesAndPopulate(params) {
        this.searchEntities(params);
        this.populateDrillcoreNames(params);
        this.populateDepositNames(params);
        this.populateOreTypes(params);
        this.populateCommodities(params);
        this.populateCoreDepositors(params);
      },

      searchEntities(searchParameters) {
        console.log(searchParameters);
        let url = this.buildSearchUrl(searchParameters);
        console.log(url);

        this.$http.jsonp(url, {params: {format: 'jsonp', page: searchParameters.page, paginate_by: searchParameters.paginateBy, order_by: searchParameters.orderBy}}).then(response => {
          console.log(response);
          // this.devFuncPrintResults(response.body.results);

          this.response.count = response.body.count;
          this.response.results = response.body.results;

        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
        })

      },

      buildSearchUrl(params) {
        let url = this.API_URL + 'drillcore/?';

        Object.keys(params).forEach(function (key) {
          // console.log(key + ' ' + params[key]);

          if (typeof(params[key]) === 'object') {

            if (params[key].name !== '' && params[key].name != null) {
              // console.log(params[key].field + '=' + params[key].name[params[key].field]); deposit__name=Kevitsa
              url += params[key].field + '=' + params[key].name[params[key].field] + '&'
            }
          }

        });

        if (url.slice(-1) === '?' || url.slice(-1) === '&') {
          url = url.slice(0, -1);
        }
        return url;
      },


      /***************************************
       ***** MULTISELECT POPULATE START ******
       ***************************************/
      populateDrillcoreNames(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {distinct: 'true', format: 'jsonp', fields: 'name'}}).then(response => {
          console.log(response);

          this.drillcoreNames = response.body.results;
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateDepositNames(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__name__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__name'}}).then(response => {
          console.log(response);

          this.depositNames = response.body.results;
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateOreTypes(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__genetic_type__name__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__genetic_type__name'}}).then(response => {
          console.log(response);

          this.oreTypes = response.body.results;
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateCommodities(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {deposit__main_commodity__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'deposit__main_commodity'}}).then(response => {
          console.log(response);

          this.commodities = response.body.results;
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },

      populateCoreDepositors(params) {
        let url = this.buildSearchUrl(params);
        console.log(url);
        this.$http.jsonp(url, {params: {distinct: 'true', format: 'jsonp', fields: 'core_depositor__name,core_depositor__acronym'}}).then(response => {
          console.log(response);

          this.coreDepositors = response.body.results;
        }, errResponse => {
          console.log('*** ERROR ***');
          console.log(errResponse);
        })
      },
      /***************************************
       *****  MULTISELECT POPULATE END  ******
       ***************************************/


      customLabelForCoreDepositors(option) {
        return `${option.core_depositor__acronym} - ${option.core_depositor__name}`
      },

      // TODO: Make order changing responsive + order should be object like sortField: { order: 'fields', direction: 'ASC' }
      changeOrder(orderValue) {
        if (this.searchParameters.orderBy === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.searchParameters.orderBy = orderValue;
      },

      resetSearchParameters() {
        console.log("BEFORE");
        console.log(this.searchParameters);
        this.searchParameters =
          {
            drillcoreName: { name: '', field: 'name' },
            depositName: { name: '', field: 'deposit__name' },
            oreType: { name: '', field: 'deposit__genetic_type__name', },
            commodity: { name: '', field: 'deposit__main_commodity' },
            coreDepositor: { name: '', field: 'core_depositor__acronym' },
            page: 1,
            paginateBy: 25,
            orderBy: 'id'
          };
        this.$session.remove('drillcore');
        console.log("AFTER");
        console.log(this.searchParameters);
      },

      devFuncPrintResults(results) {
        for (const entity in results) {
          console.log(results[entity]);
        }
      }
    },
    created: function () {
      // TODO: Params should come from URL if exists
      // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
      if (this.$session.exists() && this.$session.get('drillcore') != null) {
        this.searchParameters = this.$session.get('drillcore');
      } else {
        this.searchEntitiesAndPopulate(this.searchParameters);
      }
    },
    beforeDestroy: function () {
      this.$session.set('drillcore', this.searchParameters);
    }
  }
</script>

<style scoped>
  /*.form-group {*/
    /*margin-bottom: 0;*/
  /*}*/

  .searchButtons {
    margin: 0.75rem 0;
  }

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
    /*opacity: 0.6;*/
  }

  .sortingHead {
    color: #004393!important;
  }

  .autocomplete-results {
    margin: 0;
    padding: 0;
    list-style-type: none;
    z-index: 1000;
    position: absolute;
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ccc;
    border-top: 0;
    color: #000;
  }

  .autocomplete-results-item {
    padding: 0.25rem 1.5rem;
    cursor: pointer;
  }

  .autocomplete-results-item:hover {
    background-color: #004393;
    color: #ffffff;
    font-weight: 600;
  }
</style>
