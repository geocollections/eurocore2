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
            v-model="searchParameters.drillcoreNames"
            :options="drillcoreNames"
            :multiple="true"
            track-by="name"
            :custom-label="customLabelForDrillcores"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Analytical method(s)</label>
          <vue-multiselect
            v-model="searchParameters.analyticalMethods"
            :options="analyticalMethods"
            :multiple="true"
            track-by="analysis_method"
            :custom-label="customLabelForAnalysis"></vue-multiselect>
        </div>

        <div class="form-group">
          <label>Show parameter(s)</label>
          <vue-multiselect
            v-model="currentlyShownParameters"
            :options="showParameters"
            :multiple="true"
            track-by="parameter__parameter"
            :custom-label="customLabelForParameters"></vue-multiselect>
        </div>
      </div>
    </div>


    <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" @click="searchEntities(searchParameters)">SEARCH</button>
          </span>

      <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
          </span>
    </div>


    <div class="row">
      <div class="col">
        <p v-if="response.results != ''">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
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
              <!--TODO: should chagen to drillcore name-->
              <th><span @click="changeOrder('drillcore_id')">Drillcore</span></th>
              <th><span @click="changeOrder('depth')">Depth from (m)</span></th>
              <th><span @click="changeOrder('end_depth')">Depth to (m)</span></th>
              <th><span @click="changeOrder('sample_number')">Sample</span></th>
              <th><span @click="changeOrder('analysis_id')">Analysis ID</span></th>
              <th><span @click="changeOrder('analysis_method')">Method</span></th>
              <th v-for="parameter in currentlyShownParameters">{{parameter.parameter__parameter + ' ' + parameter.unit__unit}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="entity in response.results">
              <td>
                <!--TODO: change to drillcore name-->
                <router-link :to="{ path: '/drillcore/' + entity.drillcore_id }">{{entity.drillcore_id}}</router-link>
              </td>
              <td>{{entity.depth}}</td>
              <td>{{entity.end_depth}}</td>
              <td>
                <!--TODO: fix opening in new window-->
                <router-link :to="{ path: '/sample/' + entity.sample_id }">{{entity.sample_number}}</router-link>
                <!--<a href @click="openInNewWindow({object: 'sample', id: entity.sample_id})" >{{entity.sample_number}}</a>-->
              </td>
              <td>
                <router-link :to="{ path: '/analysis/' + entity.analysis_id }">{{entity.analysis_id}}</router-link>
                <!--<a href @click="openInNewWindow({object: 'analysis', id: entity.analysis_id})" >{{entity.analysis_id}}</a>-->
              </td>
              <td>{{entity.analysis_method}}</td>
              <td v-for="parameterResult in currentlyShownParameters">{{entity[parameterResult.formattedValue]}}</td>
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

    export default {
      components: {VueMultiselect},
      name: "data-search",
      data() {
        return {
          API_URL: 'http://api.eurocore.rocks/',
          searchParameters: {
            drillcoreNames: [],
            analyticalMethods: [],
            // showParameters: [],
            page: 1,
            paginateBy: 100,
            orderBy: 'id',
          },
          response: {
            count: 0,
            results: []
          },
          drillcoreNames: [],
          analyticalMethods: [],
          showParameters: [],
          currentlyShownParameters: [],
          paginationOptions: [
            { value: 10, text: 'Show 10 results per page' },
            { value: 25, text: 'Show 25 results per page' },
            { value: 50, text: 'Show 50 results per page' },
            { value: 100, text: 'Show 100 results per page' },
            { value: 250, text: 'Show 250 results per page' },
            { value: 500, text: 'Show 500 results per page' },
            { value: 1000, text: 'Show 1000 results per page' }
          ]
        }
      },
      computed: {

      },
      watch: {
        'searchParameters': {
          handler: function () {
            this.searchEntities(this.searchParameters);
          },
          deep: true
        },
        'currentlyShownParameters': function () {
          console.log('higgrgrgr')
        }
      },
      methods: {
        searchEntities(params) {
          console.log(params);
          let url = this.buildSearchUrl(params);

          this.$http.jsonp(url , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
            console.log(response);

            this.response.count = response.body.count;
            this.response.results = response.body.results;

          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
            this.$router.push('/404/')
          })
        },

        buildSearchUrl(params) {
          let url = this.API_URL + '/analysis_summary/?';
          Object.keys(params).forEach(function (key) {
            // console.log(key + ' ' + params[key]);
            if (key === 'drillcoreNames' && params[key].length > 0) {
              console.log('DRILLCORE');
              if (params[key].length > 1) {
                url += 'drillcore_id__in=';
              } else {
                url += 'drillcore_id=';
              }

              for (const drillcore in params[key]) {
                url += params[key][drillcore].id + ',';
              }

              url = url.slice(0, -1);
              url += '&';
            }
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
          });

          if (url.slice(-1) === '?') {
            url = this.API_URL + '/analysis_summary/'
          }
          if (url.slice(-1) === '&') {
            url = url.slice(0, -1);
          }

          return url;
        },

        populateDrillcoreNames() {
          this.$http.jsonp(this.API_URL + 'drillcore' , {params: {format: 'jsonp', fields: 'id,name'}}).then(response => {
            console.log(response);

            this.drillcoreNames = response.body.results;
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateAnalyticalMethods() {
          this.$http.jsonp(this.API_URL + 'analysis_summary' , {params: {analysis_method__isnull: 'false', distinct: 'true', format: 'jsonp', fields: 'analysis_method'}}).then(response => {
            console.log(response);

            this.analyticalMethods = response.body.results;
          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
          })
        },

        populateShowParameters() {
          this.$http.jsonp(this.API_URL + 'analysis_result' , {params: {format: 'jsonp', distinct: 'true', order_by: 'parameter__parameter', fields: 'parameter__parameter,unit__unit'}}).then(response => {
            console.log(response);

            this.showParameters = response.body.results;
            for (const i in this.showParameters) {
              this.showParameters[i].formattedValue = this.getCorrectParameterFormat(this.showParameters[i]);
            }
            // console.log(this.showParameters)
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

        customLabelForDrillcores(option) {
          return `${option.name}`
        },

        customLabelForAnalysis(option) {
          return `${option.analysis_method}`
        },

        customLabelForParameters(option) {
          return `${option.parameter__parameter} ${option.unit__unit}`
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
          console.log(this.searchParameters);
          this.searchParameters =
            {
              drillcoreNames: [],
              analyticalMethods: [],
              showParameters: [],
              page: 1,
              paginateBy: 100,
              orderBy: 'id',
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
          this.searchEntities(this.searchParameters)
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

  .hide-column {
    display: none;
  }

</style>
