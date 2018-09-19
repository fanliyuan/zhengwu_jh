/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：分配角色路由
 */

import SourceAuditPage from '@/pages/sourceAudit/sourceAudit.vue'

export default [{
  path: '/sourceAudit',
  name: 'SourceAudit',
  component: SourceAuditPage,
  meta: {
    authority: ['assessor']
  }
}]
