<template>
  <div>

    <div class="row">
      <div class="col">
        <h2>Data Search</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="form-group">
          <label>Drillcore name(s)</label>
          <vue-multiselect
            v-model="searchParameters.watched.drillcoreNames"
            :options="drillcoreNames"
            placeholder="Select drillcore"
            :multiple="true"
            track-by="drillcore__name"
            :close-on-select="false"
            label="drillcore__name"></vue-multiselect>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="form-group">
          <label>Dataset</label>
          <vue-multiselect
            v-model="searchParameters.watched.dataset"
            :options="dataset"
            placeholder="select dataset"
            :multiple="true"
            track-by="dataset__name"
            :close-on-select="false"
            label="dataset__name"></vue-multiselect>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="form-group">
          <label>Show parameter(s)</label>
          <vue-multiselect
            v-model="searchParameters.currentlyShownParameters"
            :options="showParameters"
            placeholder="select parameter"
            :multiple="true"
            track-by="formattedValue"
            :close-on-select="false"
            :custom-label="customLabelForParameters"></vue-multiselect>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="form-group">
          <label>Analytical method(s)</label>
          <vue-multiselect
            v-model="searchParameters.watched.analyticalMethods"
            :options="analyticalMethods"
            placeholder="select method"
            :multiple="true"
            track-by="analysis_method__method"
            :close-on-select="false"
            label="analysis_method__method"></vue-multiselect>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col">

        <label>Parameter filter</label>
        <!--<div class="row mb-3">-->
          <!--<div class="col">-->
            <!--<button class="btn btn-outline-primary btn-sm" title="Adds parameter field" @click="addParameterField()" >Add Parameter</button>-->
          <!--</div>-->
        <!--</div>-->

        <div class="row">
          <div class="form-group col-sm-12 col-md-6" v-for="(item, key) in searchParameters.numOfComparableParameters">
            <div class="input-group">
              <b-form-select v-model="searchParameters.watched.comparableParameter[key]" >
                <option :value="''">Select parameter</option>
                <option v-for="parameter in showParameters" :value="parameter.formattedValue">{{parameter.analysisresult__parameter__parameter}} {{parameter.analysisresult__unit__unit}}</option>
              </b-form-select>
              <b-form-select v-model="searchParameters.watched.comparableParameterOperator[key]" :options="parameterOptions"></b-form-select>
              <b-form-input id="custom-border-radius" v-model="searchParameters.watched.comparableParameterValue[key]" type="number" placeholder="0"></b-form-input>

              <button class="btn btn-outline-danger ml-2" :disabled="searchParameters.numOfComparableParameters < 2" @click="deleteParameterField(key)">
                <i class="fas fa-minus fa-xs"></i>
              </button>

              <button class="btn btn-outline-primary ml-2" @click="addParameterField()">
                <i class="fas fa-plus fa-xs"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>


    <div class="row">
      <div class="col">
        <span>
          <button class="btn btn-primary mr-2 mb-2" title="Sends request with inserted data" @click="searchEntities(searchParameters.watched)">SEARCH</button>
        </span>

        <span>
          <button class="btn btn-danger mr-2 mb-2" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
        </span>
      </div>
    </div>


    <div class="row mt-1">
      <div class="col">
        <spinner v-if="isSearching" message="Loading data..."></spinner>
        <p v-else-if="!isSearching && (response.count > 0 || response.count !== undefined)">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-sm-6 col-md-3 pl-3 pr-3 t-paginate-by-center">
        <b-form-select v-model="searchParameters.watched.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
      </div>

      <div class="col-sm-12 col-md-3 mb-3 export-center">
        <export-buttons filename="dataSearch"></export-buttons>
      </div>

      <div class="col-sm-12 col-md-6 pagination-center">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
        </b-pagination>
      </div>
    </div>

    <!-- TODO: Double click to remove doesn't work because of overlay loading screen -->
    <div class="row" v-show="response.count > 0">
      <div class="col">
        <div class="table-responsive">
          <table id="table-search" class="table table-hover table-bordered ">
            <thead class="thead-light">
              <tr class="th-sort">
                <th>
                  <span @click="changeOrder('drillcore_name')" v-on:dblclick="removeOrder('drillcore_name')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('drillcore_name') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('drillcore_name') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('drillcore_name') === -1"></i>
                    Drillcore
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('drillcore_name')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('drillcore_name') === 1 || isFieldInOrderBy('drillcore_name') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th>
                  <span @click="changeOrder('depth')" v-on:dblclick="removeOrder('depth')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('depth') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('depth') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('depth') === -1"></i>
                    Depth from (m)
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('depth')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('depth') === 1 || isFieldInOrderBy('depth') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th>
                  <span @click="changeOrder('end_depth')" v-on:dblclick="removeOrder('end_depth')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('end_depth') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('end_depth') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('end_depth') === -1"></i>
                    Depth to (m)
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('end_depth')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('end_depth') === 1 || isFieldInOrderBy('end_depth') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th>
                  <span @click="changeOrder('sample_number')" v-on:dblclick="removeOrder('sample_number')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('sample_number') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('sample_number') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('sample_number') === -1"></i>
                    Sample
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('sample_number')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('sample_number') === 1 || isFieldInOrderBy('sample_number') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th>
                  <span @click="changeOrder('analysis_id')" v-on:dblclick="removeOrder('analysis_id')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('analysis_id') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('analysis_id') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('analysis_id') === -1"></i>
                    Analysis ID
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('analysis_id')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('analysis_id') === 1 || isFieldInOrderBy('analysis_id') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th>
                  <span @click="changeOrder('analysis_method')" v-on:dblclick="removeOrder('analysis_method')">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy('analysis_method') === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy('analysis_method') === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy('analysis_method') === -1"></i>
                    Method
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder('analysis_method')">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy('analysis_method') === 1 || isFieldInOrderBy('analysis_method') === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>

                <th v-for="parameter in searchParameters.currentlyShownParameters">
                  <span @click="changeOrder(parameter.formattedValue)" v-on:dblclick="removeOrder(parameter.formattedValue)">
                    <i class="fas fa-sort" v-if="isFieldInOrderBy(parameter.formattedValue) === 0"></i>
                    <i class="fas fa-sort-up" v-if="isFieldInOrderBy(parameter.formattedValue) === 1"></i>
                    <i class="fas fa-sort-down" v-if="isFieldInOrderBy(parameter.formattedValue) === -1"></i>
                    {{parameter.analysisresult__parameter__parameter + ' ' + parameter.analysisresult__unit__unit}}
                  </span>
                  <!--&nbsp;<span class="remove-order" @click="removeOrder(parameter.formattedValue)">-->
                    <!--<i class="far fa-times-circle" v-if="(isFieldInOrderBy(parameter.formattedValue) === 1 || isFieldInOrderBy(parameter.formattedValue) === -1) && searchParameters.watched.orderBy.length > 1"></i>-->
                  <!--</span>-->
                </th>
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
      <div class="col-xs-1 pl-3 pr-3 mb-3 b-paginate-by-center">
        <b-form-select v-model="searchParameters.watched.paginateBy" :options="paginationOptions"></b-form-select>
      </div>

      <div class="col mb-3 pagination-center">
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
    import Spinner from 'vue-simple-spinner'

    export default {
      components: {
        VueMultiselect,
        ExportButtons,
        Spinner
      },

      name: "data-search",

      data() {
        return {
          API_URL: 'https://api.eurocore.rocks/',
          isSearching: false,
          searchParameters: {
            watched: {
              drillcoreNames: [],
              analyticalMethods: [],
              comparableParameter: ['', ''],
              comparableParameterOperator: ['gt', 'gt'],
              comparableParameterValue: ['', ''],
              dataset: [],
              page: 1,
              paginateBy: 100,
              orderBy: ['drillcore_name', '-depth'],
              // orderBy: 'drillcore_name',
            },
            currentlyShownParameters: [],
            numOfComparableParameters: 2,
          },
          response: {
            count: 0,
            results: []
          },
          drillcoreNames: [],
          analyticalMethods: [],
          showParameters: [],
          dataset: [],
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
        }
      },

      metaInfo: {
        title: 'EUROCORE Data Portal: Data Search',
        link: [
          { rel: 'stylesheet',
            href: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
            integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
            crossorigin: 'anonymous'}
        ],
      },

      watch: {
        'searchParameters.watched': {
          handler: function (newVal, oldVal) {
            console.log(newVal)
            console.log(oldVal)
            this.isSearching = true;
            this.searchEntities(this.searchParameters.watched);
          },
          deep: true
        },
        // TODO: Should optimise it, because currently it sends duplicates if any value is in session
        'searchParameters.watched.drillcoreNames': function(newVal, oldVal) {
          if (newVal.length !== oldVal.length) {
            this.populateAnalyticalMethods(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateShowParameters(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateDataset(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)
          }
        },
        'searchParameters.watched.analyticalMethods': function(newVal, oldVal) {
          if (newVal.length !== oldVal.length) {
            this.populateDrillcoreNames(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateShowParameters(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateDataset(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)
          }
        },
        'searchParameters.currentlyShownParameters': function (newVal, oldVal) {
          if (newVal.length !== oldVal.length) {
            this.populateDrillcoreNames(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateAnalyticalMethods(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateDataset(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)
          }
        },
        'searchParameters.watched.dataset': function (newVal, oldVal) {
          if (newVal.length !== oldVal.length) {
            this.populateDrillcoreNames(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateAnalyticalMethods(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
            this.populateShowParameters(this.searchParameters.watched, this.searchParameters.currentlyShownParameters);
          }
        },
        'searchParameters.watched.paginateBy': function(newVal, oldVal) {
          this.toastInfo('Showing <strong>' + newVal + '</strong> results per page!')
        },
        'searchParameters.watched.comparableParameter': function () {
          this.appendChosenParameter(this.searchParameters.watched.comparableParameter);
        }
      },

      created: function () {
        this.isSearching = true;

        // TODO: Params should come from URL if exists
        // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
        if (this.isDataSearchInSession()) {

          this.searchParameters = this.$session.get('dataSearch');
          this.populateAll(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)
        } else {
          this.searchEntities(this.searchParameters.watched);
          this.populateAll(this.searchParameters.watched, this.searchParameters.currentlyShownParameters)
        }
      },

      updated: function () {
        this.reflowFloatThead();
        this.addFloatingTableHeaders();
      },

      beforeDestroy: function () {
        this.$session.set('dataSearch', this.searchParameters);
      },

      methods: {


        searchEntities(params) {
          let url = this.buildSearchUrl(params);

          // this.$http.get(url , {params: {format: 'json', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
          this.$http.get(url , {params: {format: 'json', page: params.page, paginate_by: params.paginateBy}}).then(response => {
            console.log(response);
            this.isSearching = false;
            if (response.status === 200) {
              this.response.count = response.body.count;
              this.response.results = response.body.results;
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            this.isSearching = false;
          })
        },


        /*******************************
         ***** URL BUILDING START ******
         *******************************/

        buildSearchUrl(params) {
          let url = this.API_URL + 'analysis_summary/?';

          for (const key in params) {
            if (params.hasOwnProperty(key)) {
              console.log(key + ' ' + params[key])

              if (key === 'drillcoreNames') {
                url = this.addFieldToUrl(params[key], url, 'drillcore_name__in=', 'drillcore_name=', 'drillcore__name');
              }

              if (key === 'analyticalMethods') {
                url = this.addFieldToUrl(params[key], url, 'analysis_method__in=', 'analysis_method=', 'analysis_method__method');
              }

              if (key === 'dataset') {
                url = this.addFieldToUrl(params[key], url, null, 'dataset_id=', 'dataset__id');
              }

              if (key === 'comparableParameter') {
                for (const i in params[key]) {
                  if (params['comparableParameter'][i].length > 0 && params['comparableParameterValue'][i].length > 0) {
                    url += params['comparableParameter'][i] + '__' + params['comparableParameterOperator'][i] + '=' + params['comparableParameterValue'][i] + '&'
                  }
                }
              }

              if (key === 'orderBy') {
                if (params[key].length > 0) {
                  url += 'order_by=';
                  for (const field in params[key]) {
                    url += params[key][field] + ','
                  }

                  url = this.removeCommaAndAddAmpersand(url);
                }
              }

            }
          }

          url = this.removeQuestionMarkOrAmpersand(url);

          return url;
        },

        buildSearchUrlForPopulate(params, currentlyShownParams, drillcoreNames, analyticalMethods, parameters, dataset) {
          let url = this.API_URL + 'analysis/?';

          for (const key in params) {
            if (params.hasOwnProperty(key)) {

              if (key === 'drillcoreNames' && drillcoreNames === true) {
                url = this.addFieldToUrl(params[key], url, 'drillcore__name__in=', 'drillcore__name=', 'drillcore__name');
              }

              if (key === 'analyticalMethods' && analyticalMethods === true) {
                url = this.addFieldToUrl(params[key], url, 'analysis_method__method__in=', 'analysis_method__method=', 'analysis_method__method');
              }

              if (key === 'dataset' && dataset === true) {
                url = this.addFieldToUrl(params[key], url, 'dataset__id__in=', 'dataset__id=', 'dataset__id');
              }
            }

          }

          if (parameters === true)  {

            // PARAMETER (Ag, As, ...)
            if (currentlyShownParams.length > 1) {
              url += 'analysisresult__parameter__parameter__in='
            } else if (currentlyShownParams.length > 0) {
              url += 'analysisresult__parameter__parameter='
            }
            for (const key in currentlyShownParams) {
              if (currentlyShownParams.hasOwnProperty(key)) {
                // console.log(currentlyShownParams[key].analysisresult__parameter__parameter + ' ' + currentlyShownParams[key].analysisresult__unit__unit);
                url += currentlyShownParams[key].analysisresult__parameter__parameter + ','
              }
            }

            url = this.removeCommaAndAddAmpersand(url);

            // UNIT (%, ppm, ...)
            if (currentlyShownParams.length > 1) {
              url += 'analysisresult__unit__unit__in='
            } else if (currentlyShownParams.length > 0) {
              url += 'analysisresult__unit__unit='
            }
            for (const key in currentlyShownParams) {
              if (currentlyShownParams.hasOwnProperty(key)) {
                // console.log(currentlyShownParams[key].analysisresult__parameter__parameter + ' ' + currentlyShownParams[key].analysisresult__unit__unit);
                if (currentlyShownParams[key].analysisresult__unit__unit === '%' && !url.includes('%')) {
                  url += currentlyShownParams[key].analysisresult__unit__unit + ','
                } else if (currentlyShownParams[key].analysisresult__unit__unit === 'ppm' && !url.includes('ppm')) {
                  url += currentlyShownParams[key].analysisresult__unit__unit + ','
                }
              }
            }
          }

          url = this.removeCommaAndAddAmpersand(url);

          url = this.removeQuestionMarkOrAmpersand(url);

          return url
        },

        addFieldToUrl(paramArray, url, multiField, singleField, paramArrayField) {
          if (paramArray.length > 0) {
            if (paramArray.length > 1 && multiField !== null) {
              url += multiField;
            } else {
              url += singleField;
            }

            for (const item in paramArray) {
              url += paramArray[item][paramArrayField] + ',';
            }

            url = this.removeCommaAndAddAmpersand(url);
          }

          return url;
        },

        removeCommaAndAddAmpersand(url) {
          url = url.slice(0, -1);
          url += '&';
          return url;
        },

        removeQuestionMarkOrAmpersand(url) {
          if (url.slice(-1) === '?' || url.slice(-1) === '&') {
            url = url.slice(0, -1);
          }
          return url;
        },

        /*******************************
         *****  URL BUILDING END  ******
         *******************************/



        /***************************************
         ***** MULTISELECT POPULATE START ******
         ***************************************/

        populateDrillcoreNames(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, false, true, true, true);

          this.$http.get(url , {params: {format: 'json', distinct: 'true', fields: 'drillcore__name'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                this.drillcoreNames = response.body.results;
              } else {
                this.drillcoreNames = [];
              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
          })
        },

        populateAnalyticalMethods(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, true, false, true, true);

          this.$http.get(url , {params: {distinct: 'true', format: 'json', fields: 'analysis_method__method'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                const allMethods = response.body.results;
                this.analyticalMethods = [];
                for (const method in allMethods) {
                  if (allMethods[method].analysis_method__method !== null) {
                    this.analyticalMethods.push(allMethods[method]);
                  }
                }
                // this.analyticalMethods = response.body.results;
              } else {
                this.analyticalMethods = [];
              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
          })
        },

        populateShowParameters(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, true, true, false, true);

          this.$http.get(url , {params: {format: 'json', distinct: 'true', order_by: 'analysisresult__parameter__parameter', fields: 'analysisresult__parameter__parameter,analysisresult__unit__unit'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                const allParameters = response.body.results;
                this.showParameters = [];
                for (const param in allParameters) {
                  if (allParameters[param].analysisresult__parameter__parameter !== null && allParameters[param].analysisresult__unit__unit !== null) {
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
            console.log('ERROR: ' + JSON.stringify(errResponse));
          })
        },

        populateDataset(params, currentlyShownParams) {
          let url = this.buildSearchUrlForPopulate(params, currentlyShownParams, true, true, true, false)

          this.$http.get(url , {params: {dataset__id__isnull: 'false' ,format: 'json', distinct: 'true', fields: 'dataset__name,dataset__id'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              if (response.body.count > 0) {
                const allDatasets = response.body.results;
                this.dataset = [];
                for (const dataset in allDatasets) {
                  if (allDatasets[dataset].dataset__name !== null) {
                    this.dataset.push(allDatasets[dataset]);
                  }
                }
              } else {
                this.dataset = [];
              }
            }
          }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
          })

        },

        populateAll(params, currentlyShownParams) {
          this.populateAnalyticalMethods(params, currentlyShownParams);
          this.populateShowParameters(params, currentlyShownParams);
          this.populateDrillcoreNames(params, currentlyShownParams);
          this.populateDataset(params, currentlyShownParams);
        },

        /***************************************
         *****  MULTISELECT POPULATE END  ******
         ***************************************/



        getCorrectParameterFormat(param) {
          // console.log(param);
          if (param !== 'undefined') {
            let unformattedParam = param;
            let firstHalf = unformattedParam.analysisresult__parameter__parameter.toLowerCase();
            let secondHalf = unformattedParam.analysisresult__unit__unit.toLowerCase();
            if (secondHalf === '%') {
              secondHalf = 'pct';
            }
            // console.log(firstHalf + '_' + secondHalf);
            return firstHalf + '_' + secondHalf;
          }
        },

        customLabelForParameters(option) {
          return `${option.analysisresult__parameter__parameter} ${option.analysisresult__unit__unit}`
        },



        /***************************
         *** ORDERING CODE START ***
         ***************************/

        changeOrder(field) {
          if (this.searchParameters.watched.orderBy.includes(field)) {
            // Ascending
            this.$set(this.searchParameters.watched.orderBy, this.searchParameters.watched.orderBy.indexOf(field), '-' + field);

          } else if (this.searchParameters.watched.orderBy.includes('-' + field)) {
            // Descending
            this.$set(this.searchParameters.watched.orderBy, this.searchParameters.watched.orderBy.indexOf('-' + field), field);

          } else {

            if (this.searchParameters.watched.orderBy.length > 1) {
              // Removes first and adds field
              this.searchParameters.watched.orderBy.shift();
              this.searchParameters.watched.orderBy.push(field);
            } else {
              // Just adds field
              this.searchParameters.watched.orderBy.push(field)
            }
          }

          // Move it up if it starts to trigger multiple requests
          this.searchParameters.watched.page = 1;
        },

        // Returns 1 for ascending, -1 for descending and 0 if not in orderBy
        isFieldInOrderBy(field) {
          for (const i in this.searchParameters.watched.orderBy) {
            if (this.searchParameters.watched.orderBy[i] === field) {
              return 1;
            }
            if (this.searchParameters.watched.orderBy[i] === '-' + field) {
              return -1
            }
          }
          return 0;
        },

        removeOrder(field) {
          if (this.searchParameters.watched.orderBy.includes(field)) {
            this.searchParameters.watched.orderBy.splice(this.searchParameters.watched.orderBy.indexOf(field), 1)
          } else if (this.searchParameters.watched.orderBy.includes('-' + field)) {
            this.searchParameters.watched.orderBy.splice(this.searchParameters.watched.orderBy.indexOf('-' + field), 1)
          }
        },

        /***************************
         ***  ORDERING CODE END  ***
         ***************************/



        addParameterField() {
          if (this.searchParameters.numOfComparableParameters < (this.showParameters.length * 2)) {
            this.searchParameters.watched.comparableParameter.push('');
            this.searchParameters.watched.comparableParameterOperator.push('gt');
            this.searchParameters.watched.comparableParameterValue.push('');
            this.searchParameters.numOfComparableParameters += 1;
          }
        },

        deleteParameterField(fieldToDelete) {
          if (this.searchParameters.numOfComparableParameters > 1) {
            this.searchParameters.watched.comparableParameter.splice(fieldToDelete, 1);
            this.searchParameters.watched.comparableParameterOperator.splice(fieldToDelete, 1);
            this.searchParameters.watched.comparableParameterValue.splice(fieldToDelete, 1);
            this.searchParameters.numOfComparableParameters -= 1;
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
            zIndex: 1025,
            top: function () {
              return $('#main').css('padding-top') === '22px' ? 0 : 98;
            }
          });
        },

        reflowFloatThead() {
          $('#table-search').floatThead('reflow');
        },

        toastInfo(text) {
          this.$toast.info(text, 'Info', {
            position: 'bottomRight',
            timeout: 3000,
            pauseOnHover: false
          })
        },

        appendChosenParameter(comparableParameters) {
          for (const value in comparableParameters) {
            if (comparableParameters[value] !== null && comparableParameters[value] !== "") {

              let formattedValue = comparableParameters[value].split('_');
              let parameter = formattedValue[0];
              let unit = formattedValue[1];

              parameter = parameter[0].toUpperCase() + parameter.substring(1);
              if (unit === 'pct') {
                unit = '%'
              }

              let objectToAdd = {
                analysisresult__parameter__parameter: parameter,
                analysisresult__unit__unit: unit,
                formattedValue: comparableParameters[value]
              };

              // Add to currently shown parameters
              if (this.searchParameters.currentlyShownParameters.length > 0) {

                const result = this.searchParameters.currentlyShownParameters.find(x => x.formattedValue === objectToAdd.formattedValue)

                // if undefined then it is not in currentlyShownParameters
                if (typeof (result) === 'undefined') {
                  this.searchParameters.currentlyShownParameters.push(objectToAdd);
                }

              } else {
                this.searchParameters.currentlyShownParameters.push(objectToAdd);
              }

            }
          }
        },

        isDataSearchInSession() {
          return this.$session.exists() && this.$session.get('dataSearch') != null;
        },

        resetSearchParameters() {
          console.log(this.searchParameters);
          this.searchParameters =
            {
              watched: {
                drillcoreNames: [],
                analyticalMethods: [],
                comparableParameter: ['', ''],
                comparableParameterOperator: ['gt', 'gt'],
                comparableParameterValue: ['', ''],
                dataset: [],
                page: 1,
                paginateBy: 100,
                orderBy: ['drillcore_name', 'depth'],
                // orderBy: 'drillcore_name',
              },
              currentlyShownParameters: [],
              numOfComparableParameters: 2,
            };
          console.log(this.searchParameters);
        },

      },
    }
</script>

<style scoped>
  span {
    white-space: nowrap;
  }

  /* Parameter filter number field border style */
  #custom-border-radius {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }

  /* They went together with circle-x remove ordering button */
  /*.remove-order {*/
    /*color: #dc3545;*/
    /*font-size: 1.1rem;*/
    /*!* Removed transition because if I want to hold table head on one line *!*/
    /*!*transition: all 500ms;*!*/
  /*}*/

  /*.remove-order:hover {*/
    /*color: #9a2530;*/
    /*!*opacity: 0.7;*!*/
    /*!*font-size: 1.35rem;*!*/
  /*}*/

</style>
