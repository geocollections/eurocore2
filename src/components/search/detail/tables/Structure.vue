<template>
  <div class="structures">
    <div class="row">
      <div class="col">

        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="structure" table-id="structure-table"></export-buttons>
        </div>

      </div>
    </div>
    <div class="table-responsive">
      <table id="structure-table" class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>Depth (m)</th>
          <th>Depth (m, interval)</th>
          <th>Structure type</th>
          <th>Dip angle</th>
          <th>Dip direction</th>
          <th>Description</th>
          <th>Person/Institution</th>
          <th>Date</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>{{entity.depth_actual}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.structure_type__name}}</td>
          <td>{{entity.dip}}</td>
          <td>{{entity.direction}}</td>
          <td>{{entity.comments}}</td>
          <td>{{entity.agent_described__name}}</td>
          <td>{{entity.date_described}}</td>
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
    name: "structure",

    mounted: function () {
      this.addFloatingTableHeaders();
    },

    updated: function () {
      $('#structure-table').floatThead('reflow');
    },

    methods: {
      addFloatingTableHeaders() {
        $('#structure-table').floatThead({
          position: 'absolute',
          zIndex: 1025,
          top: function () {
            return $('#main').css('padding-top') === '22px' ? 0 : 98;
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
