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
                name="dip.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="dip.csv">Export to CSV</export-button>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>Depth (m)</th>
          <th>Dip</th>
          <th>Azimuth</th>
        </tr>
        </thead>
        <tr v-for="entity in results">
          <td>{{entity.depth}}</td>
          <td>{{entity.dip}}</td>
          <td>{{entity.azimuth}}</td>
        </tr>
        <tbody>

        </tbody>
      </table>
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
    name: "dip",
    data() {
      return {
        exportFields: {
          'Depth (m)': 'depth',
          'Dip': 'dip',
          'Azimuth': 'azimuth',
        }
      }
    }
  }
</script>

<style scoped>

</style>
