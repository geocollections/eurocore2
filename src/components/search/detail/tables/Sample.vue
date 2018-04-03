<template>
  <div>

    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="sample" table-id="sample-table"></export-buttons>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table id="sample-table" class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>ID</th>
          <th>Sample number</th>
          <th>Depth from (m)</th>
          <th>Depth (m, interval)</th>
          <th>Purpose</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>
            <router-link :to="{ path: '/sample/' + entity.id }">{{entity.id}}</router-link>
          </td>
          <td>{{entity.sample_number}}</td>
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td></td>
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
    name: "sample",
  }
</script>

<style scoped>

</style>
