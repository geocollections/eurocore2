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
                name="ct-scans.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="ct-scans.csv">Export to CSV</export-button>
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
          <th>Depth (m)</th>
          <th>Depth (m, interval)</th>
          <th>Instrument</th>
          <th>Person/Institution</th>
          <th>Date</th>
          <th></th>
        </tr>
        </thead>
        <tr v-for="entity in results">
          <td>
            <router-link :to="{ path: '/analysis/' + entity.id }">{{entity.id}}</router-link>
          </td>
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.instrument__instrument}}</td>
          <td>{{entity.agent__name}}</td>
          <td>{{entity.date}}</td>
          <th>
            <a href="http://eurocore.rocks/3D" target="_blank">Show 3D data</a>
          </th>
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
    name: "ct-scans",
    data() {
      return {
        exportFields: {
          'ID': 'id',
          'Depth (m)': 'depth',
          'Depth (m, interval)': 'end_depth',
          'Instrument': 'instrument__instrument',
          'Person/Institution': 'agent__name',
          'Date': 'date',
        }
      }
    }
  }
</script>

<style scoped>

</style>
