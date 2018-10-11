/**
 * Created by Administrator on 2018/9/26 0026.
 */
/**
 * Created by Administrator on 2018/9/14 0014.
 */
/**
 * Created by Administrator on 2018/9/12 0012.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：用户管理路由
 */

import resourceManagePage from '@/pages/resourceChangeManage/resourceManage/resourceManage.vue'
import viewCatalogPage from '@/pages/resourceChangeManage/resourceManage/viewCatalog.vue'
import viewResourcePage from '@/pages/resourceChangeManage/resourceManage/viewResource.vue'
import exportPage from '@/pages/resourceChangeManage/resourceManage/export.vue'

export default [{
  path: '/resourceManagement',
  name: 'resourceManagement',
  component: resourceManagePage,
  meta: {
    authority:['user']
  }
},{
  path: '/resourceManagement/viewCatalog/:id',
  name: 'viewCatalog',
  component: viewCatalogPage,
  meta: {
    authority:['user']
  }
},{
  path: '/resourceManagement/viewResource/:id',
  name: 'viewResource',
  component: viewResourcePage,
  meta: {
    authority:['user']
  }
},{
  path: '/resourceManagement/export/:id',
  name: 'export',
  component: exportPage,
  meta: {
    authority:['user']
  }
}
]
