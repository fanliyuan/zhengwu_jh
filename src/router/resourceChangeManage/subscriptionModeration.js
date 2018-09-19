/**
 * Created by Administrator on 2018/9/18 0018.
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

import SubscriptionModerationPage from '@/pages/resourceChangeManage/subscriptionModeration.vue'
import AuditDetailPage from '@/pages/resourceChangeManage/auditDetail.vue'
export default [{
  path: '/subscriptionModeration',
  name: 'SubscriptionModeration',
  component: SubscriptionModerationPage,
  meta: {
    authority:['assessor']
  }
},{
  path: '/subscriptionModeration/auditDetail/:id',
  name: 'AuditDetail',
  component: AuditDetailPage,
  meta: {
    authority:['assessor']
  }
}]
