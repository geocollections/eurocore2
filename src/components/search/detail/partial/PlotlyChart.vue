<template>
  <div>
    <div ref="coreboxChart" class="mt-3">
      <!-- Chart is drawn here -->
    </div>

    <div class="row images-container">
      <div class="col mt-3 mb-3 test">

        <!--TODO: Image(s) here-->
        <div class="test" v-if="response.count > 0">
          <img width="100%" :src="buildImageUrl(150, response.results[0].image__url)"/>
        </div>

      </div>
    </div>

    <div class="row">
      <div class="col">
        <span style="float: left; font-size: 25px">{{xMin}}</span>
        <span style="float: right; font-size: 25px">{{xMax}}</span>
      </div>
    </div>


  </div>

</template>

<script>
  export default {
    props: ['results', 'parameters', 'name', 'drillcoreId'],

    name: "plotly-chart",

    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/drillcore_interval/',
        xMin: 0,
        xMax: 0,
        response: {
          count: 0,
          results: []
        },
        locationHref: false
      }
    },

    created: function () {
      this.getFirstAndLastDepth(this.results);

      if (typeof (this.drillcoreId) !== 'undefined') {
        this.getImages(this.results);
      }

    },

    mounted: function () {
      window.addEventListener('resize', this.onResize);
      if (this.parameters.length > 0) {

        this.drawChart(this.results, this.parameters, this.name);
      }
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.onResize);
    },
    watch: {
      'parameters': function () {
        this.drawChart(this.results, this.parameters, this.name);
      },
      'results': function () {
        this.drawChart(this.results, this.parameters, this.name);
        this.getFirstAndLastDepth(this.results);
      },
      'drillcoreId': function (newVal, oldVal) {
        if (typeof (newVal) !== 'undefined') {
          this.getImages(this.results);
        }
      }
    },
    methods: {

      onResize(event) {
        event.preventDefault();
        Plotly.Plots.resize(this.$refs.coreboxChart);
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

      drawChart(results, parameters, boxName) {
        let data = [];

        for (const parameter in parameters) {
          let x = [];
          let y = [];
          let name = parameters[parameter]

          for (const result in results) {

            if (results[result].analysis_method !== null) {
              if (parameters[parameter].includes(results[result].analysis_method)) {
                const name = this.formatParameterForTableData(parameters[parameter]);

                if (results[result][name]) {
                  if (results[result].depth != null && results[result].end_depth != null) {
                    let medianDepth = (results[result].depth + results[result].end_depth) / 2;
                    x.push(medianDepth);
                  } else {
                    x.push(results[result].depth);
                  }
                  y.push(results[result][name]);
                }

              }
            } else {
              const name = this.formatParameterForTableData(parameters[parameter]);

              if (results[result][name] !== null) {
                if (results[result].depth != null && results[result].end_depth != null) {
                  const medianDepth = (results[result].depth + results[result].end_depth) / 2;
                  x.push(medianDepth);
                } else {
                  x.push(results[result].depth);
                }
                y.push(results[result][name]);
              }

            }
          }

          if (name.includes('ppm')) {
            data.push({
              x,
              y,
              type: 'scatter',
              mode: 'lines+markers',
              name: name,
              yaxis: 'y2',
            })
          }
          else {
            data.push({
              x,
              y,
              type: 'scatter',
              mode: 'lines+markers',
              name: name
            })
          }
        }

        let layout = {
          autosize: true,
          showlegend: true,
          dragmode: 'pan',
          margin: {
            l: 10,
            r: 10,
            b: 40,
            t: 120,
            pad: 4
          },
          title: boxName,
          legend: {
            x: 0,
            y: 1.1,
            "orientation": "h",
          },
          xaxis: {
            title: 'Depth',
            titlefont: {
              size: 18,
              color: '#004393'
            },
            domain: [0.05, 0.95],
            linecolor: 'black',
            linewidth: 1,
            autotick: true,
            ticks: "outside",
            ticklen: 5,
            tickwidth: 1,
            tickcolor: 'black',
          },
          yaxis: {
            side: 'left',
            title: '%',
            titlefont: {
              size: 18,
              color: '#004393'
            },
            linecolor: 'black',
            linewidth: 1,
            mirror: true,
            autotick: true,
            ticks: "outside",
            ticklen: 5,
            tickwidth: 1,
            tickcolor: 'black',
            fixedrange: true,
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
            fixedrange: true,
          }
        };

        let d3 = Plotly.d3;

        const WIDTH_IN_PERCENT_OF_PARENT = 100;
        let HEIGHT_IN_PERCENT_OF_PARENT = WIDTH_IN_PERCENT_OF_PARENT / 3 * 2;

        if (window.matchMedia("(max-height: 550px)").matches) {
          HEIGHT_IN_PERCENT_OF_PARENT = 100;
        }

        let gd3 = d3.select(this.$refs.coreboxChart).style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
          });

        let gd = gd3.node();

        Plotly.newPlot(gd, data, layout,
          {
            scrollZoom: true,
            modeBarButtonsToRemove: ['toImage'],
            modeBarButtonsToAdd: [{
              name: 'Download plot as a SVG',
              icon: Plotly.Icons.camera,
              click: function (gd) {

                Plotly.downloadImage(gd, { filename: boxName, format: 'svg', height: 600, width: 900 })
              }
            }],
            displaylogo: false
          }
        );

        this.$refs.coreboxChart.on('plotly_relayout', this.getPlotlyRanges)

      },

      getPlotlyRanges(eventData) {
        console.log(eventData)
        for (const key in eventData) {

          if (key === 'xaxis.range[0]') {
            this.xMin = eventData[key].toFixed(1)
          }

          if (key === 'xaxis.range[1]') {
            this.xMax = eventData[key].toFixed(1)
          }

          if (key === 'xaxis.autorange') {
            this.getFirstAndLastDepth(this.results);
          }
        }
      },


      /************************
       *** IMAGE CODE START ***
       ************************/
      getImages() {
        console.log(this.drillcoreId)
        this.$http.jsonp(this.API_URL, {params: {drillcore__id: this.drillcoreId, format: 'jsonp'}}).then(response => {
          console.log(response);
          if (response.status === 200) {
            this.response.count = response.body.count;
            this.response.results = response.body.results;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      buildImageUrl(size, url) {
        if (url != null) {
          return 'https://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
        }
      },

      getFirstAndLastDepth(results) {
        this.getFirstDepth(results);
        this.getLastDepth(results);
      },

      getFirstDepth(results) {
        let lowest = Number.POSITIVE_INFINITY;
        for (let i = 0; i < results.length; i++) {
          let tmp = results[i].depth;
          if (tmp < lowest) lowest = tmp;
        }
        this.xMin = lowest
      },

      getLastDepth(results) {
        let highest = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < results.length; i++) {
          let tmp = results[i].depth;
          if (tmp > highest) highest = tmp;
        }
        this.xMax = highest;
      },
      /************************
       ***  IMAGE CODE END  ***
       ************************/

    }
  }
</script>

<style scoped>
  .images-container {
    margin: 0 auto;
    width: 89.5%;
  }

  .test {
    padding: 0;
  }

</style>
