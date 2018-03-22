<template>
    <div>

      <div class="row">
        <div class="col">
          <h2>LOGIN</h2>
        </div>
      </div>

      <spinner v-show="loggingIn" class="loading-overlay" size="massive" message="Logging in..."></spinner>
      <div class="row mt-3 pb-3">
          <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <b-tabs>

              <b-tab title="Password">
                <div class="row mt-3 mb-3">
                  <div class="col">

                    <div class="alert" v-bind:class="{ 'alert-danger': error, 'alert-success': success }">
                      <span v-if="!loginMessage"><b>Please enter your username and password</b></span>
                      <b>{{loginMessage}}</b>
                    </div>

                    <div class="form-group">
                      <input type="text" class="form-control" placeholder="Username" v-model="user.passwordCredentials.username" />
                    </div>

                    <div class="form-group">
                      <input type="password" class="form-control " placeholder="Password" v-model="user.passwordCredentials.password" />
                    </div>

                  </div>
                </div>
              </b-tab>

              <b-tab title="ID-Card">
                <div class="row mt-3 mb-3">
                  <div class="col">

                    <a href="https://e-resident.gov.ee/" target="_blank" style="font-size: 2rem">E-Residency</a>

                  </div>
                </div>
              </b-tab>

              <b-tab title="Mobile-ID">
                <div class="row mt-3 mb-3">
                  <div class="col">

                    <p>Personal code: <strong>{{user.mobileIdCredentials.personalCode}}</strong> <br> Phone number: <strong>{{user.mobileIdCredentials.phoneNumber}}</strong></p>

                    <div class="form-group">
                      <input type="text" class="form-control" placeholder="Personal code" v-model="user.mobileIdCredentials.personalCode" />
                    </div>

                    <div class="form-group">
                      <input type="text" class="form-control " placeholder="Phone number" v-model="user.mobileIdCredentials.phoneNumber" />
                    </div>

                  </div>
                </div>

              </b-tab>
            </b-tabs>

            <button class="btn btn-primary" @click="submit()">
              LOGIN &nbsp;<font-awesome-icon :icon="icon"></font-awesome-icon>
            </button>

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
        user: {
          passwordCredentials: { username: '', password: '' },
          idCardCredentials: { username: '', password: '' },
          mobileIdCredentials: { personalCode: '', phoneNumber: '' },
        },
        availableAccounts: {
          acc1: { username: 'enar', password: 'Work123' },
          acc2: { username: 'olle', password: '1muumitroll' },
        },
        loggingIn: false,
        error: false,
        success: false,
        loginMessage: ''
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
        this.loggingIn = true;

        const accounts = this.availableAccounts;

        for (const acc in accounts) {
          if (this.user.passwordCredentials.username === accounts[acc].username && this.user.passwordCredentials.password === accounts[acc].password) {
            console.log('success');
            this.loggingIn = false;
            this.success = true;
            this.loginMessage = 'You are now logged in!';
            break
          } else {
            this.loggingIn = false;
            this.error = true;
            this.loginMessage = 'Incorrect username or password';
          }
        }




        this.$http.jsonp('https://api.eurocore.rocks/login/', {
          params: {
            user: this.user.passwordCredentials.username,
            pwd: this.user.passwordCredentials.password,
            format: 'jsonp'
          }
        }).then(response => {
          console.log(response);
        }, errResponse => {
          console.log('ERROR: ');
          // this.loginMessage = errResponse;
          console.log(errResponse);
          console.log(errResponse.status);
        })
        // const credentials = {
        //   username: this.credentials.username,
        //   password: this.credentials.password
        // }
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
