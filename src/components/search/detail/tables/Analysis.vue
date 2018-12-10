<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="analysis" table-id="analysis-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table id="analysis-table" class="table table-hover table-bordered">
        <thead class="thead-light">
        <tr>
          <th>ID</th>
          <th>Sample number</th>
          <th>Depth from (m)</th>
          <th>Depth (m, interval)</th>
          <th>Method</th>
          <th>Person/Institution</th>
          <th>Analyzed by</th>
          <th>Date</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>
            <a href="javascript:void(0)" @click="openInNewWindow({object: 'analysis', id: entity.id, width: 600})">{{entity.id}}</a>
            <!--<router-link :to="{ path: '/analysis/' + entity.id }">{{entity.id}}</router-link>-->
          </td>
          <td>
            <a href="javascript:void(0)" @click="openInNewWindow({object: 'sample', id: entity.sample__id})">{{entity.sample__sample_number}}</a>
            <!--<router-link :to="{ path: '/sample/' + entity.sample__id }">{{entity.sample__sample_number}}</router-link>-->
          </td>
          <td>{{entity.depth}}</td>
          <td>{{entity.end_depth}}</td>
          <td>{{entity.analysis_method__method}}</td>
          <td>{{entity.agent__name}}</td>
          <td>{{entity.agent__acronym}}
            <span v-if="entity.agent__acronym && entity.agent__parent__acronym">,</span>
            {{entity.agent__parent__acronym}}
          </td>
          <td>{{entity.date | formatDate}}</td>
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
    name: "analysis",

    mounted: function () {
      this.addFloatingTableHeaders();
    },

    updated: function () {
      $('#analysis-table').floatThead('reflow');
    },

    methods: {

      openInNewWindow(params) {
        if (typeof (params.width) === 'undefined') {
          params.width = 800;
        }
        window.open(location.origin + '/#/' + params.object + '/' + params.id,'', 'width=' + params.width + ', height=750');
      },

      addFloatingTableHeaders() {
        $('#analysis-table').floatThead({
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
