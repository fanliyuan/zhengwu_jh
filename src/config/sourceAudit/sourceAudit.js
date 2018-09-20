/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/19
 *
 * 描述 ：资源审核配置数据
 */

class sourceAuditOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '资源审核',
      apis: {
        listApi: 'resourceList',
        editApi: 'resourceReview',
        logApi: 'resourceReviewLog',
        detailApi: 'resourceDetail',
        mysqlColumnApi: 'resourceMysqlColumn',
        mysqlDataApi: 'resourceMysqlData'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
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
        formObj:{
          userId: '',
          roleIds: ''
        },
        oldFormObj:{
          userId: '',
          roleIds: ''
        },
        idObj: 'roleIds',
        ruleObj: {

        },
        widgets: [
          {
            type: 'radioGroup',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'roleIds',
            name: '',
            options: vm.roleList
          }
        ],
        titles: {
          editTitle: {
            name: '分配角色',
            showOkBtn: true
          }
        },
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
      initData: {
        name: '',
        dataType: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '数据类型',
            key: 'dataType'
          },
          {
            title: '注册时间',
            key: 'registerTime'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.status) {
                        case -1:
                          return '<span style="color: #5cadff">待审核</span>';
                        case 1:
                          return '<span style="color: #19be6b">已通过</span>';
                        case 0:
                          return '<span style="color: #ed4014">已拒绝</span>';
                      }
                    }()
                  }
                }, params.row.status)
              ])
            }
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let view = {
                props: {
                  type: 'success'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.view(params.row.id);
                  }
                }
              };
              let source = {
                props: {
                  type: 'success'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.source(params.row.id);
                  }
                }
              };
              let edit = {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.edit(params.row.id, params.row.type);
                  }
                }
              };
              let log = {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.log(params.row.id, params.row.type);
                  }
                }
              };
              switch (params.row.status) {
                case -1:
                  children.push(h('a', source, '资源'));
                  children.push(h('a', view, '查看'));
                  children.push(h('a', edit, '审核'));
                  break;
                case 1:
                  children.push(h('a', source, '资源'));
                  children.push(h('a', view, '查看'));
                  children.push(h('a', log, '审核日志'));
                  break;
                case 0:
                  children.push(h('a', view, '查看'));
                  children.push(h('a', log, '审核日志'));
              }
              return h('div', children);
            }
          }
        ]
      },
      pageData: {
        total: 0
      },
      filterData: {
        filiterObj: {
          name: '',
          dataType: '',
          status: '',
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'name',
            name: '资源名称',
            placeholder: '请输入资源名称'
          },
          {
            type: 'select',
            word: 'text',
            prop: 'dataType',
            name: '数据类型',
            placeholder: '请选择数据类型',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value: 'mysql',
                key: 'mysql'
              },
              {
                value: 'oracle',
                key: 'oracle'
              },
              {
                value: 'sqlserver',
                key: 'sqlserver'
              },
              {
                value: '文件',
                key: '文件'
              },
              {
                value: 'ftp',
                key: 'ftp'
              }
            ]
          },
          {
            type: 'select',
            word: 'text',
            prop: 'status',
            name: '审核状态',
            placeholder: '请选择审核状态',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value: -1,
                key: '待审核'
              },
              {
                value: 1,
                key: '已通过'
              },
              {
                value: 0,
                key: '已拒绝'
              }
            ]
          },
          {
            type: 'dateRange',
            word: 'daterange',
            prop: 'timeRange',
            disabled: false,
            name: '时间段',
            placeholder: '请选择时间段'
          }
        ]
      },
      opreationData: [
      ]
    }
  }
}

export default (data) => {
  return new sourceAuditOptions(data);
}
