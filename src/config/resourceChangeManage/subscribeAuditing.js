/**
 * Created by Administrator on 2018/10/25 0025.
 */
/**
 * Created by Administrator on 2018/9/18 0018.
 */
/**
 * Created by Administrator on 2018/9/12 0012.
 */
/**
 * Created by Administrator on 2018/9/11 0011.
 */
/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：分配角色配置数据
 */

class resourceBazaarOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    //vm.roleList = []
    vm.filterRoleList = [{value:'',key:'全部'}];
    vm.statusList = [];
    //vm.treeData = [];
    return {
      title: '订阅审核',
      apis: {
        listApi: 'higherUpAuditList',
        showCatalogListApi: 'showCatalogList',
        subscribeAuditListApi: 'subscribeAuditList',
        higherUpAuditApi: 'higherUpAudit'
      },
      treeData: [],
      currentTreeNode: '',
      catalogId: '',
      higherUpStatus: 1,
      higherUpReason: '',
      modalOpreation: false,
      modalOk: true,
      showReason: false,
      modalWidgets: {},
      modalOkData: {
        higherUpStatus: 1,
        higherUpReason: "string",
        id: "string",
      },
      modalData: {
        data:{
          reason: '',
          codeReply: ''
        },
        widgets: [
          {
            type: 'radioGroup',
            disabled: false,
            show: true,
            showReason: true,
            word: 'text',
            prop: 'roleIds',
            name: '',
            options:[
              {
                value: 1,
                key: "通过"
              },
              {
                value: 2,
                key: "拒绝"
              }
            ]
          }
        ],
        titles: {
          editTitle: {
            name: '授权',
            showOkBtn: true
          }
        }
      },
      defaultInitData: {
        // catalogId: '',
        pageNum: 1,
        pageSize: 10,
        dsName: '',
        subscriberPeople: '',
        beginTime: '',
        endTime: ''
      },
      initData: {
        // catalogId: '',
        pageNum: 1,
        pageSize: 10,
        dsName: '',
        subscriberName: '',
        subscriber: '',
        higherUpStatus: '',
        beginTime: '',
        endTime: ''
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: 'ID',
            key: 'id',
          },
          // {
          //   title: '订阅名称',
          //   key: 'subscriberName',
          // },
          {
            title: '订阅名称',
            key: 'subscribeName',
          },
          {
            title: '信息资源名称',
            key: 'dsName',
          },
          {
            title: '数据名称',
            key: 'dataName',
          },
          {
            title: '订阅申请人',
            key: 'subscriber',
          },
          {
            title: '订阅申请时间',
            key: 'subscribeTime',
          },
          {
            title: '审核状态',
            key: 'higherUpStatus',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.higherUpStatus) {
                        case -1:
                          return '<span style="color: #5cadff">待审批</span>';
                        case 1:
                          return '<span style="color: #19be6b">已通过</span>';
                        case 0:
                          return '<span style="color: #ed4014">已拒绝</span>';
                      }
                    }()
                  }
                }, params.row.higherUpStatus)
              ])
              /*
               if (params.row.status === -1) {
               return '<span style="color: #5cadff">待授权</span>';
               } else if (params.row.status === 1) {
               return '<span style="color: #19be6b">已通过</span>';
               } else if (params.row.status === 0) {
               return '<span style="color: #ed4014">已拒绝</span>';
               }*/
            }
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let statusNames = "";
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
                    vm.auditingDetail(params.row.dsId,params.row.subId,params.row.subscriberId,params.row.id);
                  }
                }
              };
              if (params.row.higherUpStatus === -1 ) {
                statusNames = '审核';
              } else {
                statusNames = '审核日志';
              }
              let edit = {
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
                    if ( statusNames == '审核') {
                      vm.auditing(params.row.id,params.row.higherUpStatus);
                    } else {
                      vm.auditingDetail(params.row.id);
                    }
                  }
                }
              };
              children.push(h('span', view, '查看'));
              children.push(h('span', edit, statusNames));

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
          dsName: '',
          subscriberPeople: '',
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'subscribeName',
            name: '订阅名称',
            placeholder: '订阅名称'
          },
          {
            type: 'input',
            disabled: false,
            prop: 'dsName',
            name: '信息资源名称',
            placeholder: '信息资源名称',
          },
          {
            type: 'input',
            disabled: false,
            prop: 'subscriber',
            name: '订阅申请人',
            placeholder: '订阅申请人',

          },
          /*{
           type: 'input',
           word: 'text',
           prop: 'subscriberPeople',
           name: '订阅申请人',
           placeholder: '订阅申请人'
           },*/
          {
            type: 'select',
            disabled: false,
            prop: 'higherUpStatus',
            name: '审核状态',
            placeholder: '审核状态',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value:'1',
                key:'已审核'
              },
              {
                value:'0',
                key:'已拒绝'
              },
              {
                value:'-1',
                key:'待审核'
              }
            ]
          },
          {
            type: 'dateRange',
            word: 'daterange',
            prop: 'timeRange',
            disabled: false,
            name: '时间段',
            placeholder: '订阅申请时间'
          },

        ]
      },
      /*   opreationData: [
       {
       name: '新建',
       icon: 'plus-round',
       color: 'primary',
       type: 'add'
       }
       ]*/
    }
  }
}

export default (data) => {
  return new resourceBazaarOptions(data);
}
