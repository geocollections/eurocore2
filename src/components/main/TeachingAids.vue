<template>
  <div v-if="isAuthenticated">

    <div class="row">
      <div class="col">
        <h2>Teaching Aids</h2>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col">
        <h3>Teaching materials for Masters students</h3>
        <ul>
          <li><a href="#/teaching_aids">Exercise 1</a></li>
          <li><a href="#/teaching_aids">Exercise 2</a></li>
          <li><a href="#/teaching_aids">Exercise 3</a></li>
          <li><a href="#/teaching_aids">Exercise 4</a></li>
          <li><a href="#/teaching_aids">Exercise 5</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="row">
      <div class="col">
        <p class="text-center error-text">
          <b>Teaching materials are available for registered users.</b>
          <br>
          For getting an account please contact project manager: <a href="mailto:info@eurocore.rocks" target="_top">info@eurocore.rocks</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "teaching-aids",
    data() {
      return {
        isAuthenticated: false
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Teaching Aids'
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.isAuthenticated = true;
      }
    },
  }
</script>

<style scoped>
  .error-text {
    font-size: 1.5rem;
    margin: 10% auto;
  }

</style>
