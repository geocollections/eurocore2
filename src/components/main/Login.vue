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
                      <input type="text" @keyup.enter="logIn()" class="form-control" placeholder="Username" v-model="user.passwordCredentials.username" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <div class="form-group">
                      <input type="password" @keyup.enter="logIn()" class="form-control" placeholder="Password" v-model="user.passwordCredentials.password" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
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
                      <span v-if="!loginMessage"><b>Please enter your username and personal code</b></span>
                      <b>{{loginMessage}}</b>
                    </div>

                    <div class="form-group">
                      <input type="text" @keyup.enter="logInId()" class="form-control" placeholder="Username" v-model="user.idCardCredentials.username" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <div class="form-group">
                      <input type="text" @keyup.enter="logInId()" class="form-control" placeholder="Personal code" v-model="user.idCardCredentials.personalCode" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated"/>
                    </div>

                    <button class="btn btn-primary" @click="logInId()" v-if="!isAuthenticated" v-bind:disabled="isAuthenticated">
                      LOGIN &nbsp;<font-awesome-icon :icon="icon"/>
                    </button>
                    <button class="btn btn-danger" @click="logOut()" v-if="isAuthenticated" v-bind:disabled="!isAuthenticated">
                      LOGOUT &nbsp;<font-awesome-icon :icon="icon"/>
                    </button>

                    <button class="btn btn-success" @click="testButton()">TEST BUTTON</button>


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
  import hwcrypto from './../../assets/js/hwcrypto'
  const esteid = require('esteid')
  const webeid = require('web-eid')

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
          idCardCredentials: { username: '', personalCode: '' },
          mobileIdCredentials: { personalCode: '', phoneNumber: '' },
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
      window.addEventListener('keyup', this.handleKeyup);

      if (this.$session.exists() && this.$session.get('userData') != null) {
        this.user.passwordCredentials.username = this.$session.get('userData')
        this.isAuthenticated = true;
        this.success = true;
        this.loginMessage = 'You are logged in as ' + this.user.passwordCredentials.username;
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
            user: this.user.passwordCredentials.username,
            pwd: this.user.passwordCredentials.password
          },
          { emulateJSON: true
          }).then(response => {
            if (response.status === 200) {
              console.log(response);
              if (response.body.user != null) {
                this.user.passwordCredentials.username = response.body.user;
                this.isAuthenticated = true;
                this.loginMessage = response.body.message;
                this.toastSuccess(response.body.message)
                this.success = true;
                this.error = false;
                this.$session.set('userData', this.user.passwordCredentials.username)
              } else {
                this.loginMessage = response.body.message;
                this.toastError(response.body.message)
                this.error = true;
                this.success = false;
              }
              this.loggingIn = false;
            }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
          this.loggingIn = false;
        })
      },

      testButton() {
        // let EstEID = esteid.connect(this.transmit)

        // console.log(EstEID.getPersonalData('PERSONAL_ID'))
        // hwcrypto.getCertificate({lang: 'en'})
        console.log(esteid)
        console.log(webeid)
      },

      transmit(apdu) {
        return new Promise((resolve, reject) => resolve(SCardTransmit(apdu)))
      },

      logInId() {
        this.$http.post('https://api.eurocore.rocks/loginid/',
          {
            user: this.user.idCardCredentials.username,
            code: this.user.idCardCredentials.personalCode
          },
          {
            emulateJSON:true
          }
        ).then(response => {
          if (response.status === 200) {
            console.log(response);
            if (response.body.user != null) {
              this.user.idCardCredentials.username = response.body.user;
              this.isAuthenticated = true;
              this.loginMessage = response.body.message;
              this.toastSuccess(response.body.message)
              this.success = true;
              this.error = false;
              this.$session.set('userData', this.user.idCardCredentials.username)
            } else {
              this.loginMessage = response.body.message;
              this.toastError(response.body.message)
              this.error = true;
              this.success = false;
            }
            this.loggingIn = false;
          }
        }, errResponse => {
          console.log('ERROR: ' + JSON.stringify(errResponse));
        })
      },


      logOut() {
        if (this.$session.exists() && this.$session.get('userData') != null) {
          this.$session.remove('userData');
        }

        this.user = {
          passwordCredentials: { username: '', password: '' },
          idCardCredentials: { username: '', password: '' },
          mobileIdCredentials: { personalCode: '', phoneNumber: '' },
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
          console.log('ERROR: ');
          console.log(errResponse);
          console.log(errResponse.status);
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
