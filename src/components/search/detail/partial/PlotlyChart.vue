<template>
  <div>
    <div ref="coreboxChart" class="mt-3">
      <!-- Chart is drawn here -->
    </div>

    <div class="row image-container">
      <div class="col mt-3 mb-3 test">
        IMAGE HERE
        <!--TODO: Image(s) here-->
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    props: ['results', 'parameters', 'name'],
    name: "plotly-chart",
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
            domain: [0.05, 0.95],
            linecolor: 'black',
            linewidth: 1,
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

        const WIDTH_IN_PERCENT_OF_PARENT = 100, HEIGHT_IN_PERCENT_OF_PARENT = WIDTH_IN_PERCENT_OF_PARENT / 3 * 2;

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
      }

    }
  }
</script>

<style scoped>
  .image-container {
    margin: 0 auto;
    width: 89.5%;
  }

  .test {
    height: 40px;
    background-color: grey;
    text-align: center;
  }

</style>
