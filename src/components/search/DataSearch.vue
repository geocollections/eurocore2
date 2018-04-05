<template>
  <div>

    <spinner v-show="isSearching" class="loading-overlay" size="huge" message="Searching..."></spinner>

    <div class="row">
      <div class="col">
        <h2>Data Search</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Drillcore name(s)</label>
          <vue-multiselect
            v-model="searchParameters.watched.drillcoreNames"
            :options="drillcoreNames"
            :multiple="true"
            track-by="name"
            :close-on-select="false"
            label="name"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Analytical method(s)</label>
          <vue-multiselect
            v-model="searchParameters.watched.analyticalMethods"
            :options="analyticalMethods"
            :multiple="true"
            track-by="analysis__analysis_method__method"
            :close-on-select="false"
            label="analysis__analysis_method__method"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Show parameter(s)</label>
          <vue-multiselect
            v-model="searchParameters.currentlyShownParameters"
            :options="showParameters"
            :multiple="true"
            track-by="formattedValue"
            :close-on-select="false"
            :custom-label="customLabelForParameters"></vue-multiselect>
        </div>

        <label>Parameter filter</label>
        <div class="form-group" v-for="(item, key) in numOfComparableParameters">
          <div class="input-group">
            <b-form-select v-model="searchParameters.watched.comparableParameter[key]" >
              <option v-for="parameter in showParameters" :value="parameter.formattedValue">{{parameter.analysis__analysisresult__parameter__parameter}} {{parameter.analysis__analysisresult__unit__unit}}</option>
            </b-form-select>
            <b-form-select v-model="searchParameters.watched.comparableParameterOperator[key]" :options="parameterOptions"></b-form-select>
            <b-form-input v-model="searchParameters.watched.comparableParameterValue[key]" type="number"></b-form-input>
            <button class="btn btn-danger ml-2" :disabled="numOfComparableParameters < 2" @click="deleteParameterField(key)">X</button>
          </div>
        </div>
        <button class="btn btn-primary button-right" title="Adds parameter field" @click="addParameterField()" >Add Parameter</button>
      </div>
    </div>


    <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" @click="searchEntities(searchParameters.watched)">SEARCH</button>
          </span>

      <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
          </span>
    </div>


    <div class="row">
      <div class="col">
        <p v-if="response.count > 0 || response.count !== undefined">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3">
        <b-form-select v-model="searchParameters.watched.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
      </div>

      <div class="col mb-3">
        <export-buttons filename="dataSearch"></export-buttons>
      </div>

      <div class="col">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div class="row" v-show="response.count > 0">
      <div class="col">
        <div class="table-responsive">
          <table id="table-search" class="table table-hover table-bordered ">
            <thead class="thead-light">
              <tr class="th-sort">
                <th><span @click="changeOrder('drillcore_name')"><font-awesome-icon :icon="icon"/> Drillcore</span></th>
                <th><span @click="changeOrder('depth')" style="display: inline-block"><font-awesome-icon :icon="icon"/> Depth from (m)</span></th>
                <th><span @click="changeOrder('end_depth')"><font-awesome-icon :icon="icon"/> Depth to (m)</span></th>
                <th><span @click="changeOrder('sample_number')"><font-awesome-icon :icon="icon"/> Sample</span></th>
                <th><span @click="changeOrder('analysis_id')"><font-awesome-icon :icon="icon"/> Analysis ID</span></th>
                <th><span @click="changeOrder('analysis_method')"><font-awesome-icon :icon="icon"/> Method</span></th>
                <th v-for="parameter in searchParameters.currentlyShownParameters"><span @click="changeOrder(parameter.formattedValue)"><font-awesome-icon :icon="icon"/> {{parameter.analysis__analysisresult__parameter__parameter + ' ' + parameter.analysis__analysisresult__unit__unit}}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="response.count === 0 || response.count === undefined"><br></tr> <!-- Adds empty line so title can fit -->
              <tr v-for="entity in response.results">
                <td>
                  <router-link :to="{ path: '/drillcore/' + entity.drillcore_id }">{{entity.drillcore_name}}</router-link>
                </td>
                <td>{{entity.depth}}</td>
                <td>{{entity.end_depth}}</td>
                <td>
                  <a href="javascript:void(0)" @click="openInNewWindow({object: 'sample', id: entity.sample_id})">{{entity.sample_number}}</a>
                  <!--<router-link :to="{ path: '/sample/' + entity.sample_id }">{{entity.sample_number}}</router-link>-->
                </td>
                <td>
                  <a href="javascript:void(0)" @click="openInNewWindow({object: 'analysis', id: entity.analysis_id, width: 600})">{{entity.analysis_id}}</a>
                  <!--<router-link :to="{ path: '/analysis/' + entity.analysis_id }">{{entity.analysis_id}}</router-link>-->
                </td>
                <td>{{entity.analysis_method}}</td>
                <td v-for="parameterResult in searchParameters.currentlyShownParameters">{{entity[parameterResult.formattedValue]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3 mb-3">
        <b-form-select v-model="searchParameters.watched.paginateBy" :options="paginationOptions"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
        </b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
    import VueMultiselect from "vue-multiselect/src/Multiselect"
    import ExportButtons from './detail/partial/ExportButtons'
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import faSort from '@fortawesome/fontawesome-free-solid/faSort'
    import Spinner from 'vue-simple-spinner'

    export default {
      components: {
        VueMultiselect,
        ExportButtons,
        FontAwesomeIcon,
        Spinner
      },
      name: "data-search",
      data() {
        return {
          API_URL: 'https://api.eurocore.rocks/',
          //TODO: FOR DEMO START
          isAuthenticated: false,
          //TODO: FOR DEMO END
          isSearching: false,
          searchParameters: {
            watched: {
              drillcoreNames: [],
              analyticalMethods: [],
              comparableParameter: [''],
              comparableParameterOperator: ['gt'],
              comparableParameterValue: [''],
              page: 1,
              paginateBy: 100,
              orderBy: 'id',
            },
            // currentlyShownParameters: [
            //   { analysis__analysisresult__parameter__parameter: 'Au', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'au_ppm' },
            //   { analysis__analysisresult__parameter__parameter: 'Co', analysis__analysisresult__unit__unit: '%', formattedValue: 'co_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Co', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'co_ppm' },
            //   { analysis__analysisresult__parameter__parameter: 'Cu', analysis__analysisresult__unit__unit: '%', formattedValue: 'cu_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Cu', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'cu_ppm' },
            //   { analysis__analysisresult__parameter__parameter: 'Fe', analysis__analysisresult__unit__unit: '%', formattedValue: 'fe_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Ni', analysis__analysisresult__unit__unit: '%', formattedValue: 'ni_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Ni', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'ni_ppm' },
            //   { analysis__analysisresult__parameter__parameter: 'S', analysis__analysisresult__unit__unit: '%', formattedValue: 's_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Zn', analysis__analysisresult__unit__unit: '%', formattedValue: 'zn_pct' },
            //   { analysis__analysisresult__parameter__parameter: 'Zn', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'zn_ppm' },
            // ],
            currentlyShownParameters: [],
          },
          response: {
            count: 0,
            results: []
          },
          drillcoreNames: [],
          analyticalMethods: [],
          showParameters: [],
          parameterOptions: [
            { value: 'iexact', text: 'Equals' },
            { value: 'gt', text: 'Greater than' },
            { value: 'lt', text: 'Smaller than' }
          ],
          paginationOptions: [
            { value: 10, text: 'Show 10 results per page' },
            { value: 25, text: 'Show 25 results per page' },
            { value: 50, text: 'Show 50 results per page' },
            { value: 100, text: 'Show 100 results per page' },
            { value: 250, text: 'Show 250 results per page' },
            { value: 500, text: 'Show 500 results per page' },
            { value: 1000, text: 'Show 1000 results per page' }
          ],
          numOfComparableParameters: 1,
        }
      },
      metaInfo: {
        title: 'EUROCORE Data Portal: Data Search'
      },
      computed: {
        icon() {
          return faSort;
        }
      },
      watch: {
        'searchParameters.watched': {
          handler: function () {
            this.isSearching = true;
            this.searchEntities(this.searchParameters.watched);
          },
          deep: true
        },
        'searchParameters.watched.drillcoreNames': function(newVal, oldVal) {
          this.populateAnalyticalMethods(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
          this.populateShowParameters(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
        },
        'searchParameters.watched.analyticalMethods': function(newVal, oldVal) {
          this.populateDrillcoreNames(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
          this.populateShowParameters(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
        },
        'searchParameters.currentlyShownParameters': function (newVal, oldVal) {
          this.populateDrillcoreNames(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
          this.populateAnalyticalMethods(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
        },
      },
      created: function () {
        this.isSearching = true;
        //TODO: FOR DEMO START
        if (this.$session.exists() && this.$session.get('userData') != null) {
          this.isAuthenticated = true;
        } else {
          this.searchParameters.watched.drillcoreNames = [ {id: 17, name: 'Kylylahti KU-223'},{id: 18, name: 'Kylylahti KU-262'} ];
        }
        //TODO: FOR DEMO END


        this.populateAll(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)

        // TODO: Params should come from URL if exists
        // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
        if (this.$session.exists() && this.$session.get('dataSearch') != null) {
          if (this.isAuthenticated) { // TODO: DEMO ONLYlo
            this.searchParameters = this.$session.get('dataSearch');
          }
        } else {
          this.searchEntities(this.searchParameters.watched)
        }
      },
      updated: function () {
        $('#table-search').floatThead('reflow');
        this.addFloatingTableHeaders();
      },
      beforeDestroy: function () {
        if (this.isAuthenticated) { //TODO: DEMO ONLY
          this.$session.set('dataSearch', this.searchParameters);
        }
      },
      methods: {
        searchEntities(params) {
          //TODO: DEMO
          if (this.searchParameters.watched.drillcoreNames.length > 0) {
            console.log(params);
            let url = this.buildSearchUrl(params);

            this.$http.jsonp(url , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
              console.log(response);
              if (response.status === 200) {
                this.response.count = response.body.count;
                this.response.results = response.body.results;
                this.isSearching = false;
              }
            }, errResponse => {
              console.log('*** ERROR ***');
              console.log(errResponse);
              // this.$router.push('/404/')
            })
          } else if (this.searchParameters.watched.drillcoreNames.length === 0 ) {
            if (this.isAuthenticated) {
              console.log(params);
              let url = this.buildSearchUrl(params);

              this.$http.jsonp(url , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
                console.log(response);
                if (response.status === 200) {
                  this.response.count = response.body.count;
                  this.response.results = response.body.results;
                  this.isSearching = false;
                }
              }, errResponse => {
                console.log('*** ERROR ***');
                console.log(errResponse);
                // this.$router.push('/404/')
              })
            } else {
              this.response.count = 0;
              this.response.results = [];
              this.isSearching = false;
            }
          }
          //TODO: DEMO

          // console.log(params);
          // let url = this.buildSearchUrl(params);
          //
          // this.$http.jsonp(url , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
          //   console.log(response);
          //   if (response.status === 200) {
          //     this.response.count = response.body.count;
          //     this.response.results = response.body.results;
          //   }
          // }, errResponse => {
          //   console.log('*** ERROR ***');
          //   console.log(errResponse);
          //   // this.$router.push('/404/')
          // })
        },

        buildSearchUrl(params) {
          let url = this.API_URL + 'analysis_summary/?';
          Object.keys(params).forEach(function (key) {
            // console.log(key + ' ' + params[key]);
            // TODO: Should optimise this block | START
            if (key === 'drillcoreNames' && params[key].length > 0) {
              // console.log('DRILLCORE');
              if (params[key].length > 1) {
                url += 'drillcore_id__in='; // MULTI
              } else {
                url += 'drillcore_id='; // SINGLE
              }

              for (const drillcore in params[key]) {
                url += params[key][drillcore].id + ',';
              }

              url = url.slice(0, -1); // removes comma
              url += '&';
            }
            // TODO: Should optimise this block | END

            if (key === 'analyticalMethods' && params[key].length > 0) {
              // console.log('ANALYTICAL');
              if (params[key].length > 1) {
                url += 'analysis_method__in=';
              } else {
                url += 'analysis_method=';
              }

              for (const analysis in params[key]) {
                url += params[key][analysis].analysis__analysis_method__method + ',';
              }

              url = url.slice(0, -1);
              url += '&';
            }

            if (key === 'comparableParameter') {
              // console.log('COMPARABLE');
              // console.log(params[key]);
              for (const i in params[key]) {
                if (params['comparableParameter'][i].length > 0 && params['comparableParameterValue'][i].length > 0) {
                  url += params['comparableParameter'][i] + '__' + params['comparableParameterOperator'][i] + '=' + params['comparableParameterValue'][i] + '&'
                }
              }
            }
          });

          if (url.slice(-1) === '?' || url.slice(-1) === '&') {
            url = url.slice(0, -1);
          }
          // if (url.slice(-1) === '&') {
          //   url = url.slice(0, -1);
          // }

          // console.log(url)

          return url;
        },

        buildSearchUrlForPopulate(params, currentlyShownParams, drillcoreNames, analyticalMethods, parameters) {
          let url = this.API_URL + 'drillcore/?';
          Object.keys(params).forEach(function (key) {
            // console.log(key + ' ' + params[key]);
            if (key === 'drillcoreNames' && params[key].length > 0 && drillcoreNames === true) {
              if (params[key].length > 1) {
                url += 'id__in='; // MULTI
              } else {
                url += 'id='; // SINGLE
              }

              for (const drillcore in params[key]) {
                url += params[key][drillcore].id + ',';
              }

              url = url.slice(0, -1); // removes comma
              url += '&';
            }
            if (key === 'analyticalMethods' && params[key].length > 0 && analyticalMethods === true) {
              // console.log('ANALYTICAL');
              if (params[key].length > 1) {
                url += 'analysis__analysis_method__method__in=';
              } else {
                url += 'analysis__analysis_method__method=';
              }

              for (const analysis in params[key]) {
                url += params[key][analysis].analysis__analysis_method__method + ',';
              }

              url = url.slice(0, -1);
              url += '&';
            }
          });

          if (parameters === true) {
            if (currentlyShownParams.length > 1) {
              url += 'analysis__analysisresult__parameter__parameter__in='
            } else if (currentlyShownParams.length > 0) {
              url += 'analysis__analysisresult__parameter__parameter='
            }
            Object.keys(currentlyShownParams).forEach(function (key) {
              console.log(currentlyShownParams[key].analysis__analysisresult__parameter__parameter + ' ' + currentlyShownParams[key].analysis__analysisresult__unit__unit);
              url += currentlyShownParams[key].analysis__analysisresult__parameter__parameter + ','
            });

            url = url.slice(0, -1);
            url += '&';

            // if (currentlyShownParams.length > 1) {
            //   url += 'analysis__analysisresult__unit__unit__in='
            // } else if (currentlyShownParams.length > 0) {
            //   url += 'analysis__analysisresult__unit__unit='
            // }
            // Object.keys(currentlyShownParams).forEach(function (key) {
            //   console.log(currentlyShownParams[key].analysis__analysisresult__parameter__parameter + ' ' + currentlyShownParams[key].analysis__analysisresult__unit__unit);
            //   if (currentlyShownParams[key].analysis__analysisresult__unit__unit === '%' && !url.includes('%')) {
            //     url += currentlyShownParams[key].analysis__analysisresult__unit__unit + ','
            //   } else if (currentlyShownParams[key].analysis__analysisresult__unit__unit === 'ppm' && !url.includes('ppm')) {
            //     url += currentlyShownParams[key].analysis__analysisresult__unit__unit + ','
            //   }
            // });
          }

          url = url.slice(0, -1);
          url += '&';

          if (url.slice(-1) === '?' || url.slice(-1) === '&') {
            url = url.slice(0, -1);
          }

          return url

        },


        /***************************************
         ***** MULTISELECT POPULATE START ******
         ***************************************/
        populateDrillcoreNames(params, currentlyShownParams) {
          if (this.isAuthenticated) { // TODO: DEMO
            let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, false, true, true);
            console.log(url)

            // this.$http.jsonp(this.API_URL + 'drillcore' , {params: {format: 'jsonp', fields: 'id,name'}}).then(response => {
            this.$http.jsonp(url , {params: {format: 'jsonp', distinct: 'true', fields: 'id,name'}}).then(response => {
              console.log(response);
              if (response.status === 200) {
                if (response.body.count > 0) {
                  this.drillcoreNames = response.body.results;
                } else {
                  this.drillcoreNames = [];
                }
              }
            }, errResponse => {
              console.log('*** ERROR ***');
              console.log(errResponse);
            })
          } else {
            let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, false, true, true);
            console.log(url)
            this.$http.jsonp(this.API_URL + 'drillcore' , {params: {id__in: '17,18', format: 'jsonp', fields: 'id,name'}}).then(response => {
              console.log(response);
              if (response.status === 200) {
                if (response.body.count > 0) {
                  this.drillcoreNames = response.body.results;
                } else {
                  this.drillcoreNames = [];
                }
              }
            }, errResponse => {
              console.log('*** ERROR ***');
              console.log(errResponse);
            })
          }
        },

        populateAnalyticalMethods(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, true, false, true);
          console.log(url);

          this.$http.jsonp(url , {params: {distinct: 'true', format: 'jsonp', fields: 'analysis__analysis_method__method'}}).then(response => {
          // this.$http.jsonp(this.API_URL + 'analysis_summary' , {params: {analysis_method__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'analysis_method'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                const allMethods = response.body.results;
                this.analyticalMethods = [];
                for (const method in allMethods) {
                  if (allMethods[method].analysis__analysis_method__method !== null) {
                    this.analyticalMethods.push(allMethods[method]);
                  }
                }
                // this.analyticalMethods = response.body.results;
              } else {
                this.analyticalMethods = [];
              }
            }
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateShowParameters(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, true, true, false);
          console.log(url)
          this.$http.jsonp(url , {params: {format: 'jsonp', distinct: 'true', order_by: 'analysis__analysisresult__parameter__parameter', fields: 'analysis__analysisresult__parameter__parameter,analysis__analysisresult__unit__unit'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                const allParameters = response.body.results;
                this.showParameters = [];
                for (const param in allParameters) {
                  if (allParameters[param].analysis__analysisresult__parameter__parameter !== null && allParameters[param].analysis__analysisresult__unit__unit !== null) {
                    this.showParameters.push(allParameters[param]);
                  }
                }
                // this.showParameters = response.body.results;
                // console.log(this.showParameters)
                for (const i in this.showParameters) {
                  this.showParameters[i].formattedValue = this.getCorrectParameterFormat(this.showParameters[i]);
                }
              } else {
                this.showParameters = [];
              }
            }
            // console.log(this.showParameters)
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateAll(params, currentlyShownParams) {
          this.populateAnalyticalMethods(params, currentlyShownParams);
          this.populateShowParameters(params, currentlyShownParams);
          this.populateDrillcoreNames(params, currentlyShownParams);
        },
        /***************************************
         *****  MULTISELECT POPULATE END  ******
         ***************************************/


        getCorrectParameterFormat(param) {
          // console.log(param);
          if (param !== 'undefined') {
            let unformattedParam = param;
            let firstHalf = unformattedParam.analysis__analysisresult__parameter__parameter.toLowerCase();
            let secondHalf = unformattedParam.analysis__analysisresult__unit__unit.toLowerCase();
            if (secondHalf === '%') {
              secondHalf = 'pct';
            }
            // console.log(firstHalf + '_' + secondHalf);
            return firstHalf + '_' + secondHalf;
          }
        },

        customLabelForParameters(option) {
          return `${option.analysis__analysisresult__parameter__parameter} ${option.analysis__analysisresult__unit__unit}`
        },

        changeOrder(orderValue) {
          orderValue = orderValue.toLowerCase();
          if (this.searchParameters.watched.orderBy === orderValue) {
            if (orderValue.charAt(0) !== '-') {
              orderValue = '-' + orderValue;
            } else {
              orderValue = orderValue.substring(1);
            }
          }
          this.searchParameters.watched.page = 1;
          this.searchParameters.watched.orderBy = orderValue;
        },

        addParameterField() {
          if (this.numOfComparableParameters < (this.showParameters.length * 2)) {
            this.searchParameters.watched.comparableParameter.push('');
            this.searchParameters.watched.comparableParameterOperator.push('gt');
            this.searchParameters.watched.comparableParameterValue.push('');
            this.numOfComparableParameters += 1;
          }
        },

        deleteParameterField(fieldToDelete) {
          if (this.numOfComparableParameters > 1) {
            this.searchParameters.watched.comparableParameter.splice(fieldToDelete, 1);
            this.searchParameters.watched.comparableParameterOperator.splice(fieldToDelete, 1);
            this.searchParameters.watched.comparableParameterValue.splice(fieldToDelete, 1);
            this.numOfComparableParameters -= 1;
          }
        },

        openInNewWindow(params) {
          if (typeof (params.width) === 'undefined') {
            params.width = 800;
          }
          window.open(location.origin + '/#/' + params.object + '/' + params.id,'', 'width=' + params.width + ', height=750');
        },

        addFloatingTableHeaders() {
          $('#table-search').floatThead({
            position: 'absolute',
            zIndex: 1035,
            top: 98 // headers height
          });
        },

        resetSearchParameters() {
          console.log(this.searchParameters);
          this.searchParameters =
            {
              watched: {
                drillcoreNames: [],
                analyticalMethods: [],
                comparableParameter: [''],
                comparableParameterOperator: ['gt'],
                comparableParameterValue: [''],
                page: 1,
                paginateBy: 100,
                orderBy: 'id',
              },
              // currentlyShownParameters: [
              //   { analysis__analysisresult__parameter__parameter: 'Au', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'au_ppm' },
              //   { analysis__analysisresult__parameter__parameter: 'Co', analysis__analysisresult__unit__unit: '%', formattedValue: 'co_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Co', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'co_ppm' },
              //   { analysis__analysisresult__parameter__parameter: 'Cu', analysis__analysisresult__unit__unit: '%', formattedValue: 'cu_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Cu', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'cu_ppm' },
              //   { analysis__analysisresult__parameter__parameter: 'Fe', analysis__analysisresult__unit__unit: '%', formattedValue: 'fe_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Ni', analysis__analysisresult__unit__unit: '%', formattedValue: 'ni_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Ni', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'ni_ppm' },
              //   { analysis__analysisresult__parameter__parameter: 'S', analysis__analysisresult__unit__unit: '%', formattedValue: 's_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Zn', analysis__analysisresult__unit__unit: '%', formattedValue: 'zn_pct' },
              //   { analysis__analysisresult__parameter__parameter: 'Zn', analysis__analysisresult__unit__unit: 'ppm', formattedValue: 'zn_ppm' },
              // ],
              currentlyShownParameters: [],
            };
          console.log(this.searchParameters);
        },

      },
    }
</script>

<style scoped>
  .searchButtons {
    margin: 0.75rem 0;
  }

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
  }

  .button-right {
    float: right;
  }

  .loading-overlay {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1025;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    padding: 50% 0;
  }

  span {
    white-space: nowrap;
  }
</style>
