/**
 * Created by Administrator on 2018/10/25 0025.
 */
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
 * 描述 ：订阅审核路由
 */

import SubscribeAuditingPage from '@/pages/resourceChangeManage/subscribeAuditing/subscribeAuditing.vue'
// import AuditDetailPage from '@/pages/resourceChangeManage/auditDetail.vue'
import SubscribeAuditingLogsPage from '@/pages/resourceChangeManage/subscribeAuditing/subscribeAuditingLogs.vue'
export default [{
  path: '/subscribeAuditing',
  name: 'SubscribeAuditing',
  component: SubscribeAuditingPage,
  meta: {
    authority:['assessor']
  }
},{
  path: '/subscribeAuditing/subscribeAuditingLogs/:id',
  name: 'SubscribeAuditingLogs',
  component: SubscribeAuditingLogsPage,
  meta: {
    authority:['assessor']
  }
}]
