/**
 * Created by Administrator on 2018/10/10 0010.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/12
 *
 * 描述 ：目录管理路由
 */

import ChangePassword from '@/pages/changePassword/changePassword.vue'


export default [{
  path: '/changePassword',
  name: 'changePassword',
  component: ChangePassword,
  meta: {
    authority: ['admin', 'security', 'auditor', 'user', 'assessor'],
    //keepAlive: true
  }
}]
