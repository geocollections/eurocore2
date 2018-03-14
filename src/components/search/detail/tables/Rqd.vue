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
                name="rqd.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="rqd.csv">Export to CSV</export-button>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>Depth from (m)</th>
          <th>Depth to (m)</th>
          <th>RQD %</th>
          <th>Fractures</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>
        <tr v-for="entity in results">
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.rqd}}</td>
          <td>{{entity.fractures}}</td>
          <td></td>
          <td></td>
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
    name: "rqd",
    data() {
      return {
        exportFields: {
          'Depth from (m)': 'depth',
          'Dip to (m)': 'end_depth',
          'RQD %': 'rqd',
          'Fractures': 'fractures',
          'Person/Institution': '',
          'Date': '',
        }
      }
    }
  }
</script>

<style scoped>

</style>
