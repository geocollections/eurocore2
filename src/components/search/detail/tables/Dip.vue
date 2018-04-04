<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="dip" table-id="dip-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table id="dip-table" class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>Depth (m)</th>
          <th>Dip</th>
          <th>Azimuth</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>{{entity.depth}}</td>
          <td>{{entity.dip}}</td>
          <td>{{entity.azimuth}}</td>
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
    name: "dip",
    updated: function () {
      $('#dip-table').floatThead('reflow');
      this.addFloatingTableHeaders();
    },
    methods: {
      addFloatingTableHeaders() {
        $('#dip-table').floatThead({
          position: 'absolute',
          zIndex: 1090,
          top: 98 // headers height
        });
      },
    }
  }
</script>

<style scoped>

</style>
