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

import AllSubscriptionsPage from '@/pages/resourceChangeManage/allSubscriptions.vue'

export default [{
  path: '/allSub',
  name: 'allSub',
  component: AllSubscriptionsPage,
  meta: {
    authority:['user']
  }
}]
