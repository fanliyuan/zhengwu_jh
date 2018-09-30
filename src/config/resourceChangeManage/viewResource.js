/**
 * Created by Administrator on 2018/9/29 0029.
 */
/**
 * Created by Administrator on 2018/9/29 0029.
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
      title: '资源',
      isBackBtn: {
        name: '返回'
      },
      apis: {
        listApi: 'subscribeResourceList',
        tableListApi: 'tableList',
        tableStructureListApi: 'tableStructureList',
        tableDataListApi: 'tableDataList',
        detailsApi: 'subscribeResourceDetail'
      },
      detailData: {
        dbName: '',
        dbType: '',
        dsName: '',
        publishInstitution: '',
        updateTime: '',
      },
      detailNameData: {
        dbName: '数据库',
        dbType: '数据类型',
        dsName: '资源名称',
        publishInstitution: '所属机构',
        updateTime: '数据更新时间',
      },
      dataTableTotal: '',
      dataItemTotal: '',
      dataItemTotal1: '',
      showStructureTable: true,
      showViewTable: false,
      initData: {
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            width: 70,
          },
          {
            title: '表名称',
            key: 'name'
          },
          {
            title: '中文标注',
            key: 'comment'
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let view = {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px',
                  color:'#3fa9ff',
                  cursor:'pointer'
                },
                on: {
                  click: () => {
                    vm.view("浏览",params.row.name);
                  }
                }
              };
              let audit = {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px',
                  color:'#3fa9ff',
                  cursor:'pointer'
                },
                on: {
                  click: () => {
                    vm.view("结构",params.row.name);
                  }
                }
              };
              children.push(h('span', view, '浏览'));
              children.push(h('span', audit, '结构'));
              return h('div', children);
            }
          }
        ]
      },
      pageData: {
        total: 0
      },
      initData1: {
        pageNum: 1,
        pageSize: 10,
        tableName: ''
      },
      tableData1: {
        loading: true,
        tableList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            width: 70,
          },
          {
            title: '主键',
            key: 'name'
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
          },
        ]
      },
      pageData1: {
        total: 0
      },
      initData2: {
        pageNum: 1,
        pageSize: 10,
        tableName: ''
      },
      tableData2: {
        loading: true,
        tableList: [],
        columns: []
      },
      pageData2: {
        total: 0
      },
    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}
