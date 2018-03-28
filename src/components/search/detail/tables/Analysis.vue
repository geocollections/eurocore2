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
                name="analysis.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="analysis.csv">Export to CSV</export-button>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>ID</th>
          <th>Sample number</th>
          <th>Depth from (m)</th>
          <th>Depth (m, interval)</th>
          <th>Method</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>
        <tr v-for="entity in results">
          <td>
            <router-link :to="{ path: '/analysis/' + entity.id }">{{entity.id}}</router-link>
          </td>
          <td>
            <router-link :to="{ path: '/sample/' + entity.sample__id }">{{entity.sample__sample_number}}</router-link>
          </td>
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.analysis_method__method}}</td>
          <td>{{entity.agent__name}}</td>
          <td>{{entity.date}}</td>
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
    name: "analysis",
    data() {
      return {
        exportFields: {
          'ID': 'id',
          'Number': 'sample__sample_number',
          'Depth from (m)': 'depth',
          'Depth (m, interval)': 'end_depth',
          'Method': 'analysis_method__method',
          'Person/Institution': 'agent__name',
          'Date': 'date',
        }
      }
    }
  }
</script>

<style scoped>

</style>
