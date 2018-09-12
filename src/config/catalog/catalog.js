/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/12
 *
 * 描述 ：目录管理配置数据
 */

class catalogOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '目录管理',
      apis: {
        addApi: 'catalogAdd',
        deleteApi: 'catalogDelete',
        detailApi: 'catalogDetail',
        listApi: 'catalogList',
        editApi: 'catalogUpdate',
        connectApi: 'catalogConnect'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        formObj:{
          name: '',
          summary: '',
          classify: '',
          providerName: '',
          providerDept: '',
          providerNo: '',
          infoCode: '',
          infoFormat: '',
          infoAddDtoList: [
            {
              code: '',
              dataLength: '',
              dataType: '',
              name: '',
              openCondition: '',
              openType: '',
              shareCondition: '',
              shareModeClassify: '',
              shareModeType: '',
              shareType: ''
            }
          ]
        },
        oldFormObj:{
          name: '',
          summary: '',
          classify: '',
          providerName: '',
          providerDept: '',
          providerNo: '',
          infoCode: '',
          infoFormat: '',
          infoAddDtoList: [
            {
              code: '',
              dataLength: '',
              dataType: '',
              name: '',
              openCondition: '',
              openType: '',
              shareCondition: '',
              shareModeClassify: '',
              shareModeType: '',
              shareType: ''
            }
          ]
        },
        idObj: 'id',
        ruleObj: {
          name: [
            {
              required: true,
              message: '名称不能为空',
              trigger: 'blur'
            }
          ],
          summary: [
            {
              required: true,
              message: '摘要不能为空',
              trigger: 'blur'
            }
          ],
          classify: [
            {
              required: true,
              message: '请选择分类',
              trigger: 'blur'
            }
          ],
          providerName: [
            {
              required: true,
              message: '提供方名称不能为空',
              trigger: 'blur'
            }
          ],
          providerDept: [
            {
              required: true,
              message: '提供方内部部门不能为空',
              trigger: 'blur'
            }
          ],
          providerNo: [
            {
              required: true,
              message: '资源提供方代码不能为空',
              trigger: 'blur'
            }
          ],
          infoCode: [
            {
              required: true,
              message: '信息资源编码不能为空',
              trigger: 'blur'
            }
          ],
          infoFormat: [
            {
              required: true,
              message: '请选择信息资源格式',
              trigger: 'blur'
            }
          ]
        },
        widgets: [
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
            type: 'input',
            disabled: false,
            show: true,
            word: 'textarea',
            prop: 'summary',
            name: '摘要',
            placeholder: '请输入描述'
          },
          {
            type: 'select',
            disabled: false,
            show: true,
            prop: 'classify',
            name: '分类',
            placeholder: '请选择分类',
            options: [
              {
                key: '分类1',
                value: '分类1'
              },
              {
                key: '分类2',
                value: '分类2'
              },
              {
                key: '分类21',
                value: '分类21'
              }
            ]
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'providerName',
            name: '提供方名称',
            placeholder: '请输入提供方名称'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'providerDept',
            name: '提供方内部部门',
            placeholder: '请输入提供方内部部门'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'providerNo',
            name: '资源提供方代码',
            placeholder: '请输入资源提供方代码'
          },
          {
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'infoCode',
            name: '信息资源编码',
            placeholder: '请输入信息资源编码'
          },
          {
            type: 'select',
            disabled: false,
            show: true,
            prop: 'infoFormat',
            name: '信息资源格式',
            placeholder: '请选择信息资源格式',
            options: [
              {
                key: '分类1',
                value: '分类1'
              },
              {
                key: '分类2',
                value: '分类2'
              },
              {
                key: '分类21',
                value: '分类21'
              }
            ]
          }
        ],
        titles: {
          addTitle: {
            name: '新建目录',
            showOkBtn: true
          },
          editTitle: {
            name: '编辑目录',
            showOkBtn: true
          }
        }
      },
      initData: {
        name: '',
        providerName: '',
        status: '',
        beginTime: '',
        endTime: '',
        mount: false,
        pageNum: 0,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '名称',
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
            title: '提供方',
            key: 'providerName'
          },
          {
            title: '审核状态',
            key: 'status'
          },
          {
            title: '注册时间',
            key: 'registerTime'
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
              let link = {
                props: {
                  type: 'light primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.link(params.row.id);
                  }
                }
              };
              let open = {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.open(params.row.id);
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
                        vm.deleteItem(params.row.id);
                      }
                    });
                  }
                }
              };
              children.push(h('Button', view, '信息项'));
              children.push(h('Button', link, 'view'));
              children.push(h('Button', open, '共享开放'));
              children.push(h('Button', edit, '修改'));
              children.push(h('Button', del, '删除'));
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
          providerName: '',
          status: '',
          beginTime: '',
          endTime: '',
          mount: false
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'name',
            name: '名称',
            placeholder: '请输入名称'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'providerName',
            name: '提供方',
            placeholder: '请输入提供方'
          },
          {
            type: 'select',
            prop: 'status',
            disabled: false,
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
          },
          {
            type: 'checkbox',
            word: 'checkbox',
            prop: 'mount',
            disabled: false,
            name: '已挂接资源'
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
          name: '导入',
          icon: 'md-cloud-upload',
          color: 'info',
          type: 'importFile'
        }
      ]
    }
  }
}

export default (data) => {
  return new catalogOptions(data);
}