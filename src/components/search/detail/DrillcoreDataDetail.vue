<template>
  <div v-if="drillcoreName != null && response.results != null">
    <div class="row">
      <div class="col">
        <router-link :to="{ path: '/drillcore/' + drillcoreId }" class="title-link">{{drillcoreName[0].name}} drillcore</router-link>
      </div>
    </div>


    <div class="row mt-3">
      <div class="col">
        <div>

          <b>Parameters:</b><br>

          <!-- RADIO BUTTONS -->
          <b-form-group v-if="availableParameters.length > 0">
            <b-form-radio-group id="radio-buttons"
                                v-model="selectedParameter"
                                :options="availableParameters">
            </b-form-radio-group>
          </b-form-group>

          <!-- CHECKBOXES -->
          <b-form-group>
            <b-form-checkbox v-model="allSelected"
                             :indeterminate="indeterminate"
                             @change="toggleAllParameters">{{ allSelected ? 'Deselect All' : 'Select All' }}
            </b-form-checkbox>

            <b-form-checkbox-group v-model="currentlyShownParameters"
                                   :options="parameters"
                                   class="row ml-4"
                                   id="checkboxGroup"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs v-model="tabIndex">
          <b-tab :title="'Data (' + (response.count) + ')'" @click="openData()">
            <div class="row mt-3">
              <div class="col-sm-6 col-md-3 pl-3 pr-3 t-paginate-by-center">
                <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
              </div>

              <div class="col-sm-12 col-md-3 mb-3 export-center">
                <export-buttons filename="drillcoreData"></export-buttons>
              </div>

              <div class="col-sm-12 col-md-6 pagination-center">
                <b-pagination
                  size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
                </b-pagination>
              </div>
            </div>


            <div class="row">
              <div class="col">
                <div class="table-responsive">
                  <table id="table-search" class="table table-hover table-bordered">
                    <thead class="thead-light">
                      <tr class="th-sort">
                        <th>
                          <span @click="changeOrder('depth')" v-on:dblclick="removeOrder('depth')">
                            <i class="fas fa-sort" v-if="isFieldInOrderBy('depth') === 0"></i>
                            <i class="fas fa-sort-up" v-if="isFieldInOrderBy('depth') === 1"></i>
                            <i class="fas fa-sort-down" v-if="isFieldInOrderBy('depth') === -1"></i>
                            Depth from (m)
                          </span>
                        </th>

                        <th>
                          <span @click="changeOrder('end_depth')" v-on:dblclick="removeOrder('end_depth')">
                            <i class="fas fa-sort" v-if="isFieldInOrderBy('end_depth') === 0"></i>
                            <i class="fas fa-sort-up" v-if="isFieldInOrderBy('end_depth') === 1"></i>
                            <i class="fas fa-sort-down" v-if="isFieldInOrderBy('end_depth') === -1"></i>
                            Depth to (m)
                          </span>
                        </th>

                        <th>
                          <span @click="changeOrder('sample_number')" v-on:dblclick="removeOrder('sample_number')">
                            <i class="fas fa-sort" v-if="isFieldInOrderBy('sample_number') === 0"></i>
                            <i class="fas fa-sort-up" v-if="isFieldInOrderBy('sample_number') === 1"></i>
                            <i class="fas fa-sort-down" v-if="isFieldInOrderBy('sample_number') === -1"></i>
                            Sample
                          </span>
                        </th>

                        <th>
                          <span @click="changeOrder('analysis_id')" v-on:dblclick="removeOrder('analysis_id')">
                            <i class="fas fa-sort" v-if="isFieldInOrderBy('analysis_id') === 0"></i>
                            <i class="fas fa-sort-up" v-if="isFieldInOrderBy('analysis_id') === 1"></i>
                            <i class="fas fa-sort-down" v-if="isFieldInOrderBy('analysis_id') === -1"></i>
                            Analysis
                          </span>
                        </th>

                        <th v-for="parameter in currentlyShownParameters">
                          <span @click="changeOrder(formatParameterForTableData(parameter))" v-on:dblclick="removeOrder(formatParameterForTableData(parameter))">
                            <i class="fas fa-sort" v-if="isFieldInOrderBy(formatParameterForTableData(parameter)) === 0"></i>
                            <i class="fas fa-sort-up" v-if="isFieldInOrderBy(formatParameterForTableData(parameter)) === 1"></i>
                            <i class="fas fa-sort-down" v-if="isFieldInOrderBy(formatParameterForTableData(parameter)) === -1"></i>
                            {{parameter}}
                          </span>
                        </th>
                        <!--<th v-for="parameter in currentlyShownParameters"><span>{{parameter}}</span></th>-->
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-if="response.count === 0 || response.count === undefined"><br></tr> <!-- Adds empty line so title can fit -->
                      <tr v-for="entity in response.results">
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
                        <td v-for="parameter in currentlyShownParameters">
                          <div v-if="entity.analysis_method">
                            <span v-if="parameter.includes(entity.analysis_method)">
                              {{entity[formatParameterForTableData(parameter)]}}
                            </span>
                          </div>
                          <div v-else>
                            {{entity[formatParameterForTableData(parameter)]}}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>


            <div class="row mt-3" v-if="response.count > 0">
              <div class="col-xs-1 pl-3 pr-3 mb-3 b-paginate-by-center">
                <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions"></b-form-select>
              </div>

              <div class="col mb-3 pagination-center">
                <b-pagination
                  size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
                </b-pagination>
              </div>
            </div>
          </b-tab>
          <b-tab title="Chart" @click="openChart()">
            <plotly-chart :results="response.results" :parameters="currentlyShownParameters" :name="drillcoreName[0].name" :drillcore-id="drillcoreName[0].id" v-if="isChartOpen" ></plotly-chart>
          </b-tab>
        </b-tabs>
      </div>
    </div>

  </div>
  <div v-else>
    <div v-if="showLabel">
      <spinner size="large" message="Loading data..."></spinner>
    </div>
    <div v-else>
      <p class="text-center error-text">
        Sorry, the query returned no results. Try another drillcore.
        <br>
        Note that some datasets are accessible to registered users only.
      </p>
    </div>
  </div>
</template>

<script>
  import ExportButtons from './partial/ExportButtons';
  import PlotlyChart from './partial/PlotlyChart'
  import Spinner from 'vue-simple-spinner'
  import uniqBy from 'lodash/uniqBy'
  // import * as helper from "../../../assets/js/helper";

  export default {
    components: {
      ExportButtons,
      PlotlyChart,
      Spinner,
    },
    props: ['drillcoreId'],
    name: "drillcore-data-detail",
    data() {
      return {
        showLabel: true,
        tabIndex: 0,
        searchParameters: {
          page: 1,
          paginateBy: 250,
          orderBy: ['depth']
        },
        response: {
          count: 0,
          results: []
        },
        drillcoreName: [ { name: '', deposit__main_commodity: '' } ],
        dcName: '',
        currentlyShownParameters: [],
        parameters: [],
        allSelected: false,
        indeterminate: false,
        isChartOpen: false,

        selectedParameter: null,
        availableParameters: [],

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
    metaInfo() {
      return {
        title: 'EUROCORE Data Portal: Drillcore Data' + this.drillcoreId,
        link: [
          { rel: 'stylesheet',
            href: 'https://use.fontawesome.com/releases/v5.0.10/css/all.css',
            integrity: 'sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg',
            crossorigin: 'anonymous'}
        ],
      }
    },

    watch: {
      'drillcoreId': function () {
        this.resetData();
        this.getDrillcoreName(this.drillcoreId);
        this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
        console.log(this.dcName)
        setTimeout(function () { this.showLabel = false }.bind(this), 2000);
      },
      'searchParameters': {
        handler: function () {
          this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
        },
        deep: true
      },
      'searchParameters.paginateBy': function(newVal, oldVal) {
        this.toastInfo('Showing <strong>' + newVal + '</strong> results per page!')
      },
      'currentlyShownParameters': function (newVal, oldVal) {
        if (newVal.length === 0) {
          this.indeterminate = false;
          this.allSelected = false;
        } else if (newVal.length === this.parameters.length) {
          this.indeterminate = false;
          this.allSelected = true;
        } else {
          this.indeterminate = true;
          this.allSelected = false;
        }
      },
      'dcName': function () {
        this.populateParameters(this.drillcoreId);
        this.getParameterMethods(this.drillcoreId);
      },
      'response.results': function (newVal, oldVal) {
        if (newVal == null && oldVal.length === 0) {
          $('body')[0].setAttribute('class', 'background-color-white')
        } else {
          $('body')[0].removeAttribute('class')
        }
      },
      'selectedParameter': function (newVal, oldVal) {
        this.currentlyShownParameters = [];
        if (newVal != null) this.addParametersUsingMethod(newVal)
      },
    },

    beforeRouteUpdate: function (to, from, next) {
      if (to.query.tab === 'chart') {
        this.tabIndex = 1;
        this.isChartOpen = true
      } else {
        this.tabIndex = 0;
        this.isChartOpen = false;
      }

      next()
    },

    created: function () {
      this.getDrillcoreName(this.drillcoreId);

      this.setTabFromUrl();

      if (this.$session.exists() && this.$session.get('drillcore_data/' + this.drillcoreId) != null) {
        const dataToImport = this.$session.get('drillcore_data/' + this.drillcoreId);
        this.searchParameters = dataToImport.searchParameters;
        this.currentlyShownParameters = dataToImport.currentlyShownParameters;
      } else {
        this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
      }

      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
    },

    mounted: function () {
      this.addFloatingTableHeaders();
    },

    updated: function () {
      this.reflowFloatThead();
      this.addResponsiveDesignToCheckboxes()
    },

    beforeDestroy: function () {
      const dataToExport = {
        searchParameters: this.searchParameters,
        currentlyShownParameters: this.currentlyShownParameters
      };
      this.$session.set('drillcore_data/' + this.drillcoreId, dataToExport);
    },

    methods: {

      buildOrderBy(orderBy) {
        if (orderBy.length > 1) {
          let ordering = '';
          for (const field in orderBy) {
            ordering += orderBy[field] + ',';
          }
          ordering = ordering.slice(0, -1);
          return ordering;
        } else if (orderBy.length > 0) {
          return orderBy[0]
        } else {
          return 'id';
        }

      },

      getAnalysisSummary(id, searchParams) {
        const orderBy = this.buildOrderBy(searchParams.orderBy);

        this.$http.get('https://api.eurocore.rocks/analysis_summary/', {params: {drillcore_id: id, page: searchParams.page, paginate_by: searchParams.paginateBy, order_by: orderBy, format: 'json'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getDrillcoreName(id) {
        this.$http.get('https://api.eurocore.rocks/drillcore/' + id, {params: {fields: 'name,deposit__main_commodity,id', format: 'json'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            if (response.body.results.length > 0) {
              this.drillcoreName = response.body.results;
              this.dcName = response.body.results[0].name;
            }
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getParameterMethods(id) {
        this.$http.get('https://api.eurocore.rocks/drillcore/' + id, {
          params: {
            fields: 'analysis__analysis_method__method,analysis__analysisresult__parameter__parameter',
            distinct: 'true',
            format: 'json'
          }
        }).then(response => {
          console.log(response)
          if (response.status === 200) {
            this.buildParameterMethods(response.body.results)
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      /**
       * Populates radio buttons with methods from get request
       */
      buildParameterMethods(parameters) {
        if (parameters != null) {
          if (parameters.length > 0) {

            // Locally pushing parameter objects here because of duplicates
            let methodOptions = []

            for (let method in parameters) {

              // Sometimes method exists but parameter doesn't
              if (parameters[method].analysis__analysisresult__parameter__parameter != null) {

                let methodName = parameters[method].analysis__analysis_method__method

                if (methodName != null) {

                  // Parameter object
                  let parameterToAdd = {}
                  parameterToAdd.text = 'Select <b>' + methodName + '</b>'
                  parameterToAdd.value = methodName

                  methodOptions.push(parameterToAdd)
                }
              }
            }

            // Removing duplicates
            if (methodOptions.length > 0) {
              this.availableParameters = uniqBy(methodOptions, 'value')
            }
          }
        }
      },

      populateParameters(id) {
        this.$http.get('https://api.eurocore.rocks/drillcore/' + id, {
          params: {
            fields: 'name,analysis__analysisresult__parameter__parameter,analysis__analysisresult__unit__unit,analysis__analysis_method__method',
            distinct: 'true',
            format: 'json',
            order_by: 'analysis__analysisresult__parameter__parameter'
          }
        }).then(response => {
          console.log(response);
          if (response.status === 200) {
            const allParameters = response.body.results;

            for (const i in allParameters) {
              if (this.areParametersEligible(allParameters[i])) {
                this.parameters.push(this.getCorrectParameterFormat(allParameters[i]));

                // Only if no params are chosen at start
                // if (this.currentlyShownParameters.length === 0) {
                  if (this.drillcoreName[0].deposit__main_commodity !== null && this.drillcoreName[0].deposit__main_commodity !== '') { // Populates default commodities
                    const defaultCommodities = this.showMainCommoditiesByDefault(this.drillcoreName[0].deposit__main_commodity);
                    if (defaultCommodities.length > 0) {
                      for (const commodity in defaultCommodities) {
                        if (allParameters[i].analysis__analysisresult__parameter__parameter === defaultCommodities[commodity]) {
                          this.currentlyShownParameters.push(this.getCorrectParameterFormat(allParameters[i]));
                        }
                      }
                    }
                  } else if (i < 10) { // Populates 10 first params
                    this.currentlyShownParameters.push(this.getCorrectParameterFormat(allParameters[i]));
                  }
                // }


              }
            }
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      getCorrectParameterFormat(param) {
        if (param !== 'undefined') {
          if (param.analysis__analysis_method__method != null) {
            return param.analysis__analysisresult__parameter__parameter + ' ' + param.analysis__analysisresult__unit__unit + ' (' + param.analysis__analysis_method__method + ')';
          }
          return param.analysis__analysisresult__parameter__parameter + ' ' + param.analysis__analysisresult__unit__unit;
        }
      },

      areParametersEligible(param) {
        return param.analysis__analysisresult__parameter__parameter != null && param.analysis__analysisresult__unit__unit != null;
      },

      showMainCommoditiesByDefault(commodities) {
        if (commodities && commodities != null) {
          let defaultCommodities = [];

          // https://github.com/geocollections/eurocore-db-ui/issues/11
          if (commodities.includes('PGE')) {
            commodities = commodities.replace('PGE', 'Pt, Pd')
          }

          if (commodities.includes(',')) {
            commodities = commodities.replace(/,/g , '');
            commodities = commodities.split(' ');
            for (const i in commodities) {
              defaultCommodities.push(commodities[i]);
            }
          } else {
            defaultCommodities.push(commodities)
          }
          return defaultCommodities;
        }
      },

      toggleAllParameters(checked) {
        this.currentlyShownParameters = checked ? this.parameters.slice() : [];
      },

      formatParameterForTableData(param) {
        if (param && param != null) {
          let params = param.split(' ');
          let firstHalf = params[0].toLowerCase();
          let secondHalf = params[1].toLowerCase();
          if (secondHalf === '%') {
            secondHalf = 'pct';
          }
          return firstHalf + '_' + secondHalf;
        }
      },

      openData() {
        this.isChartOpen = false;
        this.$router.push({ path: '/drillcore_data/' + this.drillcoreId, query: { tab: 'data' } })
      },

      openChart() {
        this.isChartOpen = true;
        this.$router.push({ path: '/drillcore_data/' + this.drillcoreId, query: { tab: 'chart' } })
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

      addResponsiveDesignToCheckboxes() {
        $('#checkboxGroup').find('div').addClass('mr-0 col-6 col-sm-4 col-md-3 col-lg-2 text-center')
      },

      addParametersUsingMethod(methodName) {
        for (const param in this.parameters) {
          if (this.parameters[param].includes(methodName)) {
            if (!this.currentlyShownParameters.includes(this.parameters[param])) {
              this.currentlyShownParameters.push(this.parameters[param]);
            }
          }
        }
      },

      // Currently not used because of different logic #54
      deleteParametersUsingMethod(methodName) {
        let i = this.currentlyShownParameters.length;
        while (i--) {
          if (this.currentlyShownParameters[i].includes(methodName)) {
            this.currentlyShownParameters.splice(i, 1);
          }
        }
      },

      setTabFromUrl() {
        if (this.$route.query.tab === 'chart') {
          this.tabIndex = 1;
          this.isChartOpen = true;
        } else {
          this.tabIndex = 0;
          this.isChartOpen = false;
        }
      },



      /***************************
       *** ORDERING CODE START ***
       ***************************/

      changeOrder(field) {
        if (this.searchParameters.orderBy.includes(field)) {
          // Ascending
          this.$set(this.searchParameters.orderBy, this.searchParameters.orderBy.indexOf(field), '-' + field);

        } else if (this.searchParameters.orderBy.includes('-' + field)) {
          // Descending
          this.$set(this.searchParameters.orderBy, this.searchParameters.orderBy.indexOf('-' + field), field);

        } else {

          if (this.searchParameters.orderBy.length > 1) {
            // Removes first and adds field
            this.searchParameters.orderBy.shift();
            this.searchParameters.orderBy.push(field);
          } else {
            // Just adds field
            this.searchParameters.orderBy.push(field)
          }
        }

        // Move it up if it starts to trigger multiple requests
        this.searchParameters.page = 1;
      },

      // Returns 1 for ascending, -1 for descending and 0 if not in orderBy
      isFieldInOrderBy(field) {
        for (const i in this.searchParameters.orderBy) {
          if (this.searchParameters.orderBy[i] === field) {
            return 1;
          }
          if (this.searchParameters.orderBy[i] === '-' + field) {
            return -1
          }
        }
        return 0;
      },

      removeOrder(field) {
        if (this.searchParameters.orderBy.includes(field)) {
          this.searchParameters.orderBy.splice(this.searchParameters.orderBy.indexOf(field), 1)
        } else if (this.searchParameters.orderBy.includes('-' + field)) {
          this.searchParameters.orderBy.splice(this.searchParameters.orderBy.indexOf('-' + field), 1)
        }
      },

      /***************************
       ***  ORDERING CODE END  ***
       ***************************/



      toastInfo(text) {
        this.$toast.info(text, 'Info', {
          position: 'bottomRight',
          timeout: 3000,
          pauseOnHover: false
        })
      },

      resetData() {
        this.showLabel = true;
        this.selectedParameter = null;
        this.availableParameters = [];
        // this.tabIndex = 0; Not Resetting it!
        this.searchParameters = {
          page: 1,
          paginateBy: 250,
          orderBy: ['depth']
        };
        this.response = {
          count: 0,
          results: []
        };
        this.drillcoreName = [ { name: '', deposit__main_commodity: '' } ];
        this.currentlyShownParameters = [];
        this.parameters = [];
        this.allSelected = false;
        this.indeterminate = false;
      },

    }
  }
</script>

<style scoped>
  .title-link {
    color: #004393;
    font-size: 2rem;
    font-weight: 700;
  }

  .title-link:hover {
    opacity: 0.7;
  }

  .error-text {
    font-size: 1.5rem;
    padding: 10% 0;
  }

  span {
    white-space: nowrap;
  }
</style>
