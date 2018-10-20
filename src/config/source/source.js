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
    vm.incrementList = [];
    return {
      title: '资源管理',
      apis: {
        addApi: 'resourceAdd',
        addFilesApi: 'resourceFilesAdd',
        addFtpApi: 'resourceFtpAdd',
        deleteApi: 'resourceDelete',
        detailApi: 'resourceDetail',
        detailFileApi: 'resourceFileDetail',
        detailFtpApi: 'resourceFtpDetail',
        listApi: 'resourceList',
        editApi: 'resourceUpdate',
        connectApi: 'resourceConnect',
        mysqlColumnApi: 'resourceMysqlColumn',
        mysqlDataApi: 'resourceMysqlData',
        mysqlDbApi: 'resourceMysqlDb',
        mysqlTableApi: 'resourceMysqlTable',
        mysqlStructApi: 'resourceMysqlStruct',
        fileUp: 'resourceFileUp',
        fileDown: 'resourceFileDown',
        ftpDataApi: 'resourceFtpData',
        sameNameApi: 'resourceSameName'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        current: 0,
        currentDataBase: '',
        currentType: 'sql',
        fileNext: false,
        ftpList: [],
        stepTwoName: '选择数据库',
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
        infoFileAndFtpObj: [
          {
            name: '资源名称',
            key: 'name'
          },
          {
            name: '应用系统名称',
            key: 'appsysName'
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
          name: '',
          summary: '',
          dbType: [1, 3],
          appsysName: '',
          createUnit: '',
          dbDescribe: '',
          dutyName: '',
          dutyPhone: '',
          dutyPosition: ''
        },
        formTimeObj: {},
        oldFormObj:{
          name: '',
          summary: '',
          dbType: [1, 3],
          appsysName: '',
          createUnit: '',
          dbDescribe: '',
          dutyName: '',
          dutyPhone: '',
          dutyPosition: ''
        },
        oldFormTimeObj:{},
        sqlObj: {
          addr: '',
          port: '',
          username: '',
          password: '',
          alias: '',
          dbName: '',
          resourceType: '',
          structAddDtoList: [],
          tableName: '',
          tableNote: ''
        },
        timeObj: {
          incrementField: '',
          collectMode: [],
          collectRate: '',
          timeSet: ''
        },
        ftpObj: {
          alias: '',
          addr: '',
          port: '',
          username: '',
          password: '',
          ftpfileAddDtoList: []
        },
        filesObj: {
          fileAddDtoList: []
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
          dutyPhone: [
            {
              pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
              message: '请输入正确的手机号'
            }
          ]
        },
        setRuleTimeObj: {
          collectMode: [
            {
              required: true,
              type: 'array',
              message: '请选择采集模式',
              trigger: 'change'
            }
          ],
          collectRate: [
            {
              required: true,
              message: '请选择采集频率',
              trigger: 'change'
            }
          ],
          timeSet: [

          ]
        },
        ftpRuleObj: {
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
              message: '请输入FTP地址',
              trigger: 'blur'
            }
          ],
          port: [
            {
              required: true,
              message: '请输入FTP端口',
              trigger: 'blur'
            }
          ],
          username: [
            {
              required: true,
              message: '请输入FTP用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入FTP密码',
              trigger: 'blur'
            }
          ],
          dutyPhone: [
            {
              pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
              message: '请输入正确的手机号'
            }
          ]
        },
        filesRuleObj: {
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
          dutyPhone: [
            {
              pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
              message: '请输入正确的手机号'
            }
          ]
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
                disabled: false,
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
            word: 'password',
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
        setWidgetsTimeObj: [
          {
            type: 'selectCascader',
            disabled: false,
            show: true,
            prop: 'collectMode',
            name: '采集模式',
            placeholder: '请选择采集模式',
            options: [
              {
                label: '增量',
                value: '1',
                children: [
                  {
                    value: '5',
                    label: '日志'
                  },
                  {
                    value: '1',
                    disabled: true,
                    label: '增量字段'
                  }
                ]
              },
              {
                label: '全量',
                value: '4'
              }
            ]
          },
          {
            type: 'select',
            disabled: true,
            show: false,
            prop: 'incrementField',
            name: '增量字段',
            placeholder: '请选择增量字段',
            options: vm.incrementList
          },
          {
            type: 'select',
            disabled: false,
            show: true,
            prop: 'collectRate',
            name: '采集频率',
            placeholder: '请选择采集频率',
            options: [
              {
                key: '定时',
                value: '1'
              },
              {
                key: '实时',
                value: '2'
              },
              {
                key: '手动',
                value: '3'
              }
            ]
          }
        ],
        ftpWidgetsObj: [
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
                disabled: false,
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
            name: 'FTP地址',
            placeholder: '请输入FTP地址'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'port',
            name: 'FTP端口',
            placeholder: '请输入FTP端口'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'username',
            name: '用户名',
            placeholder: '请输入FTP用户名'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'password',
            prop: 'password',
            name: '密码',
            placeholder: '请输入FTP密码'
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
        filesWidgetsObj: [
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
                disabled: false,
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
        //idObj: 'xaobBannerId',
        ruleObj: {},
        ruleTimeObj: {},
        widgets: [],
        widgetsTime: [],
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
                    switch (params.row.type) {
                      case 'db':
                        vm.view(params.row.id, vm.apis.detailApi, vm.modalData.infoObj);
                        break;
                      case 'file':
                        vm.view(params.row.id, vm.apis.detailFileApi, vm.modalData.infoFileAndFtpObj);
                        break;
                      case 'ftp':
                        vm.view(params.row.id, vm.apis.detailFtpApi, vm.modalData.infoFileAndFtpObj);
                        break;
                    }
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
              if (params.row.xg) {
                children.push(h('a', edit, '修改'));
              }

              if (params.row.sc) {
                children.push(h('a', del, '删除'));
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
