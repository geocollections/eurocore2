<template>
    <div>

      <div class="row">
        <div class="col">
          <h2>LOGIN</h2>
        </div>
      </div>

      <spinner v-show="loggingIn" class="loading-overlay" size="massive" message="Logging in..."></spinner>
      <div class="row mt-3 pb-3">
        <div class="col">

          <div class="col-sm-6 offset-sm-3 col-lg-4 offset-lg-4">
            <p>username: <strong>{{credentials.username}}</strong> <br> password: <strong>{{credentials.password}}</strong></p>
            <div class="alert alert-danger" v-if="error">
              {{ error }}
            </div>

            <div class="form-group">
              <input type="text" class="form-control" placeholder="Enter your username" v-model="credentials.username" />
            </div>

            <div class="form-group">
              <input type="password" class="form-control " placeholder="Enter your password" v-model="credentials.password" />
            </div>
            <button class="btn btn-primary" @click="submit()">
              LOGIN &nbsp;<font-awesome-icon :icon="icon"></font-awesome-icon>
            </button>

          </div>
        </div>
      </div>

    </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faArrowCircleRight from '@fortawesome/fontawesome-free-solid/faArrowCircleRight'

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login",
    data() {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loggingIn: false,
        error: ''
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Login'
    },
    computed: {
      icon () {
        return faArrowCircleRight;
      }
    },
    methods: {
      submit () {
        this.loggingIn = true
        const credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        this.error = 'Coming soon...'
        // Auth.login() returns a promise. A redirect will happen on success.
        // For errors, use .then() to capture the response to output
        // error_description (if exists) as shown below:
        // this.$auth.login(credentials, 'dashboard').then((response) => {
        //   this.loggingIn = false
        //   this.error = utils.getError(response)
        // })
      }
    }
  }
</script>

<style scoped>
  .loading-overlay {
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    z-index: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 40%;
  }
</style>
