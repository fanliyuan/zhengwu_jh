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
      title: '查看授权',
      isBackBtn: {
        name: '返回'
      },
      apis: {
        detailApi: 'subscribeAuditDetail',
        modalDetailApi: 'resourceDetail',
        mysqlColumnApi: 'resourceMysqlColumn',
        mysqlDataApi: 'resourceMysqlData',
        connectApi: 'resourceConnect',
        mountResourceIdApi: 'mountResourceId'

      },
      resourceId: '',
      detailTitleData: {
        infoCode: '',
        name: '',
        providerName: '',
        registerTime: ''
      },
      detailTitle: {
        infoCode: '目录编码',
        name: '名称',
        providerName: '提供方',
        registerTime: '创建时间'
      },
      resourceData: {
        resourceName: '',
        dataType: '',
        node: '',
        institutions: '',
        registerTime: '',
      },
      resourceNameData: {
        resourceName: '资源名称',
        dataType: '数据类型',
        node: '节点',
        institutions: '所属机构',
        registerTime: '注册时间',
      },
      subscriptionData: {
        subscriberName: '',
        subscribeInstitution: '',
        subTime: '',
        status: '',
        reviewReason: '',
      },
      subscriptionNameData: {
        subscriberName: '订阅节点',
        subscribeInstitution: '订阅机构',
        subTime: '订阅时间',
        status: '授权状态',
        reviewReason: '拒绝原因',
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
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        currentDataBase: '',
        infoObj: [
          {
            name: '资源名称',
            key: 'name'
          },
          {
            name: '应用系统名称',
            key: 'appsysName'
          },
          {
            name: '数据库名称',
            key: 'dbName'
          },
          {
            name: '数据库表名',
            key: 'tableName'
          },
          {
            name: '建库单位',
            key: 'createUnit'
          },
          {
            name: '摘要',
            key: 'summary'
          }
        ],
        sqlTableTable: {
          dbName: '',
          tableName: '',
          tableNote: ''
        },
        sqlColumnTable: {
          loading: true,
          tableList: [],
          total: 0,
          initData: {},
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '主键',
              key: 'primaryKey'
            },
            {
              title: '字段名称',
              key: 'name'
            },
            {
              title: '数据类型',
              key: 'type'
            },
            {
              title: '中文标注',
              key: 'comment'
            }
          ]
        },
        sqlDataTable: {
          loading: true,
          tableList: [],
          total: 0,
          currentPage: 1,
          initData: {
            pageNum: 1,
            pageSize: 10
          },
          columns: []
        },
      },
    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}
