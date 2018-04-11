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
          <b-form-group>
            <b>Parameters:</b><br>
            <b-form-checkbox v-model="allSelected"
                             :indeterminate="indeterminate"
                             @change="toggleAllParameters">{{ allSelected ? 'Deselect All' : 'Select All' }}
            </b-form-checkbox>

            <b-form-checkbox v-if="ctExists"
                             v-model="ctCheckbox">{{ ctCheckbox ? 'Deselect CT' : 'SelectCT' }}
            </b-form-checkbox>

            <b-form-checkbox v-if="faAasExists"
                             v-model="faAasCheckbox">{{ faAasCheckbox ? 'Deselect FA-AAS' : 'Select FA-AAS' }}
            </b-form-checkbox>

            <b-form-checkbox v-if="icpOesExists"
                             v-model="icpOesCheckbox">{{ icpOesCheckbox ? 'Deselect ICP-OES' : 'Select ICP-OES' }}
            </b-form-checkbox>

            <b-form-checkbox v-if="lecoExists"
                             v-model="lecoCheckbox">{{ lecoCheckbox ? 'Deselect Leco' : 'Select Leco' }}
            </b-form-checkbox>

            <b-form-checkbox v-if="xrfExists"
                             v-model="xrfCheckbox">{{ xrfCheckbox ? 'Deselect XRF' : 'Select XRF' }}
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
        <b-tabs>
          <b-tab :title="'Data (' + (response.count) + ')'" @click="openData()">
            <div class="row mt-3">
              <div class="col-xs-1 pl-3 pr-3">
                <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
              </div>

              <div class="col mb-3">
                <export-buttons filename="drillcoreData"></export-buttons>
              </div>

              <div class="col">
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
                        <th><span @click="changeOrder('depth', $event)">
                            <font-awesome-icon v-if="searchParameters.orderBy !== 'depth' && searchParameters.orderBy !== '-depth'" :icon="icon"/>
                            <font-awesome-icon v-else :icon="sortingDirection" />
                            Depth from (m)</span>
                        </th>

                        <th><span @click="changeOrder('end_depth', $event)">
                            <font-awesome-icon v-if="searchParameters.orderBy !== 'end_depth' && searchParameters.orderBy !== '-end_depth'" :icon="icon"/>
                            <font-awesome-icon v-else :icon="sortingDirection" />
                            Depth to (m)</span>
                        </th>

                        <th><span @click="changeOrder('sample_number')">
                          <font-awesome-icon v-if="searchParameters.orderBy !== 'sample_number' && searchParameters.orderBy !== '-sample_number'" :icon="icon"/>
                          <font-awesome-icon v-else :icon="sortingDirection" />
                          Sample</span></th>

                        <th><span @click="changeOrder('analysis_id')">
                          <font-awesome-icon v-if="searchParameters.orderBy !== 'analysis_id' && searchParameters.orderBy !== '-analysis_id'" :icon="icon"/>
                          <font-awesome-icon v-else :icon="sortingDirection" />
                          Analysis</span>
                        </th>

                        <!-- REMOVED ORDERING BECAUSE OF GRAPH MALFUNCTION <th v-for="parameter in currentlyShownParameters"><span  v-b-tooltip.hover.bottom :title="'Order by ' + parameter" @click="changeOrder(formatParameterForTableData(parameter))">{{parameter}}</span></th>-->
                        <th v-for="parameter in currentlyShownParameters"><span>{{parameter}}</span></th>
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
              <div class="col-xs-1 pl-3 pr-3 mb-3">
                <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions"></b-form-select>
              </div>

              <div class="col mb-3">
                <b-pagination
                  size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
                </b-pagination>
              </div>
            </div>
          </b-tab>
          <b-tab title="Chart" @click="openChart()">
            <plotly-chart :results="response.results" :parameters="currentlyShownParameters" :name="drillcoreName[0].name" v-if="isChartOpen" ></plotly-chart>
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
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSort from '@fortawesome/fontawesome-free-solid/faSort'
  import faSortUp from '@fortawesome/fontawesome-free-solid/faSortUp'
  import faSortDown from '@fortawesome/fontawesome-free-solid/faSortDown'

  export default {
    components: {
      ExportButtons,
      PlotlyChart,
      Spinner,
      FontAwesomeIcon
    },
    props: ['drillcoreId'],
    name: "drillcore-data-detail",
    data() {
      return {
        showLabel: true,
        searchParameters: {
          page: 1,
          paginateBy: 250,
          orderBy: 'depth'
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

        //TODO: Parameters shouldn't be hardcoded.
        ctExists: false,
        faAasExists: false,
        icpOesExists: false,
        lecoExists: false,
        xrfExists: false,
        ctCheckbox: false,
        faAasCheckbox: false,
        icpOesCheckbox: false,
        lecoCheckbox: false,
        xrfCheckbox: false,
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
        title: 'EUROCORE Data Portal: Drillcore Data' + this.drillcoreId
      }
    },

    computed: {
      icon() {
        return faSort;
      },

      sortingDirection() {
        return this.searchParameters.orderBy.includes('-') ? faSortDown : faSortUp
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
      },
      'response.results': function (newVal, oldVal) {
        if (newVal == null && oldVal.length === 0) {
          $('body')[0].setAttribute('class', 'background-color-white')
        } else {
          $('body')[0].removeAttribute('class')
        }
      },
      'ctCheckbox': function (newVal, oldVal) {
        newVal ? this.addParametersUsingMethod('CT') : this.deleteParametersUsingMethod('CT');
      },
      'faAasCheckbox': function (newVal, oldVal) {
        newVal ? this.addParametersUsingMethod('FA-AAS') : this.deleteParametersUsingMethod('FA-AAS');
      },
      'icpOesCheckbox': function (newVal, oldVal) {
        newVal ? this.addParametersUsingMethod('ICP-OES') : this.deleteParametersUsingMethod('ICP-OES');
      },
      'lecoCheckbox': function (newVal, oldVal) {
        newVal ? this.addParametersUsingMethod('Leco') : this.deleteParametersUsingMethod('Leco');

      },
      'xrfCheckbox': function (newVal, oldVal) {
        newVal ? this.addParametersUsingMethod('XRF') : this.deleteParametersUsingMethod('XRF');
      }
    },

    created: function () {
      this.getDrillcoreName(this.drillcoreId);

      if (this.$session.exists() && this.$session.get('drillcore_data/' + this.drillcoreId) != null) {
        const dataToImport = this.$session.get('drillcore_data/' + this.drillcoreId);

        this.searchParameters = dataToImport.searchParameters;
        this.currentlyShownParameters = dataToImport.currentlyShownParameters;
      } else {
        this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
      }

      setTimeout(function () { this.showLabel = false }.bind(this), 2000);
    },

    updated: function () {
      $('#table-search').floatThead('reflow');
      this.addFloatingTableHeaders();
      this.addResponsiveDesignToCheckboxes()
    },

    beforeDestroy: function () {
      const dataToExport = {
        searchParameters: this.searchParameters,
        currentlyShownParameters: this.currentlyShownParameters
      }
      this.$session.set('drillcore_data/' + this.drillcoreId, dataToExport);
    },

    methods: {

      getAnalysisSummary(id, searchParams) {
        this.$http.jsonp('https://api.eurocore.rocks/analysis_summary/', {params: {drillcore_id: id, page: searchParams.page, paginate_by: searchParams.paginateBy, order_by: searchParams.orderBy, format: 'jsonp'}}).then(response => {
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
        this.$http.jsonp('https://api.eurocore.rocks/drillcore/' + id, {params: {fields: 'name,deposit__main_commodity', format: 'jsonp'}}).then(response => {
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

      populateParameters(id) {
        this.$http.jsonp('https://api.eurocore.rocks/drillcore/' + id, {params: {fields: 'name,analysis__analysisresult__parameter__parameter,analysis__analysisresult__unit__unit,analysis__analysis_method__method', distinct: 'true', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            const allParameters = response.body.results;

            this.addMethodCheckboxes(allParameters);

            for (const i in allParameters) {
              if (this.areParametersEligible(allParameters[i])) {
                this.parameters.push(this.getCorrectParameterFormat(allParameters[i]));


                if (this.drillcoreName[0].deposit__main_commodity !== null || this.drillcoreName[0].deposit__main_commodity !== '') { // Populates default commodities
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

      changeOrder(orderValue, event) {
        if (this.searchParameters.orderBy === orderValue) {
          if (orderValue.charAt(0) !== '-') {
            orderValue = '-' + orderValue;
          } else {
            orderValue = orderValue.substring(1);
          }
        }
        this.searchParameters.page = 1;
        this.searchParameters.orderBy = orderValue;
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
      },

      openChart() {
        this.isChartOpen = true;
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
          zIndex: 1090,
          top: 98 // headers height
        });
      },

      addResponsiveDesignToCheckboxes() {
        $('#checkboxGroup').find('div').addClass('mr-0 col-6 col-sm-4 col-md-3 col-lg-2 text-center')
      },

      addMethodCheckboxes(parameters) {
        for (const param in parameters) {
          if (parameters[param].analysis__analysisresult__parameter__parameter !== null
            && parameters[param].analysis__analysisresult__unit__unit !== null
            && parameters[param].analysis__analysis_method__method !== null
            && parameters[param].analysis__analysis_method__method) {

            let method = parameters[param].analysis__analysis_method__method;
            // if (!this.listOfAvailableMethods.includes(method)) {
              // this.listOfAvailableMethods.push(method);

              if (method === 'CT') {
                this.ctExists = true
              } else if (method === 'FA-AAS') {
                this.faAasExists = true
              } else if (method === 'ICP-OES') {
                this.icpOesExists = true
              } else if (method === 'Leco') {
                this.lecoExists = true
              } else if (method === 'XRF') {
                this.xrfExists = true
              }


            // }
          }
        }
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

      deleteParametersUsingMethod(methodName) {
        let i = this.currentlyShownParameters.length;
        while (i--) {
          if (this.currentlyShownParameters[i].includes(methodName)) {
            this.currentlyShownParameters.splice(i, 1);
          }
        }
      },

      resetData() {
        this.showLabel = true;
        this.searchParameters = {
          page: 1,
          paginateBy: 250,
          orderBy: 'depth'
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
        this.ctExists =  false;
        this.faAasExists = false;
        this.icpOesExists = false;
        this.lecoExists = false;
        this.xrfExists = false;
        this.ctCheckbox = false;
        this.faAasCheckbox = false;
        this.icpOesCheckbox = false;
        this.lecoCheckbox = false;
        this.xrfCheckbox = false;
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

  .th-sort > th > span {
    cursor: pointer;
  }

  .th-sort > th > span:hover {
    color: #000;
    /*opacity: 0.6;*/
  }

  .error-text {
    font-size: 1.5rem;
    padding: 10% 0;
  }

  span {
    white-space: nowrap;
  }

</style>
