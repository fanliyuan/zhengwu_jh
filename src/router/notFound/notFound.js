/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/13
 *
 * 描述 ：404路由
 */

import NotFound from '@/components/notFound/notFound.vue'

export default [{
  path: '*',
  name: 'NotFound',
  component: NotFound,
  meta: {
    authority: ['admin', 'security', 'auditor', 'user', 'assessor']
  }
}]
