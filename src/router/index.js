import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '../components/main/FrontPage.vue'
import Drillcore from '../components/search/Drillcore'
import DrillcoreDetail from '../components/search/detail/DrillcoreDetail'
import DepositDetail from '../components/search/detail/DepositDetail'
import SampleDetail from '../components/search/detail/SampleDetail'
import AnalysisDetail from '../components/search/detail/AnalysisDetail'
import DataSearch from '../components/search/DataSearch'
import TeachingAids from '../components/main/TeachingAids'

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
      path: '/deposit/:id',
      name: 'DepositDetail',
      component: DepositDetail,
      props: true
    },
    {
      path: '/sample/:id',
      name: 'SampleDetail',
      component: SampleDetail,
      props: true
    },
    {
      path: '/analysis/:id',
      name: 'AnalysisDetail',
      component: AnalysisDetail,
      props: true
    },
    {
      path: '/data_search',
      name: 'DataSearch',
      component: DataSearch
    },
    {
      path: '/teaching_aids',
      name: 'TeachingAids',
      component: TeachingAids
    },
  ]
})
