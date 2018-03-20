<template>
  <div v-if="drillcoreName[0].name != null">
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
                             @change="toggleAllParameters">{{ allSelected ? 'Un-select All' : 'Select All' }}
            </b-form-checkbox>
            <b-form-checkbox-group v-model="currentlyShownParameters"
                                   :options="parameters"
                                   class="ml-4"
            ></b-form-checkbox-group>
          </b-form-group>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab :title="'Data (' + (response.count) + ')'" @click="isChartOpen = false">
            <div class="row mt-3">
              <div class="col-xs-1 pl-3 pr-3">
                <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
              </div>

              <div class="col mb-3" v-if="response.count > 0">
                <b-dropdown text="EXPORT" variant="primary">
                  <b-dropdown-item>
                    <export-button
                      :data="response.results"
                      :fields="exportFields"
                      name="drillcoreData.xls">Export to XLS</export-button>
                  </b-dropdown-item>
                  <b-dropdown-item>
                    <export-button
                      :data="response.results"
                      :fields="exportFields"
                      type="csv"
                      name="drillcoreData.csv">Export to CSV</export-button>
                  </b-dropdown-item>
                </b-dropdown>
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
                  <table class="table table-hover table-bordered">
                    <thead class="thead-light">
                      <tr class="th-sort">
                        <th><span v-b-tooltip.hover.bottom title="Order by Depth from (m)" @click="changeOrder('depth')">Depth from (m)</span></th>
                        <th><span v-b-tooltip.hover.bottom title="Order by Depth to (m)" @click="changeOrder('end_depth')">Depth to (m)</span></th>
                        <th><span v-b-tooltip.hover.bottom title="Order by Sample" @click="changeOrder('sample_number')">Sample</span></th>
                        <th><span v-b-tooltip.hover.bottom title="Order by Analysis" @click="changeOrder('analysis_id')">Analysis</span></th>
                        <!-- REMOVED ORDERING BECAUSE OF GRAPH MALFUNCTION <th v-for="parameter in currentlyShownParameters"><span  v-b-tooltip.hover.bottom :title="'Order by ' + parameter" @click="changeOrder(formatParameterForTableData(parameter))">{{parameter}}</span></th>-->
                        <th v-for="parameter in currentlyShownParameters">{{parameter}}</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-if="response.count === 0 || response.count === undefined"><br></tr> <!-- Adds empty line so title can fit -->
                      <tr v-for="entity in response.results">
                        <td>{{entity.depth}}</td>
                        <td>{{entity.end_depth}}</td>
                        <td>
                          <router-link :to="{ path: '/sample/' + entity.sample_id }">{{entity.sample_number}}</router-link>
                        </td>
                        <td>
                          <router-link :to="{ path: '/analysis/' + entity.analysis_id }">{{entity.analysis_id}}</router-link>
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
            <div ref="plotlyChart" class="mt-3 mb-3">
              <!-- Graph is drawn here -->
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>

  </div>
  <div v-else>
    Sorry but we didn't find any results!
    Check your id <b>{{drillcoreId}}</b>
  </div>
</template>

<script>
  import ExportButton from 'vue-json-excel';

  export default {
    components: {
      ExportButton
    },
    props: ['drillcoreId'],
    name: "drillcore-data-detail",
    data() {
      return {
        searchParameters: {
          page: 1,
          paginateBy: 250,
          orderBy: 'depth'
        },
        response: {
          count: 0,
          results: []
        },
        drillcoreName: [ { name: '' } ],
        currentlyShownParameters: [],
        parameters: [],
        allSelected: false,
        indeterminate: false,
        isChartOpen: false,
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
          'Depth from (m)': 'depth',
          'Depth to (m)': 'end_depth',
          'Sample': 'sample_number',
          'Analysis': 'analysis_id',
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
    metaInfo () {
      return {
        title: 'EUROCORE Data Portal: Drillcore Data' + this.drillcoreId
      }
    },
    watch: {
      'drillcoreId': function () {
        this.resetData();
        this.getDrillcoreName(this.drillcoreId);
        this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
        this.populateParameters(this.drillcoreId);
      },
      'searchParameters': {
        handler: function () {
          this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
        },
        deep: true
      },
      'currentlyShownParameters': function (newVal, oldVal) {
        if (this.isChartOpen) {
          this.filterChartData();
        }
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
      }
    },
    created: function () {
      this.populateParameters(this.drillcoreId);
      this.getDrillcoreName(this.drillcoreId);

      if (this.$session.exists() && this.$session.get('drillcore_data/' + this.drillcoreId) != null) {
        this.searchParameters = this.$session.get('drillcore_data/' + this.drillcoreId);
      } else {
        this.getAnalysisSummary(this.drillcoreId, this.searchParameters);
      }
    },
    beforeDestroy: function () {
      this.$session.set('drillcore_data/' + this.drillcoreId, this.searchParameters);
    },
    methods: {
      getAnalysisSummary(id, searchParams) {
        this.$http.jsonp('https://api.eurocore.rocks/analysis_summary/', {params: {drillcore_id: id, page: searchParams.page, paginate_by: searchParams.paginateBy, order_by: searchParams.orderBy, format: 'jsonp'}}).then(response => {
          console.log(response.body.results);
          if (response.status === 200) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getDrillcoreName(id) {
        this.$http.jsonp('https://api.eurocore.rocks/drillcore/' + id, {params: {fields: 'name', format: 'jsonp'}}).then(response => {
          console.log(response.body.results);
          if (response.status === 200) {
            this.drillcoreName = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      populateParameters(id) {
        this.$http.jsonp('https://api.eurocore.rocks/drillcore/' + id, {params: {fields: 'name,analysis__analysisresult__parameter__parameter,analysis__analysisresult__unit__unit,analysis__analysis_method__method', distinct: 'true', format: 'jsonp'}}).then(response => {
          console.log(response.body.results);
          if (response.status === 200) {
            const allParameters = response.body.results;
            for (const i in allParameters) {
              if (this.areParametersEligible(allParameters[i])) {
                this.parameters.push(this.getCorrectParameterFormat(allParameters[i]));
              }
            }
            console.log(this.parameters);
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
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

      toggleAllParameters(checked) {
        this.currentlyShownParameters = checked ? this.parameters.slice() : [];
      },

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

      resetData() {
        this.searchParameters = {
          page: 1,
          paginateBy: 250,
          orderBy: 'depth'
        };
        this.response = {
          count: 0,
          results: []
        };
        this.drillcoreName = [ { name: '' } ];
        this.currentlyShownParameters = [];
        this.parameters = [];
        this.allSelected = false;
        this.indeterminate = false;
      },

      openChart() {
        this.isChartOpen = !this.isChartOpen;
        this.filterChartData();
      },

      filterChartData() {
        const results = this.response.results;
        let data = [];
        const graphName = this.drillcoreName[0].name;

        for (const parameter in this.currentlyShownParameters) {
          let x = [];
          let y = [];
          const name = this.currentlyShownParameters[parameter];

          for (const result in results) {
            if (results[result].analysis_method) {

              if (this.currentlyShownParameters[parameter].includes(results[result].analysis_method)) {
                const name = this.formatParameterForTableData(this.currentlyShownParameters[parameter]);

                if (results[result][name]) {
                  x.push(results[result].depth);
                  y.push(results[result][name]);
                }
              }
            } else {
              const name = this.formatParameterForTableData(this.currentlyShownParameters[parameter]);

              if (results[result][name]) {
                x.push(results[result].depth);
                y.push(results[result][name]);
              }
            }
          }

          if (this.currentlyShownParameters[parameter].includes('ppm')) {
            data.push({
              x,
              y,
              type: 'scattergl',
              //mode: 'markers',
              mode: 'lines+markers',
              //mode: 'lines',
              name: name,
              yaxis: 'y2',
            })
          }
          else {
            data.push({
              x,
              y,
              type: 'scattergl',
              //mode: 'markers',
              mode: 'lines+markers',
              //mode: 'lines',
              name: name
            })
          }
        }

        let layout = {
          autosize: true,
          showlegend: true,
          margin: {
            l: 10,
            r: 10,
            b: 40,
            t: 120,
            pad: 4
          },
          title: graphName,
          legend: {
            x: 0,
            y: 1.1,
            "orientation": "h",
          },
          xaxis: {
            title: 'Depth',
            domain: [0.05, 0.95],
            linecolor: 'black',
            linewidth: 1,
            // mirror: true,
            autotick: true,
            ticks: "outside",
            ticklen: 5,
            tickwidth: 1,
            tickcolor: 'black'
          },
          yaxis: {
            side: 'left',
            title: '%',
            linecolor: 'black',
            linewidth: 1,
            mirror: true,
            autotick: true,
            ticks: "outside",
            ticklen: 5,
            tickwidth: 1,
            tickcolor: 'black'
          },
          yaxis2: {
            title: 'ppm',
            titlefont: { color: 'rgb(148, 103, 189)' },
            tickfont: { color: 'rgb(148, 103, 189)' },
            overlaying: 'y',
            side: 'right',
            linecolor: 'black',
            linewidth: 1,
            mirror: true,
            autotick: true,
            ticks: "outside",
            ticklen: 5,
            tickwidth: 1,
            tickcolor: 'black',
            showgrid: false,
          }
        };


        let d3 = Plotly.d3;

        const WIDTH_IN_PERCENT_OF_PARENT = 90, HEIGHT_IN_PERCENT_OF_PARENT = WIDTH_IN_PERCENT_OF_PARENT / 3 * 2;

        let gd3 = d3.select(this.$refs.plotlyChart)
        //.append('div')
          .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            //height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            //'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
          });

        let gd = gd3.node();

        //var start = window.performance.now();
        Plotly.newPlot(gd, data, layout,
          {
            modeBarButtonsToRemove: ['toImage'],
            modeBarButtonsToAdd: [{
              name: 'Download plot as a SVG',
              icon: Plotly.Icons.camera,
              click: function (gd) {

                Plotly.downloadImage(gd, { filename: graphName, format: 'svg', height: 600, width: 900 })
              }
            }],
            displaylogo: false
          }
        );
        //var end = window.performance.now();
        //console.log(end - start + 'ms');
        // let x=this.route.routeConfig.path;
        // window.onresize = function () {
        //   Plotly.Plots.resize(gd);
        // };
        Plotly.Plots.resize(gd);

        // document.getElementById("chartTabLink").addEventListener("click", function () {
        //   Plotly.Plots.resize(gd);
        // })
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

</style>
