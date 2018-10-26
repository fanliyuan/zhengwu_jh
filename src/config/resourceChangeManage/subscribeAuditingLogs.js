/**
 * Created by Administrator on 2018/10/25 0025.
 */
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
      publishData: {},
      detailNameData: {
        subscriber: '申请人',
        subscribeTime: '申请时间',
        higherUpName: '上级审核人',
        higherUpStatus: '上级审核结果',
        higherUpReason: '上级拒绝理由',
        higherUpReviewTime: '上级审核时间',
      },
      publishNameData: {
        subscriber: '申请人',
        subscribeTime: '申请时间',
        reviewer: '发布方审核人',
        status: '发布方审核结果',
        reason: '发布方拒绝理由',
        reviewTime: '发布方审核时间',
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
