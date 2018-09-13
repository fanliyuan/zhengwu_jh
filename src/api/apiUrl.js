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

  //目录管理
  catalogAdd: { url: '/api/v2/daas/swap/resource', method: 'post' }, //新建资源
  catalogConnect: { url: '/api/v2/daas/swap/resource/connect', method: 'get'}, //连接测试
  catalogList: { url: '/api/v2/daas/swap/resource/list', method: 'get' }, //资源列表
  catalogDelete: { url: '/api/v2/daas/swap/resource', method: 'post' }, //删除资源
  catalogDetail: { url: '/api/v2/daas/swap/resource', method: 'get' }, //资源详情
  catalogUpdate: { url: '/api/v2/daas/swap/resource', method: 'post' }, //修改资源

}
