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

  //机构用户管理
  userManagerList: {url: '/mgr/userList', method: 'get'},

  //机构用户管理
  userList: { url: '/mgr/userList', method: 'get' }, //用户列表
  userAdd: { url: '/mgr/add1', method: 'post'},
  roleList: { url: '/role/roleList', method: 'get' }, //角色列表
  roleUpdate: { url: '/mgr/setRole1', method: 'post' }, //设置用户角色

}
