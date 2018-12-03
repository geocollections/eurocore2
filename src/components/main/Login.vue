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

                    <div v-if="isAuthenticated">
                      <a href="https://manage.eurocore.rocks" target="_blank" class="btn btn-info">MANAGE DATA</a>
                    </div>

                    <div class="form-group">
                      <input type="text" @keyup.enter="logIn()" class="form-control" placeholder="Username" v-model="user.username" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <div class="form-group">
                      <input type="password" @keyup.enter="logIn()" class="form-control" placeholder="Password" v-model="user.password" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <button class="btn btn-primary" @click="logIn()" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated">
                      LOGIN &nbsp;<font-awesome-icon :icon="icon"/>
                    </button>

                    <button class="btn btn-danger" @click="logOut()" v-if="isAuthenticated" v-bind:disabled="!isAuthenticated">
                      LOGOUT &nbsp;<font-awesome-icon :icon="icon"/>
                    </button>

                  </div>
                </div>
              </b-tab>

              <b-tab title="Smartcard">
                <div class="row mt-3 mb-3">
                  <div class="col">
                    <p>Currently works with Estonian national ID-card. If you haven't one, check the <a href="https://e-resident.gov.ee/" target="_blank" style="font-size: 1rem">E-Residency</a> website. Other smartcards may work in future.</p>

                    <div class="alert" v-bind:class="{ 'alert-danger': error, 'alert-success': success }">
                      <span v-if="!loginMessage"><b>Make sure that ID-card is connected to computer</b></span>
                      <b>{{loginMessage}}</b>
                    </div>

                    <div class="idcard-wrapper text-center">
                      <button class="btn btn-primary" @click="logInId()" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated">
                        LOGIN &nbsp;<font-awesome-icon :icon="idCard"/>
                      </button>

                      <button class="btn btn-danger" @click="logOut()" v-if="isAuthenticated" v-bind:disabled="!isAuthenticated">
                        LOGOUT &nbsp;<font-awesome-icon :icon="icon"/>
                      </button>
                    </div>

                  </div>
                </div>
              </b-tab>

              <!--<b-tab title="Mobile-ID">-->
                <!--<div class="row mt-3 mb-3">-->
                  <!--<div class="col">-->

                    <!--<p>Personal code: <strong>{{user.mobileIdCredentials.personalCode}}</strong> <br> Phone number: <strong>{{user.mobileIdCredentials.phoneNumber}}</strong></p>-->

                    <!--<div class="form-group">-->
                      <!--<input type="text" class="form-control" placeholder="Personal code" v-model="user.mobileIdCredentials.personalCode" />-->
                    <!--</div>-->

                    <!--<div class="form-group">-->
                      <!--<input type="text" class="form-control " placeholder="Phone number" v-model="user.mobileIdCredentials.phoneNumber" />-->
                    <!--</div>-->

                  <!--</div>-->
                <!--</div>-->

              <!--</b-tab>-->
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
  import faIdCard from '@fortawesome/fontawesome-free-solid/faIdCard'

  export default {
    components: {
      Spinner,
      FontAwesomeIcon
    },
    name: "login",
    data() {
      return {
        user: {
          username: '',
          password: '',
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
      },

      idCard() {
        return faIdCard
      }
    },
    created: function () {
      window.addEventListener('keyup', this.handleKeyup);

      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.user.username = this.$session.get('userData');
        this.isAuthenticated = true;
        this.success = true;
        this.loginMessage = 'You are logged in as ' + this.user.username;
      }
    },
    beforeDestroy: function() {
      window.removeEventListener('keyup', this.handleKeyup);
    },
    methods: {
      logIn() {
        this.loggingIn = true;

        this.$http.post('https://api.eurocore.rocks/login/',
          {
            user: this.user.username,
            pwd: this.user.password
          },
          {
            emulateJSON: true
          }
        ).then(response => {
          if (response.status === 200) {
            console.log(response);
            if (response.body.user != null) {
              this.user.username = response.body.user;
              this.isAuthenticated = true;
              this.loginMessage = response.body.message;
              this.toastSuccess(response.body.message);
              this.success = true;
              this.error = false;
              this.$session.set('userData', this.user.username)
            } else {
              this.loginMessage = response.body.message;
              this.toastError(response.body.message);
              this.error = true;
              this.success = false;
            }
            this.loggingIn = false;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
          this.loginMessage = 'Something went wrong!';
          this.toastError('Something went wrong!');
          this.error = true;
          this.success = false;
          this.loggingIn = false;
        })
      },

      logInId() {
        this.loggingIn = true;

        this.$http.get('https://api.eurocore.rocks/loginid/').then(response => {
          if (response.status === 200) {
            console.log(response);
            if (response.body.user != null) {
              this.isAuthenticated = true;
              this.loginMessage = response.body.message;
              this.toastSuccess(response.body.message);
              this.success = true;
              this.error = false;
              this.$session.set('userData', response.body.user)
            } else {
              this.loginMessage = response.body.message;
              this.toastError(response.body.message);
              this.error = true;
              this.success = false;
            }
            this.loggingIn = false;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
          this.loginMessage = 'Something went wrong!';
          this.toastError('Something went wrong!');
          this.error = true;
          this.success = false;
          this.loggingIn = false;
        })
      },


      logOut() {
        if (this.$session.exists() && this.$session.get('userData') != null) {
          this.$session.remove('userData');
        }

        this.user = {
          username: '',
          password: ''
        };

        this.$http.get('https://api.eurocore.rocks/logout/').then(response => {
          if (response.status === 200) {
            console.log(response)
            this.loginMessage = response.body.message;
            this.toastSuccess(response.body.message);
            this.isAuthenticated = false;
            this.success = true;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },

      handleKeyup(event) {
        if (event.keyCode === 13 || event.which === 13) {
          if (this.isAuthenticated) {
            this.logOut();
          }
        }
      },

      toastSuccess(text) {
        this.$toast.success(text, 'OK', {
          position: 'bottomRight',
          timeout: 2000,
          pauseOnHover: false
        })
      },

      toastError(text) {
        this.$toast.error(text, 'Error', {
          position: 'bottomRight',
          timeout: 2000,
          pauseOnHover: false
        })
      },
    }
  }
</script>

<style scoped>

</style>
