/**
 * Created by Administrator on 2018/9/14 0014.
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
    return {
      title: '所有订阅',
      apis: {
        listApi: 'allSubscribeList',
        addApi: 'userAdd',
        deleteApi: 'userDelete',
        detailApi: 'userDetail',
        editApi: 'assignRoleUpdate',
        showCatalogListApi:'showCatalogList',
        runApi: 'run',
        stopApi: 'stop',
      },
      treeData: '',
      selectValue: '',
      catalogId: '',
      catalogName:'',
      dsName: '',
      publishInstitution: '',
      runStatus: '',
      beginTime: '',
      endTime: '',
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        formObj:{
          id: '',
          role:'',
          user: '',
          salt: '',
          birthday: '',
          sex: '',
          eamil: '',
          deptid: '',
          createtime: '',
          version: '',
          avatar: ''
        },
        oldFormObj:{
          id: '',
          user: '',
          salt: '',
          birthday: '',
          sex: '',
          eamil: '',
          deptid: '',
          createtime: '',
          version: '',
          avatar: ''
        },
        idObj: 'id',
        ruleObj: {
          account: [
            {
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            },
            {
              max: 50,
              message: '用户名长度不能大于50个字符'
            }
          ],
          password: [
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
          ],
          name: [
            {
              required: true,
              message: '姓名不能为空',
              trigger: 'blur'
            },
          ],
          phone: [
            {
              required: true,
              message: '手机号不能为空',
              trigger: 'blur'
            },
          ],
          role: [
            {
              required: false,
              message: '角色不能为空',
              trigger: 'blur'
            },
          ],
        },
        widgets: [
          {
            type: 'input',
            disabled: false,
            show:true,
            word: 'text',
            prop: 'account',
            name: '用户名',
            placeholder: '请输入用户名'
          },
          {
            type: 'input',
            disabled: false,
            show:true,
            word: 'password',
            prop: 'password',
            name: '密码',
            placeholder: '请输入密码'
          },
          {
            type: 'input',
            disabled: false,
            word: 'text',
            show:true,
            prop: 'name',
            name: '姓名',
            placeholder: '请输入姓名'
          },
          {
            type: 'input',
            disabled: false,
            show:true,
            word: 'text',
            prop: 'phone',
            name: '手机号',
            placeholder: '请输入手机号'
          },{
            type: 'select',
            disabled: true,
            show:true,
            prop: 'roleid',
            name: '角色',
            placeholder: '请选择',
            options: []
          },
          {
            type: 'switch',
            disabled: false,
            show: true,
            prop: 'status',
            name: '状态',
            openName: '启用',
            closeName: '停用',
            openVal: '1',
            closeVal: '2'
          }
        ],
        titles: {
          addTitle: {
            name: '新增用户',
            showOkBtn: true
          },
          editTitle: {
            name: '用户管理',
            showOkBtn: true
          }
        }
      },
      initData: {
        catalogId: '',
        dsName: '',
        publishInstitution: '',
        runStatus: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageNum:1,
        pageSize:10,
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
            title: '订阅名称',
            key: 'subscribeName',
          },
          {
            title: '订阅申请人',
            key: 'reviewer',
          },
          {
            title: '订阅时间',
            key: 'reviewTime',
          },
          {
            title: '目录名称',
            key: 'directoryName',
          },
          {
            title: '发布机构',
            key: 'publishInstitution',
          },
          {
            title: '运行状态',
            key: 'runStatus',
            render: (h, params) => {
              let children = [];
              let runStatusNames = "";
              if (params.row.runStatus === 0) {
                runStatusNames = '停止';
              }
              else if(params.row.runStatus === 1){
                runStatusNames = '运行';
              } else {
                runStatusNames = '已连接';
              }
              return h('div', runStatusNames);
            }
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
                    vm.view(params.row.id,params.row.directoryName,params.row.publishInstitution,params.row.dsName,params.row.subscribeName);
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
                    vm.audit(params.row.id);
                  }
                }
              };
              children.push(h('span', view, '查看'));
              children.push(h('span', audit, '审核日志'));
              return h('div', children);
            }
          }
        ]
      },
      pageData: {
        total: 0
      },
      initData2: {
        catalogId: '',
        dsName: '',
        publishInstitution: '',
        runStatus: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageNum:1,
        pageSize:10,
      },
      tableData2: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70,
          },
          {
            title: '订阅名称',
            key: 'subscribeName',
          },
          {
            title: '订阅申请人',
            key: 'reviewer',
          },
          {
            title: '订阅时间',
            key: 'reviewTime',
          },
          {
            title: '目录名称',
            key: 'directoryName',
          },
          {
            title: '发布机构',
            key: 'publishInstitution',
          },
          {
            title: '审批状态',
            key: '',
          /*  render: (h, params) => {
              let children = [];
              let runStatusNames = "";
              if (params.row.runStatus === 0) {
                runStatusNames = '停止';
              }
              else if(params.row.runStatus === 1){
                runStatusNames = '运行';
              } else {
                runStatusNames = '已连接';
              }
              return h('div', runStatusNames);
            }*/
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
                    vm.view(params.row.id,params.row.directoryName,params.row.publishInstitution,params.row.dsName,params.row.subscribeName);
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
                    vm.audit(params.row.id);
                  }
                }
              };
              children.push(h('span', view, '查看'));
              children.push(h('span', audit, '审核日志'));
              return h('div', children);
            }
          }
        ]
      },
      pageData2: {
        total: 0
      },
      initData1: {
        catalogId: '',
        dsName: '',
        publishInstitution: '',
        runStatus: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageNum:1,
        pageSize:10,
      },
      tableData1: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 70,
          },
          {
            title: '订阅名称',
            key: 'subscribeName',
          },
          {
            title: '订阅申请人',
            key: 'reviewer',
          },
          {
            title: '订阅时间',
            key: 'reviewTime',
          },
          {
            title: '目录名称',
            key: 'directoryName',
          },
          {
            title: '发布机构',
            key: 'publishInstitution',
          },
          {
            title: '审批状态',
            key: '',
         /*   render: (h, params) => {
              let children = [];
              let runStatusNames = "";
              if (params.row.runStatus === 0) {
                runStatusNames = '停止';
              }
              else if(params.row.runStatus === 1){
                runStatusNames = '运行';
              } else {
                runStatusNames = '已连接';
              }
              return h('div', runStatusNames);
            }*/
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
                    vm.view(params.row.id,params.row.directoryName,params.row.publishInstitution,params.row.dsName,params.row.subscribeName);
                  }
                }
              };
              children.push(h('span', view, '查看'));
              return h('div', children);
            }
          }
        ]
      },
      pageData1: {
        total: 0
      },
      filterData: {
        filiterObj: {
          catalogId: '',
          dsName: '',
          publishInstitution: '',
          runStatus: '',
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'catalogId',
            showModal: true,
            name: '搜索分类',
            placeholder: '搜索分类'
          },
          {
            type: 'input',
            disabled: false,
            prop: 'dsName',
            name: '名称',
            placeholder: '订阅名称/目录名称',
          },
          {
            type: 'input',
            disabled: false,
            prop: 'publishInstitution',
            name: '发布机构',
            placeholder: '发布机构',
          },
          {
            type: 'select',
            disabled: false,
            prop: 'subscribeStatus',
            name: '运行状态',
            placeholder: '运行状态',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value:'1',
                key:'运行中'
              },
              {
                value:'0',
                key:'已停止'
              },
              {
                value:'2',
                key:'已连接'
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
