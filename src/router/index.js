import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '../components/main/FrontPage.vue'
import About from '../components/main/About'
import TeachingAids from '../components/main/TeachingAids'
import Drillcore from '../components/search/Drillcore'
import DrillcoreDetail from '../components/search/detail/DrillcoreDetail'
import DataSearch from '../components/search/DataSearch'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FrontPage',
      component: FrontPage
    },
    {
      path: '/drillcore',
      name: 'Drillcore',
      component: Drillcore
    },
    {
      path: '/drillcore/:id',
      name: 'DrillcoreDetail',
      component: DrillcoreDetail,
      props: true
    },
    {
      path: '/data_search',
      name: 'DataSearch',
      component: DataSearch
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/teaching_aids',
      name: 'TeachingAids',
      component: TeachingAids
    },
  ]
})
