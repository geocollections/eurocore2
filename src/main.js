// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import './assets/css/styles.css'
import VueSession from 'vue-session'
import VueAuthenticate from 'vue-authenticate'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueSession);
Vue.use(VueAuthenticate,  {
  tokenName: 'access_token',
  baseUrl: 'http://localhost:8080',
  storageType: 'cookieStorage',
  providers: {
    // Define OAuth providers config
  }
})

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
