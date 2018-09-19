/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：分配角色路由
 */

import CatalogAuditPage from '@/pages/catalogAudit/catalogAudit.vue'

export default [{
  path: '/catalogAudit',
  name: 'CatalogAudit',
  component: CatalogAuditPage,
  meta: {
    authority: ['assessor']
  }
}]
