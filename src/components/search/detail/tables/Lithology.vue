<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="lithology" table-id="lithology-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive fixed-table">
      <table id="lithology-table" class="table table-hover table-bordered">
        <thead class="thead-light sticky-header">
        <tr>
          <th>Depth from (m)</th>
          <th>Depth to (m)</th>
          <th>Rock class</th>
          <th>Rock name</th>
          <th>Field name</th>
          <th>Color</th>
          <th>Description</th>
          <th>Minerals</th>
          <th>Remarks</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>{{entity.start_depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.rock_class__name}}</td>
          <td>{{entity.rock_name__name}}</td>
          <td>{{entity.field_name}}</td>
          <td>{{entity.color_attribute__attribute}} {{entity.color__color}}</td>
          <td>{{entity.description}}</td>
          <td>{{entity.mineralogical_rock_name}}</td>
          <td>{{entity.remarks}}</td>
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
    name: "lithology",
  }
</script>

<style scoped>

</style>
