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
          <select-default label="Drillcore name" v-model="searchParameters.drillcoreName.lookUpType"></select-default>
          <input type="text" v-model="searchParameters.drillcoreName.name" class="form-control" placeholder="search..." autocomplete="off"/>

          <ul v-if="response.count > 0">
            <li v-for="entity in response.results">
              {{entity.name}}
            </li>
          </ul>

        </div>

        <div class="form-group">
          <select-default label="Deposit name" v-model="searchParameters.depositName.lookUpType"></select-default>
          <input type="text" v-model="searchParameters.depositName.name" class="form-control" @keyup="getAutocompleteResults(searchParameters.depositName)" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Ore type" v-model="searchParameters.oreType.lookUpType"></select-default>
          <input type="text" v-model="searchParameters.oreType.name" class="form-control" @keyup="getAutocompleteResults(searchParameters.oreType)" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Main commodity" v-model="searchParameters.commodity.lookUpType"></select-default>
          <input type="text" v-model="searchParameters.commodity.name" class="form-control" @keyup="getAutocompleteResults(searchParameters.commodity)" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Core depositor" v-model="searchParameters.coreDepositor.lookUpType"></select-default>
          <input type="text" v-model="searchParameters.coreDepositor.name" class="form-control" @keyup="getAutocompleteResults(searchParameters.coreDepositor)" placeholder="search..." autocomplete="off" />
        </div>

        <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" id="searchButton">SEARCH DRILLCORES</button>
          </span>

          <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" id="resetButton">RESET FORM</button>
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
        <p>Found siteCount result(s). </p>
        <p>No results found. Please try again. </p>
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


    <!--<div *ngIf="sites" class="row">-->
    <div class="row">
      <div class="col">
        <div class="table-responsive">
          <table class="table table-hover table-bordered ">
            <thead class="thead-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Deposit</th>
              <th>Commodity</th>
              <!-- <th>Year</th>-->
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Elevation</th>
              <th>Length</th>
              <th>Dip</th>
              <th>Azimuth</th>
              <th></th>
            </tr>
            </thead>
            <!--<tr *ngFor="let site of sites">-->
            <tr>
              <td></td>
              <td>
                <router-link to="/drillcore/id">SITE_NAME</router-link>
                <!--<a routerLink="/drillcore/{{site.id}}">{{site.name}}</a>-->
              </td>
              <td>
                <router-link to="/deposit/id">DEPOSIT_NAME</router-link>
                <!--<a routerLink="/deposit/{{site.deposit__id}}">{{site.deposit__name}}</a>-->
              </td>
              <td></td>
              <!-- <td>{{site.drilling_year}}</td>-->
              <td></td>
              <td></td>
              <td> </td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <router-link to="/drillcore_data/id">Show data</router-link>
                <!--<a routerLink="/drillcore_data/{{site.id}}">Show data</a>-->
              </td>
            </tr>
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
          coreDepositor: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'core_depositor__name,core_depositor__acronym' }
        },
        response: {
          count: 0,
          results: []
        }
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

        let url = this.buildUrl(params);
        console.log(url);

        this.$http.jsonp(url, {params: {format: 'jsonp', fields: params.fields}}).then(response => {
            console.log(response);
            this.response.count = response.body.count;
            this.response.results = response.body.results;
            console.log(this.response);
        }, response => {
            console.log('error');
            console.log(response)
        })
      },
        // This is the number of milliseconds we wait for the
        // user to stop typing.
        300
      ),

      buildUrl(params) {
        if (params.fields.includes(',')) {
          return this.API_URL + params.table + '/?multi_search=value:' + params.name.trim() + ';fields:' + params.fields + ';lookuptype:' + params.lookUpType;
        } else {
          return this.API_URL + params.table + '/?' + params.fields + '__' + params.lookUpType + '=' + params.name.trim();
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


  #searchButton {
    /*margin: 0.75rem 0;*/
  }

  #resetButton {

  }
</style>
