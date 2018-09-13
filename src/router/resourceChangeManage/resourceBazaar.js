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

import ResourceBazaarPage from '@/pages/resourceChangeManage/resourceBazaar.vue'

export default [{
  path: '/sourceSubscription',
  name: 'SourceSubscription',
  component: ResourceBazaarPage,
  meta: {
    authority:['user']
  }
}]
