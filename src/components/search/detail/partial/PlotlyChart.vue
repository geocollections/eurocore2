<template>
  <div>
    <div ref="coreboxChart" class="mt-3">
      <!-- Chart is drawn here -->
    </div>

    <div class="row images-container">
      <div class="col mb-3">

        <div class="row">
          <div class="col depths">
            <span class="min-depth">{{xAxis.min}}</span>
            <span class="max-depth">{{xAxis.max}}</span>
          </div>
        </div>

        <chart-images :drillcore-id="drillcoreId" :x-axis="xAxis" />

      </div>
    </div>

  </div>

</template>

<script>
  import ChartImages from './ChartImages'

  export default {
    props: ['results', 'parameters', 'name', 'drillcoreId'],

    components: { ChartImages },

    name: "plotly-chart",

    data() {
      return {
        xAxis: {
          min: 0,
          max: 0,
        },
      }
    },

    watch: {
      'parameters': function () {
        this.drawChart(this.results, this.parameters, this.name);
      },
      'results': function () {
        this.drawChart(this.results, this.parameters, this.name);
        this.getFirstAndLastDepth(this.results);
      },
    },

    created: function () {
      this.getFirstAndLastDepth(this.results);
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
        console.log(results)

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
          } else {
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
            l: 50,
            r: 50,
            b: 50,
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
          HEIGHT_IN_PERCENT_OF_PARENT = 90;
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

        this.$refs.coreboxChart.on('plotly_click', this.getClickLocation)

      },

      getPlotlyRanges(eventData) {
        // console.log(eventData)
        for (const key in eventData) {

          if (key === 'xaxis.range[0]') {
            this.xAxis.min = eventData[key].toFixed(1)
          }

          if (key === 'xaxis.range[1]') {
            this.xAxis.max = eventData[key].toFixed(1)
          }

          if (key === 'xaxis.autorange') {
            this.getFirstAndLastDepth(this.results);
          }
        }
      },

      getClickLocation(eventData) {
        console.log('click')
        console.log(eventData)
      },



      /************************
       *** GET DEPTHS START ***
       ************************/

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
        this.xAxis.min = lowest
      },

      getLastDepth(results) {
        let highest = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < results.length; i++) {
          let tmp = results[i].depth;
          if (tmp > highest) highest = tmp;
        }
        this.xAxis.max = highest;
      },

      /************************
       ***  GET DEPTHS END  ***
       ************************/



    }
  }
</script>

<style scoped>
  .images-container {
    margin: 0 auto;
    width: 89.5%;
  }

  .depths {
    margin-top: -42px
  }

  .min-depth {
    float: left;
    font-size: 15px;
    margin-left: -20px
  }

  .max-depth {
    float: right;
    font-size: 15px;
    margin-right: -20px
  }

  /*::-webkit-scrollbar {*/
    /*width: 12px;*/
    /*height: 13px;*/
  /*}*/

  /*::-webkit-scrollbar-track {*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(0,67,147,0.3);*/
    /*border-radius: 10px;*/
  /*}*/

  /*::-webkit-scrollbar-thumb {*/
    /*border-radius: 10px;*/
    /*-webkit-box-shadow: inset 0 0 6px rgba(255,255,255,0.5);*/
    /*background: rgba(0,67,147,0.7);*/
  /*}*/

  /*.draggable:hover {*/
    /*cursor: grab;*/
  /*}*/

  /*.draggable:active {*/
    /*cursor: grabbing;*/
  /*}*/

  /*.box-depths > div {*/
    /*font-weight: bold;*/
    /*font-size: large;*/
    /*color: #004393;*/
  /*}*/

  /*.corebox-image {*/
    /*!* I want to use height 20%, because then pictures won't break their dimensions*/
     /*TODO: Pictures should be in the same format (imo), also currently I can't use 150 pictures because some are missing*/
     /**!*/
    /*!*max-height: 120px;*!*/
    /*height: 15%;*/
  /*}*/
</style>
