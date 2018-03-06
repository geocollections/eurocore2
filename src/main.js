// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import './assets/css/styles.css'
import 'vue-instant/dist/vue-instant.css'
import VueInstant from 'vue-instant'

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueInstant);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
