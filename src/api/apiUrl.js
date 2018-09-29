/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/20
 *
 * 描述 ：api请求地址
 */
export default {
  //登录
  login: { url: '/login1', method: 'post' },

  //节点数据
  nodeInfo: { url: '/nodeInfo', method: 'get' },

  //机构用户管理
  userManagerList: {url: '/mgr/userList', method: 'get'},

  //机构用户管理
  userList: { url: '/mgr/userList', method: 'get' }, //用户列表
  userAdd: { url: '/mgr/add1', method: 'post'}, //用户列表添加
  userUnfreeze: { url: '/mgr/unfreeze1', method: 'post'}, //用户状态启用
  userFreeze: { url: '/mgr/freeze1', method: 'post'}, //用户状态冻结
  userDelete: { url: '/mgr/delete1' ,method: 'delete'},//用户删除
  userDetail: { url: '/mgr/userInfo', method: 'get'}, //用户详情
  userEdit: { url: '/mgr/edit1', method: 'put'}, //用户编辑
  roleList: { url: '/role/roleList', method: 'get' }, //角色列表
  roleUpdate: { url: '/mgr/setRole1', method: 'post' }, //设置用户角色

  //资源管理
  resourceAdd: { url: '/api/v2/zhengwu/swap/resource/db', method: 'post' }, //新建资源实体
  resourceConnect: { url: '/api/v2/zhengwu/swap/resource/connect', method: 'get'}, //连接测试
  resourceList: { url: '/api/v2/zhengwu/swap/resource/itemList', method: 'get' }, //资源实体列表
  resourceDelete: { url: '/api/v2/zhengwu/swap/resource/item', method: 'delete' }, //删除资源实体
  resourceDetail: { url: 'api/v2/zhengwu/swap/resource/db', method: 'get' }, //资源详情
  resourceUpdate: { url: '/api/v2/zhengwu/swap/resource/db', method: 'put' }, //修改资源
  resourceMysqlColumn: { url: '/api/v2/zhengwu/swap/resource/mysql/column', method: 'get' }, //获取mysql指定库表的字段list
  resourceMysqlData: { url: '/api/v2/zhengwu/swap/resource/mysql/data', method: 'get' }, //获取mysql指定库表的数据list
  resourceMysqlDb: { url: '/api/v2/zhengwu/swap/resource/mysql/db', method: 'get' }, //获取mysql的数据库list
  resourceMysqlTable: { url: '/api/v2/zhengwu/swap/resource/mysql/table', method: 'get' }, //获取mysql指定库的数据表list
  resourceMysqlStruct: { url: '/api/v2/zhengwu/swap/resource/db/{id}/struct', method: 'get' }, //获取mysql指定库的数据表结构
  resourceReview: { url: '/api/v2/zhengwu/swap/resource/{type}/{id}/review', method: 'post' }, //资源审核
  resourceReviewLog: { url: '/api/v2/zhengwu/swap/resource/{type}/{id}/review', method: 'get' }, //资源审核日志

  //目录管理
  catalogAdd: { url: '/api/v2/zhengwu/swap/resource', method: 'post' }, //新建资源
  catalogList: { url: '/api/v2/zhengwu/swap/resource/list', method: 'get' }, //资源列表
  catalogDelete: { url: '/api/v2/zhengwu/swap/resource', method: 'delete' }, //删除资源
  catalogDetail: { url: '/api/v2/zhengwu/swap/resource', method: 'get' }, //资源详情
  catalogUpdate: { url: '/api/v2/zhengwu/swap/resource', method: 'put' }, //修改资源
  catalogItemsList: { url: '/api/v2/zhengwu/swap/resource/{id}/infoList/', method: 'get' }, //获取资源信息项
  catalogShareDetail: { url: '/api/v2/zhengwu/swap/resource/{id}/shareopen', method: 'get' }, //获取资源共享开放信息
  catalogShareUpdate: { url: '/api/v2/zhengwu/swap/resource/{id}/shareopen', method: 'put' }, //修改资源共享开放信息
  catalogMount: { url: '/api/v2/zhengwu/swap/resource/{id}/mount', method: 'post' }, //资源挂接
  catalogReview: { url: '/api/v2/zhengwu/swap/resource/{id}/review', method: 'post' }, //目录审核
  catalogReviewLog: { url: '/api/v2/zhengwu/swap/resource/{id}/review', method: 'get' }, //目录审核日志

  //资源集市
  resourceBazaar: { url: '/api/v2/zhengwu/swap/resourceBazaar/list', method: 'get' }, //获取资源集市列表
  showCatalogList: { url: '/api/v2/zhengwu/swap/catalog/list', method: 'get' }, //获取目录列表
  subscribe: { url: '/api/v2/zhengwu/swap/resourceBazaar/subscribe', method: 'post' }, //提交订阅资源
  subscribeAuditList: { url: '/api/v2/zhengwu/swap/resourceBazaar/subscribeAuditList', method: 'get' }, //订阅审核列表
  subscribeAudit: { url: '/api/v2/zhengwu/swap/resourceBazaar/subscribeAudit', method: 'post' }, //提交订阅审核
  subscribeAuditDetail: { url: '/api/v2/zhengwu/swap/resourceBazaar/subscribeAuditDetail', method: 'get' }, //审核详情
  subscribeResourceDetail: { url: '/api/v2/zhengwu/swap/resourceBazaar/resourceDetails', method: 'get' }, //资源详情
  subscribeResourceList: { url: '/api/v2/zhengwu/swap/resourceBazaar/resourceItemList', method: 'get' }, //资源详情列表
  resourceTaskInfo: { url: 'api/v2/zhengwu/swap/resourceBazaar/resourceTaskInfo', method: 'get' }, //任务发布模式、


  //所有订阅
  allSubscribeList: { url: '/api/v2/zhengwu/swap/resourceBazaar/subscribeList', method: 'get' }, //所有订阅列表
  auditLogs: { url: '/api/v2/zhengwu/swap/resourceBazaar/reviewLog', method: 'get' }, //审核日志
  run: { url: '/api/v2/zhengwu/swap/resourceBazaar/run', method: 'post' }, //运行
  stop: { url: '/api/v2/zhengwu/swap/resourceBazaar/stop', method: 'post' }, //运行


  //资源交换管理-资源管理
  managementList: {url: '/api/v2/zhengwu/swap/resourceBazaar/managementList', method: 'get'}, //资源管理列表
  tableList: {url: '/api/v2/zhengwu/swap/resourceBazaar/tableList', method: 'get'}, //数据库表列表
  tableStructureList: {url: '/api/v2/zhengwu/swap/resourceBazaar/tableStructureList', method: 'get'}, //数据库表列表
  tableDataList: {url: '/api/v2/zhengwu/swap/resourceBazaar/tableDataList', method: 'get'} //数据库表列表
}
