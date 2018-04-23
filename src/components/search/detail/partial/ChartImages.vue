<template>
  <div class="row mt-2" v-show="response.count > 0 && isDepthEligibleForImage(xAxis.min, xAxis.max, 5)">
    <div class="col">
      <div id="scroll-container" v-dragscroll class="table-responsive draggable">

        <table>
          <tr>
            <td v-for="image in response.results" class="box-depths">
              <div class="row">
                <div class="col-2">{{image.start_depth.toFixed(1)}} (m)</div>
                <div class="col-2">{{ (image.start_depth + ((image.end_depth - image.start_depth) / 6)).toFixed(1) }} (m)</div>
                <div class="col-2">{{ (image.start_depth + 2 * ((image.end_depth - image.start_depth) / 6)).toFixed(1) }} (m)</div>
                <div class="col-2">{{ (image.start_depth + 3 * ((image.end_depth - image.start_depth) / 6)).toFixed(1) }} (m)</div>
                <div class="col-2">{{ (image.start_depth + 4 * ((image.end_depth - image.start_depth) / 6)).toFixed(1) }} (m)</div>
                <div class="col-2 text-right">{{image.end_depth.toFixed(1)}} (m)</div>
              </div>
            </td>
          </tr>

          <tr id="image-container">
            <td v-for="image in response.results">
              <img class="corebox-image" :src="buildImageUrl(null, image.image__url)" alt="CoreboxImage"/>
            </td>
          </tr>
        </table>

      </div>
    </div>
  </div>
</template>

<script>
  import {dragscroll} from 'vue-dragscroll'


  export default {
    props: ['drillcoreId' , 'xAxis'],

    directives: { dragscroll },

    name: "chart-images",

    data() {
      return {
        API_URL: 'https://api.eurocore.rocks/drillcore_interval/',
        response: {
          count: 0,
          results: []
        },
        middleDepth: 0,
      }
    },

    created: function () {
      if (this.isDepthEligibleForImage(this.xAxis.min, this.xAxis.max, 5)) {
        let diff = this.xAxis.max - this.xAxis.min;

        if (diff > 1) {
          this.getImages(this.xAxis.min, this.xAxis.max);
        }
      }
    },

    updated: function () {
      if (this.isDepthEligibleForImage(this.xAxis.min, this.xAxis.max, 5)) {
        let diff = this.xAxis.max - this.xAxis.min;

        if (diff <= 1) {
          this.changeHeight(250)
        } else if (diff <= 2) {
          this.changeHeight(200)
        } else if (diff <= 3) {
          this.changeHeight(150)
        } else if (diff <= 4) {
          this.changeHeight(100)
        } else {
          this.changeHeight(50)
        }

        this.moveScroll(this)
      }
    },

    watch: {
      'xAxis': {
        handler: function (newVal) {
          if (typeof (this.drillcoreId) !== 'undefined') {
            let diff = newVal.max - newVal.min;

            if (this.isDepthEligibleForImage(newVal.min, newVal.max, 5)) {
              if (diff > 1 && diff <= 5) { // Won't let picture disappear if graph is smaller than 1 meter.
                this.getImages(newVal.min, newVal.max);
              }
            }

          }
        },
        deep: true
      },
    },

    methods: {

      getImages(minDepth, maxDepth) {
        this.$http.jsonp(this.API_URL, {
          params:
            {
              drillcore__id: this.drillcoreId,
              or_search: 'start_depth__range:' + minDepth + ',' + maxDepth + ';' + 'end_depth__range:' + minDepth + ',' + maxDepth,
              order_by: 'start_depth',
              format: 'jsonp'
            }
        }).then(response => {
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
          if (size !== null) {
            return 'https://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
          } else {
            return 'https://eurocore.rocks' + url;
          }
        }
      },

      isDepthEligibleForImage(min, max, gap) {
        if (min !== Infinity && max !== -Infinity) {
          // console.log("min: " + min);
          // console.log("max: " + max);
          if (gap === null) gap = 5;

          const difference = max - min;
          return difference <= gap;
        }
      },

      moveScroll(myComponent) {
        setTimeout(function () {
          myComponent.moveScrollbar()
        }, 500);
      },

      moveScrollbar() {
        const imageWidth = $('#image-container').width();
        const div = $('#scroll-container');

        console.log('IMAGE WIDTH: ' + imageWidth)
        console.log('DIV WIDTH: ' + div.width())

        // div.scrollLeft((imageWidth - div.width()) / 2)
        div.animate({scrollLeft: (imageWidth - div.width()) / 2}, 0);
      },

      changeHeight(height) {
        $('.corebox-image').animate({ height: height }, 500);
      },

    },
  }
</script>

<style scoped>
  /*::-webkit-scrollbar {*/
    /*width: 12px;*/
    /*height: 10px;*/
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

  .draggable:hover {
    cursor: grab;
  }

  .draggable:active {
    cursor: grabbing;
  }

  .box-depths > div {
    font-weight: bold;
    font-size: large;
    color: #004393;
  }

  /*.corebox-image {*/
    /*!* I want to use height 20%, because then pictures won't break their dimensions*/
     /*TODO: Pictures should be in the same format (imo), also currently I can't use 150 pictures because some are missing*/
     /**!*/
    /*!*max-height: 50px;*!*/
    /*!*height: 15%;*!*/
    /*height: 50px;*/
  /*}*/




</style>
