<template>
  <div v-if="corebox != null">

    <div class="row">
      <div class="col">
        <h2>Box: {{corebox[0].number}}</h2>
      </div>
    </div>


    <div class="row">
      <div class="col-6">
        <table class="table table-bordered table-hover th-styles">
          <tr>
            <td>ID</td>
            <td>{{corebox[0].id}}</td>
          </tr>

          <tr>
            <td>Drillcore</td>
            <td>{{corebox[0].drillcore__name}}</td>
          </tr>

          <tr>
            <td>Depth form (m)</td>
            <td>{{corebox[0].start_depth}}</td>
          </tr>

          <tr>
            <td>Depth to (m)</td>
            <td>{{corebox[0].end_depth}}</td>
          </tr>
        </table>
      </div>
    </div>


    <div class="row mt-2 mb-3">
      <div class="col">
        <a :href="'http://eurocore.rocks/' + corebox[0].image__url" target="_blank">
          <img width="100%" :src="buildCoreboxUrl('2000', corebox[0].image__url)" />
        </a>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <b-tabs>
          <b-tab v-if="response.sample.count > 0" :title="'Samples (' + response.sample.count + ')'">
            <sample :results="response.sample.results"></sample>
          </b-tab>

          <b-tab v-if="response.analysis.count > 0" :title="'Analyses (' + response.analysis.count + ')'">
            <!--TODO: make that into analysis_summary-->
            <analysis :results="response.analysis.results"></analysis>
          </b-tab>

          <b-tab v-if="response.analysis_summary.count > 0" title="Graph" @click="openGraph()">
            <div ref="coreboxGraph" class="mt-3">
              <!-- Graph is drawn here -->
            </div>
          </b-tab>

          <b-tab v-if="response.reference.count > 0" :title="'References (' + response.reference.count + ')'">
            <!--<reference :results="response.reference.results"></reference>-->
          </b-tab>

        </b-tabs>
      </div>
    </div>

  </div>
  <div v-else>
    Sorry but we didn't find any results!
    Check your id <b>{{id}}</b>
  </div>
</template>

<script>
  import Sample from './tables/Sample';
  import Analysis from './tables/Analysis'
  // import Reference from './tables/Reference'

  export default {
    components: {
      Sample,
      Analysis,
      // Reference
    },
    props: ['id'],
    name: "corebox-detail",
    data() {
      return {
        API_URL: 'http://api.eurocore.rocks/drillcore_box/',
        corebox: null,
        parameters: [],
        isGraphOpen: false,
        response: {
          sample: { count: 0, results: [] },
          analysis: { count: 0, results: [] },
          analysis_summary: { count: 0, results: [] },
          reference: { count: 0, results: [] },
          attachment_link: { count: 0, results: [] },
        },
      }
    },
    watch: {
      'id': function () {
        this.getCoreboxById(this.id);
      },
      'corebox': function () {
        this.getCoreboxDataByDepth('sample', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
        this.getCoreboxDataByDepth('analysis', this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
        this.getAnalysisSummary(this.corebox[0].drillcore__id, this.corebox[0].start_depth, this.corebox[0].end_depth);
        this.getAllParameters();
        if (this.parameters.length > 0) {
          this.drawGraph(this.response.analysis_summary.results, this.parameters);
        }
      }
    },
    created: function () {
      this.getCoreboxById(this.id);
    },
    methods: {
      getCoreboxById(id) {
        this.$http.jsonp(this.API_URL + id, {params: {format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.corebox = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        });
      },

      getCoreboxDataByDepth(table, drillcoreId, startDepth, endDepth) {
        this.$http.jsonp('http://api.eurocore.rocks/' + table + '/', {params: {drillcore__id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response[table].count = response.body.count;
            this.response[table].results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getAnalysisSummary(drillcoreId, startDepth, endDepth) {
        this.$http.jsonp('http://api.eurocore.rocks/analysis_summary/', {params: {drillcore_id: drillcoreId, or_search: 'depth__range:' + startDepth + ',' + endDepth + ';end_depth__range:' + startDepth + ',' + endDepth, order_by: 'depth', format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.analysis_summary.count = response.body.count;
            this.response.analysis_summary.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },

      getAllParameters() {
        this.$http.jsonp('http://api.eurocore.rocks/analysis_result/' , {params: {format: 'jsonp', distinct: 'true', order_by: 'parameter__parameter', fields: 'parameter__parameter,unit__unit'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.parameters = response.body.results;
            for (const i in this.parameters) {
              this.parameters[i].formattedValue = this.getCorrectParameterFormat(this.parameters[i]);
            }
          }
          console.log(this.parameters)
        }, errResponse => {
          console.log('ERROR: ');
          console.log(errResponse);
        })
      },

      getCorrectParameterFormat(param) {
        if (param !== 'undefined') {
          let firstHalf = param.parameter__parameter.toLowerCase();
          let secondHalf = param.unit__unit.toLowerCase();
          if (secondHalf === '%') {
            secondHalf = 'pct';
          }
          return firstHalf + '_' + secondHalf;
        }
      },

      buildCoreboxUrl(size, url) {
        return 'http://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
      },

      openGraph() {
        this.isGraphOpen = true;
        this.drawGraph(this.response.analysis_summary.results, this.parameters);
      },

      drawGraph(results, parameters) {
        let data = [];
        const graphName = this.corebox[0].number;

        for (const parameter in parameters) {
          let x = [];
          let y = [];
          const name = parameters[parameter].parameter__parameter + ' ' + parameters[parameter].unit__unit
          const fieldName = parameters[parameter].formattedValue;

          for (const result in results) {
            // if (results[result].analysis_method) {
            //
            //   if (parameters[parameter].includes(results[result].analysis_method)) {
            //
            //     if (results[result][name]) {
            //       x.push(results[result].depth);
            //       y.push(results[result][name]);
            //     }
            //   }
            // } else {

              if (results[result][fieldName]) {
                x.push(results[result].depth);
                y.push(results[result][fieldName]);
              }
            // }
          }

          if (parameters[parameter].formattedValue.includes('ppm')) {
            data.push({
              x,
              y,
              type: 'scattergl',
              mode: 'lines+markers',
              name: name,
              yaxis: 'y2',
            })
          }
          else {
            data.push({
              x,
              y,
              type: 'scattergl',
              mode: 'lines+markers',
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

        let gd3 = d3.select(this.$refs.coreboxGraph)
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
  .th-styles tr td:first-child {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
    font-weight: bold;
  }

  #overlay{
    margin-top: 20px;
    border:1px solid black;
    width:100%;
    height:250px;
    display:inline-block;
    background-repeat:no-repeat;
  }
</style>
