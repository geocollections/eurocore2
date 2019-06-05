<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="ct-scans" table-id="ct-scans-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive fixed-table">
      <table id="ct-scans-table" class="table table-hover table-bordered">
        <thead class="thead-light sticky-header">
        <tr>
          <th>ID</th>
          <th>Depth form (m)</th>
          <th>Depth to (m)</th>
          <th>Lab</th>
          <th>Date</th>
          <th>Remarks</th>
          <!-- ISSUE #44 -->
          <!--<th></th>-->
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
          <td>{{entity.lab__lab}}</td>
          <td>{{entity.date_free}}</td>
          <td>{{entity.remarks}}</td>
<!--          <td>{{entity.instrument__instrument}}</td>-->
<!--          <td>{{entity.agent__name}}</td>-->
<!--          <td>{{entity.date | formatDate}}</td>-->
          <!-- ISSUE #44 -->
          <!--<td class="tableexport-ignore">-->
            <!--<b>-->
              <!--<a href="javascript:void(0)" @click="openUrlInNewWindow({url: 'https://eurocore.rocks/3D'})">Show 3D data</a>-->
              <!--&lt;!&ndash;<a href="http://eurocore.rocks/3D" target="_blank">Show 3D data</a>&ndash;&gt;-->
            <!--</b>-->
          <!--</td>-->
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
