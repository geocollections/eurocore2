import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '../components/main/FrontPage.vue'
import Drillcore from '../components/search/Drillcore'
import DrillcoreDetail from '../components/search/detail/DrillcoreDetail'
import DepositDetail from '../components/search/detail/DepositDetail'
import DrillcoreDataDetail from '../components/search/detail/DrillcoreDataDetail'
import CoreboxDetail from '../components/search/detail/CoreboxDetail'
import SampleDetail from '../components/search/detail/SampleDetail'
import AnalysisDetail from '../components/search/detail/AnalysisDetail'
import SpectrumDetail from '../components/search/detail/SpectrumDetail'
import DataSearch from '../components/search/DataSearch'
import TeachingAids from '../components/main/TeachingAids'
import Login from '../components/main/Login'
import Meta from "vue-meta"; // https://github.com/declandewet/vue-meta

Vue.use(Router);
Vue.use(Meta);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
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
      props: true,
    },
    {
      path: '/deposit/:id',
      name: 'DepositDetail',
      component: DepositDetail,
      props: true
    },
    {
      path: '/drillcore_data/:drillcoreId',
      name: 'DrillcoreDataDetail',
      component: DrillcoreDataDetail,
      props: true
    },
    {
      path: '/corebox/:id',
      name: 'CoreboxDetail',
      component: CoreboxDetail,
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
      path: '/spectrum/:analysisId',
      name: 'SpectrumDetail',
      component: SpectrumDetail,
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
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
