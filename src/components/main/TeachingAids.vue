<template>
  <div class="main">
    <div class="row">
      <div class="col">
        <h2>Teaching materials</h2>
      </div>
    </div>
    
    <div v-if="results.length > 0" v-for="module in results" class="row mt-3">
      <div class="col">
	  	<div class="module-details">
	  		<h3>{{ module.title }}</h3>
	        <p v-if="module.author"><strong>Authors</strong>: {{ module.author }}, {{ module.institution__name }}</p>
	        <p v-if="module.institution__name"><strong>Institution</strong>: {{ module.institution__name }}</p>
	        <p><strong>Description</strong>: {{ module.description }}</p>
	        <p><strong>Downloads</strong>: 
	        	<a v-if="module.files__title" href="javascript:void(0)" @click="openInNewWindow({url: module.files__url})">{{ module.files__title }}</a>
	        	<a v-else href="javascript:void(0)" @click="openInNewWindow({url: module.files__url})">FILE</a>
        	</p>
		</div>
      </div>
    </div>

	  <div v-if="!isAuthenticated">
	    <div class="row">
	      <div class="col">
	        <p class="text-center error-text">
	          <b>Please note that some teaching materials are available for registered users only.</b>
	          <br>
	          For getting an account please contact project partners.
	        </p>
	      </div>
	    </div>
	  </div>
  </div>
</template>

<script>
  export default {
    name: "teaching-aids",
    data() {
      return {
        isAuthenticated: false,
        API_URL: 'https://api.eurocore.rocks/teaching_module/',
        results: null,
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Teaching Aids'
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.isAuthenticated = true;
      }
      this.getModules();
    },
    methods: {
        getModules() {
          this.isSearching = true
          this.$http.get(this.API_URL, {
            before(request) {

              // abort previous request, if exists
              if (this.previousRequest) {
                this.previousRequest.abort();
              }

              // set previous request on Vue instance
              this.previousRequest = request;
            },
            params: {format: 'json'}
          }).then(response => {
            this.isSearching = false
            console.log(response);
            if (response.status === 200) {
              this.results = response.body.results;
              console.log('results:' + JSON.stringify(this.results));
            }
          }, errResponse => {
            this.isSearching = false
            console.log('ERROR: ' + JSON.stringify(errResponse));
          });
        },
        openInNewWindow(params) {
            if (typeof (params.width) === 'undefined') {
              params.width = 800;
            }
            window.open('https://eurocore.rocks' + params.url,'', 'width=' + params.width + ', height=750');
        },
    }
  }
</script>

<style scoped>
  .error-text {
    font-size: 1.2rem;
    margin: 10% auto;
    border: 1px solid pink;
    display: block;
  	padding: 10px;
  }
.module-details {
	margin: 0 0 0 3rem;
}
.module-details p {
	margin: 0 0 0 3rem;
    padding: 0;
	line-height: 2rem;
}
.main{
	padding: 0 0 10% 0;
}
</style>
