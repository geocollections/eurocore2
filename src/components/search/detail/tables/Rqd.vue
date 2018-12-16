<template>
  <div>
    <div class="row">
      <div class="col">

        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="rqd" table-id="rqd-table"></export-buttons>
        </div>

      </div>
    </div>
    <div class="table-responsive fixed-table">
      <table id="rqd-table" class="table table-hover table-bordered">
        <thead class="thead-light sticky-header">
        <tr>
          <th>Depth from (m)</th>
          <th>Depth to (m)</th>
          <th>RQD %</th>
          <th>Fractures</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.rqd}}</td>
          <td>{{entity.fractures}}</td>
          <td></td>
          <td></td>
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
    name: "rqd",
  }
</script>

<style scoped>

</style>
