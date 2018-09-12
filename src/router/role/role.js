/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：分配角色路由
 */

import RolePage from '@/pages/role/role.vue'

export default [{
  path: '/assignRole',
  name: 'AssignRole',
  component: RolePage,
  meta: {
    authority: ['security']
  }
}]
