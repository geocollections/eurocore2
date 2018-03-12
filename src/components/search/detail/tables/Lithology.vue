<template>
    <div class="table-responsive">
      <table class="table table-hover table-bordered">
        <thead class="thead-light">
          <tr>
            <th>Depth from (m)</th>
            <th>Depth to (m)</th>
            <th>Rock class</th>
            <th>Rock name</th>
            <th>Field name</th>
            <th>Color</th>
            <th>Description</th>
            <th>Minerals</th>
            <th>Person/Institution</th>
            <th>Date</th>
          </tr>
        </thead>
          <tr v-for="litho in results">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        <tbody>

        </tbody>
      </table>
    </div>
</template>

<script>
  export default {
    props: ['results'],
    name: "lithology"
  }
</script>

<style scoped>

</style>
