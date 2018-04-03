<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="ct-scans" table-id="ct-scans-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table id="ct-scans-table" class="table table-hover table-bordered">
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

        <tbody>
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
        </tbody>
      </table>
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
    name: "ct-scans",
  }
</script>

<style scoped>

</style>
