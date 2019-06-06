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
import 'vuesax/dist/vuesax.css' // Todo: Vuesax breaks bootstrap navbar collapse style !!!
import VueCookie from 'vue-cookie'
import VueLocalStorage from 'vue-localstorage'
import Vuesax from 'vuesax'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueSession);
Vue.use(VueIziToast);
Vue.use(SocialSharing);
Vue.use(VueCookie);
Vue.use(VueLocalStorage);
Vue.use(Vuesax);

Vue.config.productionTip = false;

// This adds session id and csrf to request | MUST BE BEFORE new Vue()
Vue.http.interceptors.push((request, next) => {
  let csrftoken = Vue.cookie.get('csrftoken')

  request.credentials = true;
  request.headers.set('X-CSRFTOKEN', csrftoken)

  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  localStorage: {
    eurocore_cookie_policy: {
      type: Boolean,
      default: false
    }
  },
  components: { App },
  template: '<App/>'
});

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('ddd, MMMM Do YYYY, HH:mm')
  }
});
