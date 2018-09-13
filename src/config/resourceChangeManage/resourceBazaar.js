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

class userManagerOptions {
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
      title: '资源集市',
      apis: {
        listApi: 'userManagerList',
        addApi: 'userAdd',
        roleListApi: 'roleList',
        unfreeze: 'userUnfreeze',
        freeze: 'userFreeze',
        deleteApi: 'userDelete',
        detailApi: 'userDetail',
        editApi: 'assignRoleUpdate'
      },
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
        name: '',
        phone: '',
        role: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageNum:1,
        pageSize:10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '用户名',
            key: 'account',
            /*  render: (h, params) => {
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
             title: params.row.title
             }
             }, params.row.title)
             ])
             }*/
          },
          {
            title: '姓名',
            key: 'name',
          },
          {
            title: '电话',
            key: 'phone',
          },
          {
            title: '所属机构',
            key: 'deptName',
          },
          {
            title: '角色',
            key: 'roleName',
          },
          {
            title: '建立时间',
            key: 'createtime',
          },
          {
            title: '状态',
            key: 'statusName',
          },
          {
            title: '操作',
            key: 'operate',
            render: (h, params) => {
              let children = [];
              let statusNames = "";
              if (params.row.statusName === '启用') {
                statusNames = '停用';
              }
              else {
                statusNames = '启用';
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
                    vm.editStatus(params.row.id,params.row.statusName);
                  }
                }
              };
              let view = {
                props: {
                  type: 'success'
                },
                style: {
                  marginRight: '5px',
                  color:'#3fa9ff',
                  cursor:'pointer'
                },
                on: {
                  click: () => {
                    vm.edit(params.row.id);
                  }
                }
              };
              let del = {
                props: {
                  type: 'error'
                },
                style: {
                  color:'#3fa9ff',
                  cursor:'pointer'
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
              children.push(h('span', edit, statusNames));
              children.push(h('span', view, '修改'));
              children.push(h('span', del, '删除'));
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
          phone: '',
          role: '',
          status: '',
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'name',
            name: '用户名',
            placeholder: '用户名/姓名'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'phone',
            name: '电话',
            placeholder: '请输入电话'
          },
          {
            type: 'select',
            disabled: false,
            prop: 'role',
            name: '用户角色',
            placeholder: '请选择用户角色',
            options: vm.filterRoleList
          },
          {
            type: 'select',
            disabled: false,
            prop: 'status',
            name: '状态',
            placeholder: '请选择状态',
            options: [
              {
                value:'',
                key:'全部'
              },
              {
                value:'1',
                key:'启用'
              },
              {
                value:'2',
                key:'冻结'
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
      opreationData: [
        {
          name: '新建',
          icon: 'plus-round',
          color: 'primary',
          type: 'add'
        }
      ]
    }
  }
}

export default (data) => {
  return new userManagerOptions(data);
}