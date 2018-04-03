<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="drillcore" table-id="drillcore-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table id="drillcore-table" class="table table-hover table-bordered">
        <thead class="thead-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Length</th>
            <th>Dip</th>
            <th>Azimuth</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entity in results">
            <td>{{entity.id}}</td>
            <td>
              <router-link :to="{ path: '/drillcore/' + entity.id }">{{entity.name}}</router-link>
            </td>
            <td>{{entity.latitude}}</td>
            <td>{{entity.longitude}}</td>
            <td>{{entity.hole_length}}</td>
            <td>{{entity.hole_dip}}</td>
            <td>{{entity.hole_azimuth}}</td>
            <td>
              <router-link :to="{ path: '/drillcore_data/' + entity.id }">Show data</router-link>
            </td>
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
    name: "drillcore",
  }
</script>

<style scoped>

</style>
