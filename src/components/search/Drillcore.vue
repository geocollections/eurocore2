<template>
  <div id="search-component">

    <div class="row">
      <div class="col">
        <h2>Drillcore search</h2>
      </div>
    </div>


    <div class="row align-items-center">
      <div class="col">


        <!--TODO: Find better autocomplete or make yourself-->

        <div class="form-group">
          <!--VUE-INSTANT-->
          <select-default label="Drillcore name" v-model="searchParameters.drillcoreName.lookUpType"></select-default>
          <vue-instant :suggestion-attribute="'name'" :suggestions="autocompleteResults" :autofocus="false"
                       v-model="searchParameters.drillcoreName.name" placeholder="search..." type="google">
          </vue-instant>
        </div>

        <!--<div class="form-group">-->
          <!--<select-default label="Drillcore name" v-model="searchParameters.drillcoreName.lookUpType"></select-default>-->
          <!--<input type="text" v-model="searchParameters.drillcoreName.name" class="form-control" placeholder="search..." autocomplete="off"/>-->

          <!--<ul class="autocomplete-results" v-show="response.count > 0 && searchParameters.drillcoreName.name.length > 0">-->
            <!--<li class="autocomplete-results-item" v-for="entity in response.results" @click="selectEntity(searchParameters.drillcoreName.name, entity.name)">-->
              <!--{{entity.name}}-->
            <!--</li>-->
          <!--</ul>-->

        <!--</div>-->

        <div class="form-group">
          <select-default label="Deposit name" v-model="searchParameters.depositName.lookUpType"></select-default>
          <vue-instant :suggestion-attribute="'deposit__name'" :suggestions="autocompleteResults" :autofocus="false"
                       v-model="searchParameters.depositName.name" placeholder="search..." type="google">
          </vue-instant>
          <!--<input type="text" v-model="searchParameters.depositName.name" class="form-control" placeholder="search..." autocomplete="off" />-->
        </div>

        <div class="form-group">
          <select-default label="Ore type" v-model="searchParameters.oreType.lookUpType"></select-default>
          <vue-instant :suggestion-attribute="'name'" :suggestions="autocompleteResults" :autofocus="false"
                       v-model="searchParameters.oreType.name" placeholder="search..." type="google">
          </vue-instant>
          <!--<input type="text" v-model="searchParameters.oreType.name" class="form-control" placeholder="search..." autocomplete="off" />-->
        </div>

        <div class="form-group">
          <select-default label="Main commodity" v-model="searchParameters.commodity.lookUpType"></select-default>
          <vue-instant :suggestion-attribute="'deposit__main_commodity'" :suggestions="autocompleteResults" :autofocus="false"
                       v-model="searchParameters.commodity.name" placeholder="search..." type="google">
          </vue-instant>
          <!--<input type="text" v-model="searchParameters.commodity.name" class="form-control" placeholder="search..." autocomplete="off" />-->
        </div>

        <div class="form-group">
          <select-default label="Core depositor" v-model="searchParameters.coreDepositor.lookUpType"></select-default>
          <vue-instant :suggestion-attribute="'core_depositor__name'" :suggestions="autocompleteResults" :autofocus="false"
                       v-model="searchParameters.coreDepositor.name" placeholder="search..." type="google">
          </vue-instant>
          <!--<input type="text" v-model="searchParameters.coreDepositor.name" class="form-control" placeholder="search..." autocomplete="off" />-->
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
        <div id="map" class="map"></div>
      </div>

    </div>


    <div class="row align-items-center pagination-row">
      <div class="col ">
        <!--<p *ngIf="sites">Found {{siteCount}} result(s). </p>-->
        <!--<p *ngIf="!sites">No results found. Please try again. </p>-->
        <p v-if="response.results != ''">Found {{response.count}} result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>

      <div class="col">
        <nav aria-label="Page navigation example" class="float-right">
          <!--<ul class="pagination " *ngIf="siteCount>10">-->
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="javascript:void(0);">Previous</a>
            </li>

            <!--<li *ngFor="let page of pageCount; let index = index" class="page-item" [ngClass]="{'active': pageNumber== index + 1 }">-->
            <li class="page-item">
              <a class="page-link" href="javascript:void(0);"> page nr </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="javascript:void(0);">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>


    <div v-if="response.count > 0" class="row">
      <div class="col">
          <div class="table-responsive">
            <table class="table table-hover table-bordered ">
              <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Deposit</th>
                  <th>Commodity</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <!--<th>Elevation</th>-->
                  <th>Length</th>
                  <th>Dip</th>
                  <th>Azimuth</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drillcore in response.results">
                  <td>{{drillcore.id}}</td>
                  <td>
                    <router-link :to="{ path: 'drillcore/' + drillcore.id }">{{drillcore.name}}</router-link>
                  </td>
                  <td>
                    <router-link :to="{ path: 'deposit/' + drillcore.id }">{{drillcore.deposit__name}}</router-link>
                  </td>
                  <td>{{drillcore.deposit__main_commodity}}</td>
                  <td>{{drillcore.latitude}}</td>
                  <td>{{drillcore.longitude}}</td>
                  <!--<td></td>-->
                  <td>{{drillcore.hole_length}}</td>
                  <td>{{drillcore.hole_dip}}</td>
                  <td>{{drillcore.hole_azimuth}}</td>
                  <td>
                    <router-link :to="{ path: 'drillcore_data/' + drillcore.id }">Show data</router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>

  </div>
</template>

<script>
  import SelectDefault from '../main/partial/SelectDefault'

  export default {
    components: {
      SelectDefault
    },
    name: "drillcore",
    data() {
      return {
        API_URL: 'http://api.eurocore.rocks/',
        searchParameters: {
          drillcoreName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'name' },
          depositName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'deposit__name,deposit__alternative_names' },
          oreType: { lookUpType: 'icontains', name: '', table:'ore_genetic_type', fields: 'name' },
          commodity: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'deposit__main_commodity' },
          coreDepositor: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'core_depositor__name,core_depositor__acronym' },
          page: 1,
          paginateBy: 25,
          orderBy: 'id'
        },
        response: {
          count: 0,
          results: []
        },
        autocompleteResults: [],
      }
    },
    watch: {
      'searchParameters.drillcoreName.name': function (newValue, oldValue) {
        this.getAutocompleteResults(this.searchParameters.drillcoreName);
      },
      'searchParameters.depositName.name': function () {
        this.getAutocompleteResults(this.searchParameters.depositName);
      },
      'searchParameters.oreType.name': function () {
        this.getAutocompleteResults(this.searchParameters.oreType);
      },
      'searchParameters.commodity.name': function () {
        this.getAutocompleteResults(this.searchParameters.commodity);
      },
      'searchParameters.coreDepositor.name': function () {
        this.getAutocompleteResults(this.searchParameters.coreDepositor);
      }
    //  TODO: add watcher for page, paginateBy and orderBy and then call searchEntities method
    },
    methods: {
      // _.debounce is a function provided by lodash to limit how
      // often a particularly expensive operation can be run.
      // In this case, we want to limit how often we access
      // api.eurocore.rocks, waiting until the user has completely
      // finished typing before making the ajax request. To learn
      // more about the _.debounce function (and its cousin
      // _.throttle), visit: https://lodash.com/docs#debounce
      getAutocompleteResults: _.debounce(
        function(params) {
        console.log(params);

        let url = this.buildAutocompleteUrl(params);
        console.log(url);

        this.$http.jsonp(url, {params: {format: 'jsonp', fields: params.fields, distinct: true}}).then(response => {
          console.log(response);
          this.devFuncPrintResults(response.body.results);
          // console.log(response.body.results);

          if (response.body.results != null) {
            this.autocompleteResults = response.body.results;
          }
        }, response => {
          console.log('ERROR: ');
          console.log(response);
        })
      },
        // This is the number of milliseconds we wait for the
        // user to stop typing.
        0
      ),

      buildAutocompleteUrl(params) {
        if (params.fields.includes(',')) {
          return this.API_URL + params.table + '/?multi_search=value:' + params.name.trim() + ';fields:' + params.fields + ';lookuptype:' + params.lookUpType;
        } else {
          return this.API_URL + params.table + '/?' + params.fields + '__' + params.lookUpType + '=' + params.name.trim();
        }
      },

      buildSearchUrl(params) {
        let url = this.API_URL + 'drillcore/';
        return url;
      },

      searchEntities(searchParameters) {
        console.log(searchParameters);
        let url = this.buildSearchUrl(searchParameters);
        console.log(url);

        this.$http.jsonp(url, {params: {format: 'jsonp', page: searchParameters.page, paginate_by: searchParameters.paginateBy, order_by: searchParameters.orderBy}}).then(response => {
          console.log(response);
          this.devFuncPrintResults(response.body.results);

          if (response.body.results != null) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }

        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
        })

      },

      resetSearchParameters() {
        console.log(this.searchParameters);
        this.searchParameters =
          {
            drillcoreName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'name' },
            depositName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'deposit__name,deposit__alternative_names' },
            oreType: { lookUpType: 'icontains', name: '', table:'ore_genetic_type', fields: 'name' },
            commodity: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'deposit__main_commodity' },
            coreDepositor: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'core_depositor__name,core_depositor__acronym' }
          };
        console.log(this.searchParameters);
      },

      devFuncPrintResults(results) {
        for (const entity in results) {
          console.log(results[entity]);
        }
      }
    }
  }
</script>

<style scoped>
  h2 {
    color: #6bb745;
    font-weight: 600;
  }

  .form-group {
    margin-bottom: 0;
  }

  .searchButtons {
    margin: 0.75rem 0;
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
