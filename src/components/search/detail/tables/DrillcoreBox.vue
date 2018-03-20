<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <b-dropdown text="EXPORT" variant="primary">
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                name="drillcore-box.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="drillcore-box.csv">Export to CSV</export-button>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div class="row align-items-center mb-3 pb-3 pt-3 hi" v-if="results.length > 0" v-for="entity in results">
      <div class="col-4">
        <router-link class="corebox-header" :to="{ path: '/corebox/' + entity.id }">{{entity.number}}</router-link>
        <table class="table table-hover table-bordered th-styles">
          <tr>
            <td>Depth</td>
            <td>{{entity.start_depth.toFixed(2)}} - {{entity.end_depth.toFixed(2)}} m</td>
          </tr>
        </table>
      </div>

      <div class="col-8">
        <router-link :to="{ path: '/corebox/' + entity.id }">
          <img :src="buildDrillcoreBoxUrl('1000', entity.image__url)" width="100%" title="Click for box details" />
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
  import ExportButton from 'vue-json-excel';

  export default {
    components: {
      ExportButton
    },
    props: ['results'],
    name: "drillcore-box",
    data() {
      return {
        exportFields: {
          'Corebox number': 'number',
          'Depth from (m)': 'start_depth',
          'Depth to (m)': 'end_depth',
          'corebox url': 'image__url'
        }
      }
    },
    methods: {
      buildDrillcoreBoxUrl(size, url) {
        return 'https://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
      }
    }
  }
</script>

<style scoped>
  .corebox-header {
    font-size: 1.25rem;
    font-weight: 600;
    /*color: #6bb745;*/
  }

  .hi {
    border-bottom: 1px solid #dee2e6;
    border-top: 1px solid #dee2e6;
    /*border: 1px solid #dee2e6;*/
  }

  .th-styles tr td:first-child {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
    font-weight: bold;
  }
</style>
