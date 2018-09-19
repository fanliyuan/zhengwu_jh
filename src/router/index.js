import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login.vue'
import NotFound from './notFound/notFound'
import AssignRole from './role/role'
import UserManager from './userManager/userManager'
import NodeOverview from './nodeOverview/nodeOverview'
import Source from './source/source'
import Catalog from './catalog/catalog'
import SubscriptionModeration from './resourceChangeManage/subscriptionModeration'
import ResourceBazaar from './resourceChangeManage/resourceBazaar'
import AllSubscriptions from './resourceChangeManage/allSubscriptions'
import SourceAudit from './sourceAudit/sourceAudit'
import CatalogAudit from './catalogAudit/catalogAudit'

Vue.use(Router)
const Layout = r => require.ensure([], () => r(require('@/pages/layout.vue')), 'Layout');
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        authority: ['admin', 'security', 'auditor', 'user', 'assessor']
      }
    },
    {
      path: '/index',
      name: 'index',
      component: Layout,
      children:[
        ...NodeOverview,
        ...AssignRole,
        ...UserManager,
        ...Source,
        ...Catalog,
        ...ResourceBazaar,
        ...AllSubscriptions,
        ...SourceAudit,
        ...CatalogAudit,
        ...AllSubscriptions,
        ...SubscriptionModeration
      ]
    },
    {
      path: '*',
      component: Layout,
      children:[
        ...NotFound
      ],
      meta: {
        authority: ['admin', 'security', 'auditor', 'user', 'assessor']
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.fullPath === '/') {
    next();
  } else {
    if (to.meta.authority.indexOf(sessionStorage.getItem('authority')) !== -1) {
      next();
    } else {
      next({
        path: '/'
      })
    }
  }
});

export default router;
