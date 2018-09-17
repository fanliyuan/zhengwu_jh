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
  resourceAdd: { url: '/api/v2/daas/swap/resource/db', method: 'post' }, //新建资源实体
  resourceConnect: { url: '/api/v2/daas/swap/resource/connect', method: 'get'}, //连接测试
  resourceList: { url: '/api/v2/daas/swap/resource/itemList', method: 'get' }, //资源实体列表
  resourceDelete: { url: '/api/v2/daas/swap/resource/item', method: 'delete' }, //删除资源实体
  resourceDetail: { url: 'api/v2/daas/swap/resource/db', method: 'get' }, //资源详情
  resourceUpdate: { url: '/api/v2/daas/swap/resource/db', method: 'put' }, //修改资源
  resourceMysqlColumn: { url: '/api/v2/daas/swap/resource/mysql/column', method: 'get' }, //获取mysql指定库表的字段list
  resourceMysqlDb: { url: '/api/v2/daas/swap/resource/mysql/db', method: 'get' }, //获取mysql的数据库list
  resourceMysqlTable: { url: '/api/v2/daas/swap/resource/mysql/table', method: 'get' }, //获取mysql指定库的数据表list

  //目录管理
  catalogAdd: { url: '/api/v2/daas/swap/resource', method: 'post' }, //新建资源
  catalogList: { url: '/api/v2/daas/swap/resource/list', method: 'get' }, //资源列表
  catalogDelete: { url: '/api/v2/daas/swap/resource', method: 'delete' }, //删除资源
  catalogDetail: { url: '/api/v2/daas/swap/resource', method: 'get' }, //资源详情
  catalogUpdate: { url: '/api/v2/daas/swap/resource', method: 'put' }, //修改资源
  catalogItemsList: { url: '/api/v2/daas/swap/resource/{id}/infoList/', method: 'get' }, //获取资源信息项
  catalogShareDetail: { url: '/api/v2/daas/swap/resource/{id}/shareopen', method: 'get' }, //获取资源共享开放信息
  catalogShareUpdate: { url: '/api/v2/daas/swap/resource/{id}/shareopen', method: 'put' }, //修改资源共享开放信息

  //资源集市
  resourceBazaar: { url: '/api/v2/daas/swap/resourceBazaar/list', method: 'get' }, //获取资源集市列表
  showCatalogList: { url: '/api/v2/daas/swap/catalog/list', method: 'get' } //获取目录列表
}
