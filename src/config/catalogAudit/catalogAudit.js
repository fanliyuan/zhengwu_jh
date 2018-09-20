/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/19
 *
 * 描述 ：目录审核配置数据
 */

class catalogAuditOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '目录审核',
      apis: {
        listApi: 'catalogList',
        editApi: 'catalogReview',
        logApi: 'catalogReviewLog'
      },
      initData: {
        infoCode: '',
        name: '',
        providerName: '',
        status: '',
        mount: false,
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
            title: '目录编码',
            key: 'infoCode'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '提供方',
            key: 'dataType'
          },
          {
            title: '注册时间',
            key: 'registerTime'
          },
          {
            title: '是否挂载资源',
            key: 'havaGj',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.havaGj) {
                        case true:
                          return '是';
                        case false:
                          return '否';
                      }
                    }()
                  }
                }, params.row.havaGj)
              ])
            }
          },
          {
            title: '信息项',
            key: 'xxx',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.xxx) {
                        case true:
                          return '是';
                        case false:
                          return '否';
                      }
                    }()
                  }
                }, params.row.xxx)
              ])
            }
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
              let log = {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    vm.log(params.row.id);
                  }
                }
              };
              switch (params.row.status) {
                case -1:
                  children.push(h('a', view, '查看'));
                  children.push(h('a', edit, '审核'));
                  break;
                case 1:
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
          infoCode: '',
          name: '',
          providerName: '',
          status: '',
          mount: false,
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'infoCode',
            name: '目录编码',
            placeholder: '请输入目录编码'
          },
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
      ]
    }
  }
}

export default (data) => {
  return new catalogAuditOptions(data);
}
