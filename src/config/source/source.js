/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/26
 *
 * 描述 ：资源管理配置数据
 */

class sourceOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '资源管理',
      apis: {
        addApi: 'resourceAdd',
        deleteApi: 'resourceDelete',
        detailApi: 'resourceDetail',
        listApi: 'resourceList',
        editApi: 'resourceUpdate',
        connectApi: 'resourceConnect',
        mysqlColumnApi: 'resourceMysqlColumn',
        mysqlDataApi: 'resourceMysqlData',
        mysqlDbApi: 'resourceMysqlDb',
        mysqlTableApi: 'resourceMysqlTable',
        mysqlStructApi: 'resourceMysqlStruct'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        current: 0,
        currentDataBase: '',
        dataType: {
          '1-1': 'oracle',
          '1-2': 'sqlserver',
          '1-3': 'mysql',
          '1-4': 'kingbase',
          '1-5': 'dm',
          '2-1': 'ftp',
          '2-2': 'sftp'
        },
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
        },
        oldFormObj:{},
        sqlObj: {
          name: '',
          summary: '',
          dbType: [1, 1],
          addr: '',
          port: '',
          username: '',
          password: '',
          alias: '',
          appsysName: '',
          createUnit: '',
          dbDescribe: '',
          dbName: '',
          dutyName: '',
          dutyPhone: '',
          dutyPosition: '',
          resourceType: '',
          structAddDtoList: [],
          tableName: '',
          tableNote: ''
        },
        ftpObj: {

        },
        filesObj: {

        },
        sqlRuleObj: {
          name: [
            {
              required: true,
              message: '名称不能为空',
              trigger: 'blur'
            },
            {
              max: 20,
              message: '名称长度不能大于20个字符'
            }
          ],
          summary: [
            {
              required: true,
              message: '摘要不能为空',
              trigger: 'blur'
            }
          ],
          dbType: [
            {
              required: true,
              type: 'array',
              message: '请选择数据类型',
              trigger: 'change'
            }
          ],
          addr: [
            {
              required: true,
              message: '请输入数据库地址',
              trigger: 'blur'
            }
          ],
          port: [
            {
              required: true,
              message: '请输入数据库端口',
              trigger: 'blur'
            }
          ],
          username: [
            {
              required: true,
              message: '请输入数据库用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入数据库密码',
              trigger: 'blur'
            }
          ],
          createUnit: [
            {
              required: true,
              message: '请输入建库单位',
              trigger: 'blur'
            }
          ],
          appsysName: [
            {
              required: true,
              message: '请输入应用系统名称',
              trigger: 'blur'
            }
          ]
        },
        ftpRuleObj: {

        },
        filesRuleObj: {

        },
        sqlWidgetsObj: [
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'name',
            name: '名称',
            placeholder: '请输入名称'
          },
          {
            type: 'textarea',
            disabled: false,
            show: true,
            word: 'textarea',
            rows: 6,
            prop: 'summary',
            name: '摘要',
            placeholder: '请输入描述'
          },
          {
            type: 'selectCascader',
            disabled: false,
            show: true,
            prop: 'dbType',
            name: '类型',
            placeholder: '请选择类型',
            options: [
              {
                label: '关系型数据库',
                value: 1,
                children: [
                  {
                    value: 1,
                    label: 'Oracle'
                  },
                  {
                    value: 2,
                    label: 'SQLserver'
                  },
                  {
                    value: 3,
                    label: 'MySQL'
                  },
                  {
                    value: 4,
                    label: 'Kingbase'
                  },
                  {
                    value: 5,
                    label: 'DM'
                  }
                ]
              },
              {
                label: '半结构化存储',
                value: 2,
                disabled: true,
                children: [
                  {
                    value: 1,
                    label: 'FTP'
                  },
                  {
                    value: 2,
                    label: 'SFTP'
                  },
                  {
                    value: 3,
                    label: '本地文件'
                  }
                ]
              }
            ]
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'addr',
            name: '数据库地址',
            placeholder: '请输入数据库地址'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'port',
            name: '数据库端口',
            placeholder: '请输入数据库端口'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'username',
            name: '数据库用户名',
            placeholder: '请输入数据库用户名'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'password',
            name: '数据库密码',
            placeholder: '请输入数据库密码'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'createUnit',
            name: '建库单位',
            placeholder: '请输入建库单位'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'appsysName',
            name: '应用系统名称',
            placeholder: '请输入应用系统名称'
          },
          {
            type: 'textarea',
            disabled: false,
            show: true,
            word: 'textarea',
            rows: 6,
            prop: 'dbDescribe',
            name: '数据库描述',
            placeholder: '请输入数据库描述'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'dutyName',
            name: '负责人姓名',
            placeholder: '请输入负责人姓名'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'dutyPhone',
            name: '负责人手机号',
            placeholder: '请输入负责人手机号'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'dutyPosition',
            name: '负责人职位',
            placeholder: '请输入负责人职位'
          }
        ],
        ftpWidgetsObj: [],
        filesWidgetsObj: [],
        //idObj: 'xaobBannerId',
        ruleObj: {},
        widgets: [],
        sqlDbTable: {
          options: []
        },
        sqlTableTable: {
          loading: true,
          tableList: [],
          total: 0,
          currentPage: 1,
          initData: {
            pageNum: 1,
            pageSize: 10
          },
          columns: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '表名称',
              key: 'name'
            },
            {
              title: '中文标注',
              key: 'comment'
            }
          ]
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
        titles: {
          viewTitle: {
            name: '查看资源',
            showOkBtn: false
          },
          addTitle: {
            name: '新建资源',
            showOkBtn: true
          },
          editTitle: {
            name: '修改资源',
            showOkBtn: true
          }
        }
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
        selectedIds: [],
        loading: true,
        tableList: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '资源名称',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.name
                  }
                }, params.row.name)
              ])
            }
          },
          {
            title: '数据类型',
            key: 'dataType'
          },
          {
            title: '数据更新时间',
            key: 'updateTime'
          },
          {
            title: '审核状态',
            key: 'status',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.status) {
                        case 1:
                          return '<span style="color: #5cadff">待审核</span>';
                        case 2:
                          return '<span style="color: #19be6b">已通过</span>';
                        case 3:
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
              let edit = {
                props: {
                  type: 'primary'
                },
                domProps: {
                  disabled: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.edit(params.row.id);
                  }
                }
              };
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
              let del = {
                props: {
                  type: 'error'
                },
                on: {
                  click: () => {
                    vm.$Modal.confirm({
                      title: '信息',
                      content: '是否删除选择的信息？',
                      onOk: function () {
                        vm.deleteItem(params.row.id, params.row.type);
                      }
                    });
                  }
                }
              };
              children.push(h('a', view, '查看'));
              children.push(h('a', edit, '修改'));
              children.push(h('a', del, '删除'));
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
                value: 1,
                key: '待审核'
              },
              {
                value: 2,
                key: '已通过'
              },
              {
                value: 3,
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
        {
          name: '新建',
          icon: 'md-add',
          color: 'primary',
          type: 'add'
        },
        {
          name: '删除',
          icon: 'md-remove',
          color: 'error',
          type: 'deleteItem'
        }
      ]
    }
  }
}

export default (data) => {
  return new sourceOptions(data);
}