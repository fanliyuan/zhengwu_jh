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
      title: '订阅授权',
      apis: {
        listApi: 'subscribeAuditList',
        showCatalogListApi: 'showCatalogList',
        subscribeAuditListApi: 'subscribeAuditList',
        subscribeAuditApi: 'subscribeAudit'
      },
      treeData: [],
      currentTreeNode: '',
      catalogId: '',
      codeReply: 1,
      reason: '',
      modalOpreation: false,
      modalOk: true,
      showReason: false,
      modalWidgets: {},
      modalOkData: {
        codeReply: '',
        dsID: "string",
        incrementType: "string",
        pkField: "string",
        reason: "string",
        subID: "string",
        subscriberID: "string"
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
        subscriberPeople: '',
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
            title: '资源名称',
            key: 'dsName',
          },
          {
            title: '数据类型',
            key: 'dataType',
          },
          {
            title: '订阅机构',
            key: 'subscribeInstitution',
          },
          {
            title: '订阅时间',
            key: 'subTime',
          },
          {
            title: '授权状态',
            key: 'status',
            render: (h, params) => {
              if (params.row.status === -1) {
                return h('div', '待授权');
              } else if (params.row.status === 1) {
                return h('div', '已通过 ');
              } else if (params.row.status === 0) {
                return h('div', '已拒绝 ');
              }
            }
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let statusNames = "";
              if (params.row.status === -1 ) {
                statusNames = '授权';
              }
              else {
                statusNames = '查看';
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
                    if ( statusNames == '授权') {
                      vm.auditing(params.row.dsId,params.row.subId,params.row.subscriberId);
                    } else {
                      vm.auditingDetail(params.row.dsId,params.row.subId,params.row.subscriberId);
                    }


                      //vm.unSubscribe(params.row.id,statusNames);


                  }
                }
              };
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
            prop: 'dsName',
            name: '资源名称',
            placeholder: '资源名称'
          },
          {
            type: 'select',
            disabled: false,
            prop: 'dataType',
            name: '数据类型',
            placeholder: '数据类型',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value:'db',
                key:'db'
              },
              {
                value:'file',
                key:'file'
              },
              {
                value:'ftp',
                key:'ftp'
              }
            ]
          },
          {
            type: 'input',
            disabled: false,
            prop: 'subscribeInstitution',
            name: '订阅机构',
            placeholder: '订阅机构',

          },
          /*{
            type: 'input',
            word: 'text',
            prop: 'subscriberPeople',
            name: '订阅申请人',
            placeholder: '订阅申请人'
          },*/
          {
            type: 'dateRange',
            word: 'daterange',
            prop: 'timeRange',
            disabled: false,
            name: '时间段',
            placeholder: '请选择时间段'
          },
          {
            type: 'select',
            disabled: false,
            prop: 'subscribeStatus',
            name: '授权状态',
            placeholder: '授权状态',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value:'1',
                key:'已通过'
              },
              {
                value:'0',
                key:'已拒绝'
              },
              {
                value:'-1',
                key:'待授权'
              }
            ]
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
