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
  //雄安资讯
  newsList: { url: '/xaobNewsReleaseTest/list', method: 'get' },
  newsDetail: { url: '/xaobNewsReleaseTest/detail', method: 'get' },
  newsAdd: { url: '/xaobNewsReleaseTest/add', method: 'post' },
  //机构用户管理
  userList: { url: '/mgr/userList', method: 'get' }, //用户列表
  userAdd: { url: '/mgr/add1', method: 'post'},
  roleList: { url: '/role/roleList', method: 'get' }, //角色列表
  roleUpdate: { url: '/mgr/setRole', method: 'post' }, //设置用户角色
  newsUpdate: { url: '/xaobNewsReleaseTest/update', method: 'post' },
  newsDelete: { url: '/xaobNewsReleaseTest/delete', method: 'post' },
  newsRelease: { url: '/xaobNewsReleaseTest/sortByIds', method: 'post'},

  //banner管理
  bannerAdd: { url: '/bannerTest/add', method: 'post' },
  bannerDelete: { url: '/bannerTest/delete', method: 'post' },
  bannerDetail: { url: '/bannerTest/detail', method: 'get' },
  bannerList: { url: '/bannerTest/list', method: 'get' },
  bannerUpdate: { url: '/bannerTest/update', method: 'post' },

  //数字雄安
  parkPerceptionAdd: { url: '/xaobParkPerceptionTest/add', method: 'post' },
  parkPerceptionDelete: { url: '/xaobParkPerceptionTest/delete', method: 'post' },
  parkPerceptionDetail: { url: '/xaobParkPerceptionTest/detail', method: 'get' },
  parkPerceptionList: { url: '/xaobParkPerceptionTest/list', method: 'get' },
  parkPerceptionUpdate: { url: '/xaobParkPerceptionTest/update', method: 'post' },

  //问题反馈
  feedbackAdd: { url: '/feedbackTest/add', method: 'post' },
  feedbackDelete: { url: '/feedbackTest/delete', method: 'post' },
  feedbackDetail: { url: '/feedbackTest/detail', method: 'get' },
  feedbackList: { url: '/feedbackTest/list', method: 'get' }
}
