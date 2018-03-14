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
                name="reference.xls">Export to XLS</export-button>
            </b-dropdown-item>
            <b-dropdown-item>
              <export-button
                :data="results"
                :fields="exportFields"
                type="csv"
                name="reference.csv">Export to CSV</export-button>
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
          <th>Reference</th>
          <th>Author</th>
          <th>Title</th>
          <th>Year</th>
          <th></th>
        </tr>
        </thead>
        <tr v-for="entity in results">
          <td>{{entity.id}}</td>
          <td>{{entity.reference}}</td>
          <td>{{entity.publisher}} - {{entity.author}}</td>
          <td>{{entity.title}}</td>
          <td>{{entity.year}}</td>
          <td class="text-center">
            <a :href="entity.url" target="_blank" title="Download">
              <font-awesome-icon :icon="icon" size="2x"></font-awesome-icon>
            </a>
          </td>
        </tr>
        <tbody>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import ExportButton from 'vue-json-excel';
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faFilePdf from '@fortawesome/fontawesome-free-solid/faFilePdf'

  export default {
    components: {
      ExportButton,
      FontAwesomeIcon
    },
    props: ['results'],
    name: "reference",
    data() {
      return {
        exportFields: {
          'ID': 'id',
          'Number': 'sample_number',
          'Depth from (m)': 'depth',
          'Depth (m, interval)': 'end_depth',
          'Purpose': '',
          'Person/Institution': '',
          'Date': '',
        }
      }
    },
    computed: {
      icon () {
        return faFilePdf;
      }
    }
  }
</script>

<style scoped>

</style>
