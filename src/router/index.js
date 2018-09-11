import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login.vue'
import AssignRole from './role/role'
import NodeOverview from './nodeOverview/nodeOverview'
import Banner from './banner/banner'
import ParkPerception from './parkPerception/parkPerception'
import Feedback from './feedback/feedback'
import CreateModel from './createModel/createModel'

Vue.use(Router)
const Layout = r => require.ensure([], () => r(require('@/pages/layout.vue')), 'Layout');

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Layout,
      children:[
        ...NodeOverview,
        ...AssignRole,
        ...Banner,
        ...ParkPerception,
        ...Feedback,
        ...CreateModel
      ]
    }
  ]
})
