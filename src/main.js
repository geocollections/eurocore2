// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' // https://vuejs.org/v2/guide/
import VueResource from 'vue-resource' // https://github.com/pagekit/vue-resource
import App from './App'
import router from './router' // https://router.vuejs.org/en/
import BootstrapVue from 'bootstrap-vue' // https://bootstrap-vue.js.org/docs
import './assets/css/styles.css'
import VueSession from 'vue-session' // https://www.npmjs.com/package/vue-session
import moment from 'moment' // https://momentjs.com/
import VueIziToast from 'vue-izitoast' // https://github.com/arthurvasconcelos/vue-izitoast
import SocialSharing from 'vue-social-sharing'

import 'izitoast/dist/css/iziToast.min.css'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueSession);
Vue.use(VueIziToast);
Vue.use(SocialSharing);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

// This adds session id and csrf to request
Vue.http.options.credentials = true;

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('ddd, MMMM Do YYYY, HH:mm')
  }
});
