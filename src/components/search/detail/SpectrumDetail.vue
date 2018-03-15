<template>
  <div>
    <div class="row">
      <div class="col">
        <h2>Spectrum</h2>
        <h3>Analysis ID: {{analysisId}}</h3>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div id="graph">
          <!--TODO: Graph goes here-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['analysisId'],
    name: "spectrum-detail"
  }
</script>

<style scoped>
  h3 {
    color: #6bb745;
  }
</style>
