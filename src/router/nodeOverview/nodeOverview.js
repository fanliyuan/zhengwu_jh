/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：节点概览路由
 */

import nodeOverviewPage from '@/pages/nodeOverview/nodeOverview.vue'

export default [{
  path: '/nodeOverview',
  name: 'NodeOverview',
  component: nodeOverviewPage,
  meta: {
    authority: ['admin', 'security', 'auditor', 'user', 'assessor']
  }
}]
