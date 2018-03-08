<template>
  <div>
    <div class="row">
      <div class="col">
        <h2>Data Search</h2>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <div class="form-group">
          <label>Drillcore name(s)</label>
        </div>

        <div class="form-group">
          <label>Analytical method(s)</label>
        </div>

        <div class="form-group">
          <label>Show parameter(s)</label>
        </div>
      </div>
    </div>


    <div class="searchButtons row">
          <span class="mr-2 mb-2">
            <button class="btn btn-primary" title="Sends request with inserted data" @click="searchEntities(searchParameters)">SEARCH</button>
          </span>

      <span class="mr-2 mb-2">
            <button class="btn btn-danger" title="Clears search fields" @click="resetSearchParameters()">RESET FORM</button>
          </span>
    </div>


    <div class="row">
      <div class="col">
        <p v-if="response.results != ''">Found <b>{{response.count}}</b> result(s). </p>
        <p v-else>No results found. Please try again. </p>
      </div>
    </div>


    <div class="row" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions" class="mb-3"></b-form-select>
      </div>

      <div class="col">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>


    <div v-if="response.count > 0" class="row">
      <div class="col">
        <div class="table-responsive">
          <table class="table table-hover table-bordered ">
            <thead class="thead-light">
            <tr class="th-sort">
              <!--TODO: should chagen to drillcore name-->
              <th><span @click="changeOrder('drillcore_id')">Drillcore</span></th>
              <th><span @click="changeOrder('depth')">Depth from (m)</span></th>
              <th><span @click="changeOrder('end_depth')">Depth to (m)</span></th>
              <th><span @click="changeOrder('sample_number')">Sample</span></th>
              <th><span @click="changeOrder('analysis_id')">Analysis ID</span></th>
              <th><span @click="changeOrder('analysis_method')">Method</span></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="entity in response.results">
              <td>
                <!--TODO: change to drillcore name-->
                <router-link :to="{ path: '/drillcore/' + entity.drillcore_id }">{{entity.drillcore_id}}</router-link>
              </td>
              <td>{{entity.depth}}</td>
              <td>{{entity.end_depth}}</td>
              <td>
                <!--TODO: fix opening in new window-->
                <router-link :to="{ path: '/sample/' + entity.sample_id }">{{entity.sample_number}}</router-link>
                <!--<a href @click="openInNewWindow({object: 'sample', id: entity.sample_id})" >{{entity.sample_number}}</a>-->
              </td>
              <td>
                <router-link :to="{ path: '/analysis/' + entity.analysis_id }">{{entity.analysis_id}}</router-link>
                <!--<a href @click="openInNewWindow({object: 'analysis', id: entity.analysis_id})" >{{entity.analysis_id}}</a>-->
              </td>
              <td>{{entity.analysis_method}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="row mt-3" v-if="response.count > 0">
      <div class="col-xs-1 pl-3 pr-3 mb-3">
        <b-form-select v-model="searchParameters.paginateBy" :options="paginationOptions"></b-form-select>
      </div>

      <div class="col mb-3">
        <b-pagination
          size="md" align="right" :limit="5" :total-rows="response.count" v-model="searchParameters.page" :per-page="searchParameters.paginateBy">
        </b-pagination>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
      name: "data-search",
      data() {
        return {
          API_URL: 'http://api.eurocore.rocks/',
          searchParameters: {
            page: 1,
            paginateBy: 100,
            orderBy: 'id',
          },
          response: {
            count: 0,
            results: []
          },
          paginationOptions: [
            { value: 10, text: 'Sort by 10' },
            { value: 25, text: 'Sort by 25' },
            { value: 50, text: 'Sort by 50' },
            { value: 100, text: 'Sort by 100' },
            { value: 250, text: 'Sort by 250' },
            { value: 500, text: 'Sort by 500' },
            { value: 1000, text: 'Sort by 1000' }
          ]
        }
      },
      computed: {

      },
      watch: {
        'searchParameters': {
          handler: function () {
            this.searchEntities(this.searchParameters);
          },
          deep: true
        }
      },
      methods: {
        searchEntities(params) {
          console.log(params);
          this.$http.jsonp(this.API_URL + 'analysis_summary' , {params: {format: 'jsonp', page: params.page, paginate_by: params.paginateBy, order_by: params.orderBy}}).then(response => {
            console.log(response);

            this.response.count = response.body.count;
            this.response.results = response.body.results;

          }, errResponse => {
            console.log('*** ERROR ***');
            console.log(errResponse);
            this.$router.push('/404/')
          })
        },

        // TODO: Make order changing responsive + order should be object like sortField: { order: 'fields', direction: 'ASC' }
        changeOrder(orderValue) {
          if (this.searchParameters.orderBy === orderValue) {
            if (orderValue.charAt(0) !== '-') {
              orderValue = '-' + orderValue;
            } else {
              orderValue = orderValue.substring(1);
            }
          }
          this.searchParameters.orderBy = orderValue;
        },

        resetSearchParameters() {
          console.log(this.searchParameters);
          this.searchParameters =
            {
              page: 1,
              paginateBy: 100,
              orderBy: 'id',
            };
          console.log(this.searchParameters);
        },

        openInNewWindow(params) {
          let width = 600;
          window.open('#/' + params.object + '/' + params.id, '', 'width=' + width + ',height=750,scrollbars,resizable');
        }
      },
      created: function () {
        // TODO: Params should come from URL if exists
        // TODO: PARAMS sequnece from top priority URL -> SESSION -> INPUT FIELDS
        if (this.$session.exists() && this.$session.get('dataSearch') != null) {
          this.searchParameters = this.$session.get('dataSearch');
        } else {
          this.searchEntities(this.searchParameters)
        }
      },
      beforeDestroy: function () {
        this.$session.set('dataSearch', this.searchParameters);
      }
    }
</script>

<style scoped>
  .searchButtons {
    margin: 0.75rem 0;
  }

  .th-sort > th > span {
    cursor: pointer;
  }
</style>
