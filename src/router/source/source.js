/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/12
 *
 * 描述 ：资源管理路由
 */

import SourcePage from '@/pages/source/source.vue'

export default [{
  path: '/source',
  name: 'Source',
  component: SourcePage,
  meta: {
    authority: ['user']
  }
}]
