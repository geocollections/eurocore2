<template>
  <div>
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
            label="name"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Analytical method(s)</label>
          <vue-multiselect
            v-model="searchParameters.watched.analyticalMethods"
            :options="analyticalMethods"
            :multiple="true"
            track-by="analysis_method"
            label="analysis_method"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Show parameter(s)</label>
          <vue-multiselect
            v-model="searchParameters.currentlyShownParameters"
            :options="showParameters"
            :multiple="true"
            track-by="formattedValue"
            :custom-label="customLabelForParameters"></vue-multiselect>
        </div>

        <label>Parameter filter</label>
        <div class="form-group" v-for="(item, key) in numOfComparableParameters">
          <div class="input-group">
            <b-form-select v-model="searchParameters.watched.comparableParameter[key]" >
              <option v-for="parameter in showParameters" :value="parameter.formattedValue">{{parameter.parameter__parameter}} {{parameter.unit__unit}}</option>
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
        <b-dropdown text="EXPORT" variant="primary">
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              name="dataSearch.xls">Export to XLS</export-button>
          </b-dropdown-item>
          <b-dropdown-item>
            <export-button
              :data="response.results"
              :fields="exportFields"
              type="csv"
              name="dataSearch.csv">Export to CSV</export-button>
          </b-dropdown-item>
        </b-dropdown>
      </div>

      <div class="col">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.watched.page" :per-page="searchParameters.watched.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <div class="table-responsive">
          <table class="table table-hover table-bordered ">
            <thead class="thead-light">
              <tr class="th-sort">
                <th><span v-b-tooltip.hover.bottom title="Order by Drillcore" @click="changeOrder('drillcore_name')">Drillcore</span></th>
                <th><span v-b-tooltip.hover.bottom title="Order by Depth from (m)"  @click="changeOrder('depth')">Depth from (m)</span></th>
                <th><span v-b-tooltip.hover.bottom title="Order by Depth to (m)"  @click="changeOrder('end_depth')">Depth to (m)</span></th>
                <th><span v-b-tooltip.hover.bottom title="Order by Sample" @click="changeOrder('sample_number')">Sample</span></th>
                <th><span v-b-tooltip.hover.bottom title="Order by Analysis ID" @click="changeOrder('analysis_id')">Analysis ID</span></th>
                <th><span v-b-tooltip.hover.bottom title="Order by Method" @click="changeOrder('analysis_method')">Method</span></th>
                <th v-for="parameter in searchParameters.currentlyShownParameters"><span  v-b-tooltip.hover.bottom :title="'Order by ' + parameter.parameter__parameter + ' ' + parameter.unit__unit" @click="changeOrder(parameter.formattedValue)">{{parameter.parameter__parameter + ' ' + parameter.unit__unit}}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="response.count === 0 || response.count === undefined"><br></tr> <!-- Adds empty line so title can fit -->
              <tr v-for="entity in response.results">
                <td>
                  <!--TODO: fix opening in new window maybe by creating new Vue-->
                  <router-link :to="{ path: '/drillcore/' + entity.drillcore_id }">{{entity.drillcore_name}}</router-link>
                </td>
                <td>{{entity.depth}}</td>
                <td>{{entity.end_depth}}</td>
                <td>
                  <!--TODO: fix opening in new window maybe by creating new Vue-->
                  <router-link :to="{ path: '/sample/' + entity.sample_id }">{{entity.sample_number}}</router-link>
                  <!--<a href @click="openInNewWindow({object: 'sample', id: entity.sample_id})" >{{entity.sample_number}}</a>-->
                </td>
                <td>
                  <router-link :to="{ path: '/analysis/' + entity.analysis_id }">{{entity.analysis_id}}</router-link>
                  <!--<a href @click="openInNewWindow({object: 'analysis', id: entity.analysis_id})" >{{entity.analysis_id}}</a>-->
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
    import VueMultiselect from "vue-multiselect/src/Multiselect";
    import ExportButton from 'vue-json-excel'

    export default {
      components: {
        VueMultiselect,
        ExportButton
      },
      name: "data-search",
      data() {
        return {
          API_URL: 'https://api.eurocore.rocks/',
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
            currentlyShownParameters: [
              { parameter__parameter: 'Au', unit__unit: 'ppm', formattedValue: 'au_ppm' },
              { parameter__parameter: 'Co', unit__unit: '%', formattedValue: 'co_pct' },
              { parameter__parameter: 'Co', unit__unit: 'ppm', formattedValue: 'co_ppm' },
              { parameter__parameter: 'Cu', unit__unit: '%', formattedValue: 'cu_pct' },
              { parameter__parameter: 'Cu', unit__unit: 'ppm', formattedValue: 'cu_ppm' },
              { parameter__parameter: 'Fe', unit__unit: '%', formattedValue: 'fe_pct' },
              { parameter__parameter: 'Ni', unit__unit: '%', formattedValue: 'ni_pct' },
              { parameter__parameter: 'Ni', unit__unit: 'ppm', formattedValue: 'ni_ppm' },
              { parameter__parameter: 'S', unit__unit: '%', formattedValue: 's_pct' },
              { parameter__parameter: 'Zn', unit__unit: '%', formattedValue: 'zn_pct' },
              { parameter__parameter: 'Zn', unit__unit: 'ppm', formattedValue: 'zn_ppm' },
            ],
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
          exportFields: {
            'Drillcore': 'drillcore_name',
            'Depth from (m)': 'depth',
            'Depth to (m)': 'end_depth',
            'Sample': 'sample_number',
            'Analysis ID': 'analysis_id',
            'Method': 'analysis_method',
            'Au ppm': 'au_ppm',
            'Co %': 'co_pct',
            'Co ppm': 'co_ppm',
            'Cu %': 'cu_pct',
            'Cu ppm': 'cu_ppm',
            'Fe %': 'fe_pct',
            'Ni %': 'ni_pct',
            'Ni ppm': 'ni_ppm',
            'S %': 's_pct',
            'Zn %': 'zn_pct',
            'Zn ppm': 'zn_ppm',
          },
        }
      },
      watch: {
        'searchParameters.watched': {
          handler: function () {
            this.searchEntities(this.searchParameters.watched);
          },
          deep: true
        },
        'searchParameters.currentlyShownParameters': function () {
          console.log(this.searchParameters.currentlyShownParameters)
          console.log(this.showParameters)
          console.log('higgrgrgr')
        },
        // 'searchParameters.comparableParameter': function (n,o) {
        //   console.log(this.searchParameters.comparableParameter);
        //   console.log(n + ' ' + o)
        // },
        // 'searchParameters.comparableParameterOperator': function (n,o) {
        //   console.log(this.searchParameters.comparableParameterOperator);
        //   console.log(n + ' ' + o)
        // },
        // 'searchParameters.comparableParameterValue': function (n,o) {
        //   console.log(this.searchParameters.comparableParameterValue);
        //   console.log(n + ' ' + o)
        // },
      },
      methods: {
        searchEntities(params) {
          console.log(params);
          let url = this.buildSearchUrl(params);

          this.$http.jsonp(url , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.response.count = response.body.count;
              this.response.results = response.body.results;
            }
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
            this.$router.push('/404/')
          })
        },

        buildSearchUrl(params) {
          let url = this.API_URL + '/analysis_summary/?';
          Object.keys(params).forEach(function (key) {
            console.log(key + ' ' + params[key]);
            // TODO: Should optimise this block | START
            if (key === 'drillcoreNames' && params[key].length > 0) {
              console.log('DRILLCORE');
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
              console.log('ANALYTICAL');
              if (params[key].length > 1) {
                url += 'analysis_method__in=';
              } else {
                url += 'analysis_method=';
              }

              for (const analysis in params[key]) {
                url += params[key][analysis].analysis_method + ',';
              }

              url = url.slice(0, -1);
              url += '&';
            }

            if (key === 'comparableParameter') {
              console.log('COMPARABLE');
              console.log(params[key]);
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

          return url;
        },


        // TODO: Make these 3 run after each change to be dependent on each other + that needs url builder methods.
        populateDrillcoreNames() {
          this.$http.jsonp(this.API_URL + 'drillcore' , {params: {format: 'jsonp', fields: 'id,name'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.drillcoreNames = response.body.results;
            }
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateAnalyticalMethods() {
          this.$http.jsonp(this.API_URL + 'analysis_summary' , {params: {analysis_method__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'analysis_method'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.analyticalMethods = response.body.results;
            }
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateShowParameters() {
          this.$http.jsonp(this.API_URL + 'analysis_result' , {params: {format: 'jsonp', distinct: 'true', order_by: 'parameter__parameter', fields: 'parameter__parameter,unit__unit'}}).then(response => {
            console.log(response);
            if (response.status === 200) {
              this.showParameters = response.body.results;
              for (const i in this.showParameters) {
                this.showParameters[i].formattedValue = this.getCorrectParameterFormat(this.showParameters[i]);
              }
            }
            console.log(this.showParameters)
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        getCorrectParameterFormat(param) {
          // console.log(param);
          if (param !== 'undefined') {
            let unformattedParam = param;
            let firstHalf = unformattedParam.parameter__parameter.toLowerCase();
            let secondHalf = unformattedParam.unit__unit.toLowerCase();
            if (secondHalf === '%') {
              secondHalf = 'pct';
            }
            // console.log(firstHalf + '_' + secondHalf);
            return firstHalf + '_' + secondHalf;
          }
        },

        customLabelForParameters(option) {
          return `${option.parameter__parameter} ${option.unit__unit}`
        },

        // TODO: Make order changing responsive + order should be object like sortField: { order: 'fields', direction: 'ASC' }
        changeOrder(orderValue) {
          orderValue = orderValue.toLowerCase();
          if (this.searchParameters.watched.orderBy === orderValue) {
            if (orderValue.charAt(0) !== '-') {
              orderValue = '-' + orderValue;
            } else {
              orderValue = orderValue.substring(1);
            }
          }
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
              currentlyShownParameters: [
                { parameter__parameter: 'Au', unit__unit: 'ppm', formattedValue: 'au_ppm' },
                { parameter__parameter: 'Co', unit__unit: '%', formattedValue: 'co_pct' },
                { parameter__parameter: 'Co', unit__unit: 'ppm', formattedValue: 'co_ppm' },
                { parameter__parameter: 'Cu', unit__unit: '%', formattedValue: 'cu_pct' },
                { parameter__parameter: 'Cu', unit__unit: 'ppm', formattedValue: 'cu_ppm' },
                { parameter__parameter: 'Fe', unit__unit: '%', formattedValue: 'fe_pct' },
                { parameter__parameter: 'Ni', unit__unit: '%', formattedValue: 'ni_pct' },
                { parameter__parameter: 'Ni', unit__unit: 'ppm', formattedValue: 'ni_ppm' },
                { parameter__parameter: 'S', unit__unit: '%', formattedValue: 's_pct' },
                { parameter__parameter: 'Zn', unit__unit: '%', formattedValue: 'zn_pct' },
                { parameter__parameter: 'Zn', unit__unit: 'ppm', formattedValue: 'zn_ppm' },
              ],
            };
          console.log(this.searchParameters);
        },

        openInNewWindow(params) {
          let width = 600;
          window.open('#/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750,scrollbars,resizable');
        }
      },
      created: function () {
        this.populateDrillcoreNames();
        this.populateAnalyticalMethods();
        this.populateShowParameters();

        // TODO: Params should come from URL if exists
        // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
        if (this.$session.exists() && this.$session.get('dataSearch') != null) {
          this.searchParameters = this.$session.get('dataSearch');
        } else {
          this.searchEntities(this.searchParameters.watched)
        }
      },
      beforeDestroy: function () {
        this.$session.set('dataSearch', this.searchParameters);
      }
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
    /*opacity: 0.6;*/
  }

  .button-right {
    float: right;
  }

  .export-buttons {
    text-align: right;
    margin-bottom: 1rem;
  }

  .hide-column {
    display: none;
  }

</style>
