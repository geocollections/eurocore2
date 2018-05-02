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
            <a href="javascript:void(0)" @click="openInNewWindow({object: 'analysis', id: entity.id})">{{entity.id}}</a>
            <!--<router-link :to="{ path: '/analysis/' + entity.id }">{{entity.id}}</router-link>-->
          </td>
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.instrument__instrument}}</td>
          <td>{{entity.agent__name}}</td>
          <td>{{entity.date}}</td>
          <td class="tableexport-ignore">
            <b>
              <a href="javascript:void(0)" @click="openUrlInNewWindow({url: 'https://eurocore.rocks/3D'})">Show 3D data</a>
              <!--<a href="http://eurocore.rocks/3D" target="_blank">Show 3D data</a>-->
            </b>
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
    name: "ct-scans",
    methods: {

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(location.origin + '/#/' + params.object + '/' + params.id,'', 'width=' + params.width + ', height=750');
      },

      openUrlInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(params.url,'', 'width=' + params.width + ', height=750');
      }
    }
  }
</script>

<style scoped>

</style>
