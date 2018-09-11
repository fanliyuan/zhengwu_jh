import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login.vue'
import AssignRole from './role/role'
import UserManager from './userManager/userManager'
import NodeOverview from './nodeOverview/nodeOverview'
import Banner from './banner/banner'
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
        ...UserManager,
        ...Banner,
        ...CreateModel
      ]
    }
  ]
})
