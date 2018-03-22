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
                      <input type="text" class="form-control" placeholder="Username" v-model="user.passwordCredentials.username" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <div class="form-group">
                      <input type="password" class="form-control" placeholder="Password" v-model="user.passwordCredentials.password" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <button class="btn btn-primary" @click="logIn()" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated">
                      LOGIN &nbsp;<font-awesome-icon :icon="icon"></font-awesome-icon>
                    </button>
                    <button class="btn btn-danger" @click="logOut()" v-if="isAuthenticated" v-bind:disabled="!isAuthenticated">
                      LOGOUT &nbsp;<font-awesome-icon :icon="icon"></font-awesome-icon>
                    </button>

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

          </div>
        </div>

    </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faSignInAlt from '@fortawesome/fontawesome-free-solid/faSignInAlt'
  import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt'

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
        loginMessage: '',
        isAuthenticated: false,
      }
    },
    metaInfo: {
      title: 'EUROCORE Data Portal: Login'
    },
    computed: {
      icon() {
        return (this.isAuthenticated ? faSignOutAlt : faSignInAlt);
      }
    },
    created: function () {
      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.user = this.$session.get('userData')
        this.isAuthenticated = true;
        this.success = true;
        this.loginMessage = 'You are logged in as ' + this.user.passwordCredentials.username;
      }
    },
    methods: {
      logIn() {
        this.loggingIn = true;

        const accounts = this.availableAccounts;

        for (const acc in accounts) {
          if (this.user.passwordCredentials.username === accounts[acc].username && this.user.passwordCredentials.password === accounts[acc].password) {
            this.loggingIn = false;
            this.success = true;
            this.error = false;
            this.loginMessage = 'You are now logged in!';
            this.isAuthenticated = true;

            this.$session.set('userData', this.user)
            break
          } else {
            this.loggingIn = false;
            this.error = true;
            this.success = false;
            this.loginMessage = 'Incorrect username or password';
            this.isAuthenticated = false;
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
          console.log(errResponse);
          console.log(errResponse.status);
        })
      },
      logOut() {
        this.isAuthenticated = false;

        if (this.$session.exists() && this.$session.get('userData') != null) {
          this.$session.remove('userData');
        }

        this.user = {
          passwordCredentials: { username: '', password: '' },
          idCardCredentials: { username: '', password: '' },
          mobileIdCredentials: { personalCode: '', phoneNumber: '' },
        };

        this.success = true;
        this.loginMessage = 'You successfully logged out!'

        this.$http.jsonp('https://api.eurocore.rocks/logout/').then(response => {
          console.log(response);
          console.log('successfully logged out!')
        }, errResponse => {
          console.log('ERROR: ');
          console.log('successfully logged out! with an error :D')
          console.log(errResponse);
          console.log(errResponse.status);
        })
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
    height: 50%;
  }
</style>
