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

export default [{
  path: '/resourceManagement',
  name: 'resourceManagement',
  component: resourceManagePage,
  meta: {
    authority:['user']
  }
},
]
