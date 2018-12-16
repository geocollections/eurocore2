<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="col pl-0 mt-3 mb-3">
          <export-buttons filename="reference" table-id="reference-table"></export-buttons>
        </div>
      </div>
    </div>
    <div class="table-responsive fixed-table">
      <table id="reference-table" class="table table-hover table-bordered">
        <thead class="thead-light sticky-header">
        <tr>
          <th>ID</th>
          <th>Reference</th>
          <th>Author</th>
          <th>Title</th>
          <th>Year</th>
          <th></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="entity in results">
          <td>{{entity.id}}</td>
          <td>{{entity.reference}}</td>
          <td>{{entity.publisher}} - {{entity.author}}</td>
          <td>{{entity.title}}</td>
          <td>{{entity.year}}</td>
          <td class="text-center tableexport-ignore">
            <a :href="entity.url" target="_blank" title="Download">
              <font-awesome-icon :icon="icon" size="2x"></font-awesome-icon>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import ExportButtons from '../partial/ExportButtons';
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faFilePdf from '@fortawesome/fontawesome-free-solid/faFilePdf'

  export default {
    components: {
      ExportButtons,
      FontAwesomeIcon
    },
    props: ['results'],
    name: "reference",
    computed: {
      icon () {
        return faFilePdf;
      }
    }
  }
</script>

<style scoped>

</style>
