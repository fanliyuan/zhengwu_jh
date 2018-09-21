/**
 * Created by Administrator on 2018/9/21 0021.
 */
/**
 * Created by Administrator on 2018/9/19 0019.
 */
/**
 * Created by Administrator on 2018/9/18 0018.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/13
 *
 * 描述 ：目录管理信息项配置数据
 */

class catalogItemOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '审核日志',
      isBackBtn: {
        name: '返回'
      },
      apis: {
        detailApi: 'auditLogs'
      },
      detailData: {},
      detailNameData: {
        subscriber: '申请人',
        subscribeTime: '申请时间',
        reviewer: '审核人',
        reviewTime: '审核时间',
        status: '审核结果',
        reason: '拒绝理由',
      },
      initData: {
        id: '',
        name: '',
        code: '',
        shareType: '',
        openType: '',
        pageNum: 1,
        pageSize: 10
      },

    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}
