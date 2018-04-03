<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="drillcore-box" table-id="drillcore-box-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="row align-items-center mb-3 pb-3 pt-3 hi" v-if="results.length > 0" v-for="entity in results">
      <div class="col-4">
        <router-link class="corebox-header" :to="{ path: '/corebox/' + entity.id }">Box: {{entity.number}}</router-link>
        <table id="drillcore-box-table" class="table table-hover table-bordered">
          <thead class="thead-light">
            <tr>
              <th>Depth</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{{entity.start_depth.toFixed(2)}} - {{entity.end_depth.toFixed(2)}} m</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-8">
        <router-link :to="{ path: '/corebox/' + entity.id }">
          <img :src="buildDrillcoreBoxUrl('1000', entity.image__url)" width="100%" title="Click for box details" alt="Drillcore box" />
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
  import ExportButtons from '../partial/ExportButtons';

  export default {
    components: {
      ExportButtons
    },
    props: ['results'],
    name: "drillcore-box",
    methods: {
      buildDrillcoreBoxUrl(size, url) {
        if (url != null) {
          return 'https://eurocore.rocks' + url.substring(0, 10) + size + url.substring(9);
        }
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
