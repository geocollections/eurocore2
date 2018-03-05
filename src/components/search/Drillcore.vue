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
          <input type="text" v-model="searchParameters.drillcoreName.name" autocomplete="off" class="form-control" placeholder="search..." @keyup="getAutocompleteResults(searchParameters.drillcoreName)"/>
          <!--<input [(ngModel)]="searchDrillcoreName" id="drillcoreName" class="form-control" (input)="searchDrillcoreByName()" (keypress)="enterKeyPress($event)"-->
                 <!--placeholder="Drillcore name" [typeahead]="drillcoreAutocompleteValues" [typeaheadWaitMs]="200" typeaheadOptionField="name"-->
                 <!--autocomplete="off">-->
          <ul v-if="response.count > 0">
            <li v-for="entity in response.results">
              {{entity.name}}
            </li>
          </ul>
        </div>

        <div class="form-group">
          <select-default label="Deposit name" v-model="searchParameters.depositName.lookUpType"></select-default>
          <!--<input [(ngModel)]="searchDepositName" id="depositName" class="form-control" (input)="searchDepositByName(searchDepositName)"-->
                 <!--(keypress)="enterKeyPress($event)" placeholder="Deposit name" [typeahead]="depositAutocompleteValues" [typeaheadWaitMs]="200"-->
                 <!--autocomplete="off" />-->
          <input class="form-control" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Ore type" v-model="searchParameters.oreType.lookUpType"></select-default>
          <!--<input [(ngModel)]="searchOreType" id="OreType" class="form-control" (input)="searchOreTypeByName(searchOreType)" (keypress)="enterKeyPress($event)"-->
                 <!--placeholder="Ore type" [typeahead]="oreTypeAutocompleteValues" [typeaheadWaitMs]="200" typeaheadOptionField="name"-->
                 <!--autocomplete="off" />-->
          <input class="form-control" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Main commodity" v-model="searchParameters.commodity.lookUpType"></select-default>
          <!--<input [(ngModel)]="searchCommodity" id="commodity" class="form-control" (keypress)="enterKeyPress($event)" placeholder="Main commodity"-->
                 <!--autocomplete="off" />-->
          <input id="commodity" class="form-control" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <select-default label="Core depositor" v-model="searchParameters.coreDepositor.lookUpType"></select-default>
          <!--<input [(ngModel)]="searchInstitution" id="coreDepositorName" class="form-control" (input)="searchCoreDepositorByName(searchInstitution)"-->
                 <!--(keypress)="enterKeyPress($event)" placeholder="Core depositor" [typeahead]="coreDepositorAutocompleteValues" [typeaheadWaitMs]="200"-->
          <input class="form-control" placeholder="search..." autocomplete="off" />
        </div>

        <div class="form-group">
          <!--<input [(ngModel)]="searchDrillcoreId" type="hidden" id="drillcoreId" class="form-control" placeholder="ID" />-->
          <input type="hidden" id="drillcoreId" class="form-control" placeholder="ID" />
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

  const API_URL = 'http://api.eurocore.rocks/';

  export default {
    components: {
      SelectDefault
    },
    name: "drillcore",
    data() {
      return {
        searchParameters: {
          drillcoreName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'name' },
          depositName: { lookUpType: 'icontains', name: '', table:'drillcore', fields: 'deposit__name,deposit__alternative_names' },
          oreType: { lookUpType: 'icontains', name: '', table:'ore_genetic_type', fields: 'name' },
          commodity: { lookUpType: 'icontains', name: '', table: 'drillcore', fields: 'core_depositor__name,core_depositor__acronym' },
          coreDepositor: { lookUpType: 'icontains', name: '' }
        },
        response: {
          count: 0,
          results: []
        }
      }
    },
    methods: {
      getResults() {
        return this.response.results
      },

      getAutocompleteResults(params) {
        console.log(params);
        this.$http.jsonp(API_URL + 'drillcore/?' + params.fields + '__' + params.lookUpType + '=' + params.name, {params: {format: 'jsonp', fields: params.fields}}).then(response => {
            console.log(response);
            this.response.count = response.body.count;
            this.response.results = response.body.results;
            console.log(this.response);
        }, response => {
            console.log('error');
            console.log(response)
        })
      }
    }
    // created: function(field) {
    // this.$http.jsonp('http://api.eurocore.rocks/drillcore/', {params: {format: 'jsonp', fields: 'name', name__icontains: field}}).then(response => {
    //   console.log(response.body.results);
    //   this.results = response.body.results;
    //   console.log(this.results);
    //   }, response => {
    //   console.log('error');
    //   console.log(response)
    //   })
    // }
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
