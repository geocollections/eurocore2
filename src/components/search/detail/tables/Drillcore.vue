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
                name="drillcore.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="drillcore.csv">Export to CSV</export-button>
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
  import ExportButton from 'vue-json-excel';

  export default {
    components: {
      ExportButton
    },
    props: ['results'],
    name: "drillcore",
    data() {
      return {
        exportFields: {
          'ID': 'id',
          'Name': 'name',
          'Latitude': 'latitude',
          'Longitude': 'longitude',
          'Length': 'hole_length',
          'Dip': 'hole_dip',
          'Azimuth': 'hole_azimuth',
        }
      }
    }
  }
</script>

<style scoped>

</style>
