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
      title: '资源集市',
      apis: {
        listApi: 'resourceBazaar',
        addApi: 'userAdd',
        roleListApi: 'roleList',
        unfreeze: 'userUnfreeze',
        freeze: 'userFreeze',
        deleteApi: 'userDelete',
        detailApi: 'userDetail',
        editApi: 'assignRoleUpdate',
        showCatalogListApi: 'showCatalogList'
      },
      treeData: [],
      currentTreeNode: '',
      catalogId: '',
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        formObj:{
          catalogId: '',
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
          catalogId: '',
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
      defaultInitData: {
        catalogId: '',
        dsName: '',
        publishInstitution: '',
        subscribeStatus: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      initData: {
        catalogId: '',
        dsName: '',
        publishInstitution: '',
        subscribeStatus: '',
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
            title: '目录名称',
            key: 'typeName',
          },
          {
            title: '数据类型',
            key: 'dataType',
          },
          {
            title: '发布机构',
            key: 'publishInstitution',
          },
          {
            title: '发布时间',
            key: 'deptName',
          },
          {
            title: '发布方是否审核',
            key: 'checkStatus',
            render: (h, params) => {
              if (params.row.checkStatus === '1') {
                return h('div', '待审核');
              } else if (params.row.checkStatus === '2') {
                return h('div', '已通过 ');
              } else if (params.row.checkStatus === '3') {
                return h('div', '未通过 ');
              }
            }
          },
          {
            title: '是否已订阅',
            key: 'disparkType',
          /*  render: (h, params) => {
              if (params.rows.disparkType) {

              }
            }*/
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let statusNames = "";
              if (params.row.disparkType === '') {
                statusNames = '订阅';
              }
              else {
                statusNames = '订阅';
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
                    vm.subscribe(params.row.resourceId);
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
          catalogId: '',
          dsName: '',
          publishInstitution: '',
          subscribeStatus: '',
          beginTime: '',
          endTime: '',
          pageNum: 1,
          pageSize: 10
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'dsName',
            name: '发布名称',
            placeholder: '发布名称'
          },
          {
            type: 'select',
            disabled: false,
            prop: 'publishInstitution',
            name: '发布机构',
            placeholder: '请选择发布机构',
            options: [
              {
                value:'',
                key:'全部'
              },
              {
                value: '1',
                key: '机构1'
              },
              {
                value: '2',
                key: '机构2'
              }
            ]
          },
          {
            type: 'select',
            disabled: false,
            prop: 'subscribeStatus',
            name: '是否订阅',
            placeholder: '是否订阅',
            options: [
              {
                value:'',
                key:'全部'
              },
              {
                value:'1',
                key:'是'
              },
              {
                value:'0',
                key:'否'
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
