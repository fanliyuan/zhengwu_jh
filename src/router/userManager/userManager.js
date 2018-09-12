/**
 * Created by Administrator on 2018/9/11 0011.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：用户管理路由
 */

import UserManagerPage from '@/pages/userManager/userManager.vue'

export default [{
  path: '/userManage',
  name: 'UserManager',
  component: UserManagerPage,
  meta: {
    authority: ['admin']
  }
}]
