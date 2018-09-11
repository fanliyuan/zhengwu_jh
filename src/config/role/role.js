/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/11
 *
 * 描述 ：分配角色配置数据
 */

class assignRoleOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    vm.filterRoleList = [
      {
        value: '',
        key: '全部'
      }
    ];
    vm.roleList = [];
    return {
      title: '分配角色',
      apis: {
        listApi: 'userList',
        editApi: 'roleUpdate',
        listRoleApi: 'roleList'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        formObj:{
          role: ''
        },
        oldFormObj:{
          role: ''
        },
        idObj: 'xaobBannerId',
        ueObj: 'xaobBannerContent',
        ruleObj: {
          xaobBannerTitle: [
            {
              required: true,
              message: '标题不能为空',
              trigger: 'blur'
            },
            {
              max: 100,
              message: '标题长度不能大于100个字符'
            }
          ],
          xaobBannerImg: [
            {
              required: true,
              message: '图片不能为空',
              trigger: 'blur'
            }
          ],
          xaobBannerBlueImg: [
            {
              required: true,
              message: '图片不能为空',
              trigger: 'blur'
            }
          ],
          xaobBannerUrl: [
            {
              type: 'url',
              message: '请输入正确的url格式（http://...）'
            }
          ]
        },
        widgets: [
          {
            type: 'input',
            disabled: false,
            word: 'text',
            prop: 'xaobBannerTitle',
            name: '标题',
            placeholder: '请输入banner标题'
          },
          {
            type: 'upload',
            disabled: false,
            word: 'text',
            prop: 'xaobBannerImg',
            name: '图片(红色皮肤)',
            placeholder: '上传红色皮肤图片',
            placeholderA: '删除红色皮肤图片',
            accept: ['jpg', 'jpeg' ,'png'],
            rules: {
              maxNum: 1,
              fileErrorTips: {
                title: '文件类型上传错误',
                desc: '请上传 ".jpg", ".jpeg", ".png" 格式的图片。'
              },
              fileMaxTips: {
                title: '文件数量限制',
                desc: '最多只能上传一张图片。'
              }
            }
          },
          {
            type: 'upload',
            disabled: false,
            word: 'text',
            prop: 'xaobBannerBlueImg',
            name: '图片(蓝色皮肤)',
            placeholder: '上传蓝色皮肤图片',
            placeholderA: '删除蓝色皮肤图片',
            accept: ['jpg', 'jpeg' ,'png'],
            rules: {
              maxNum: 1,
              fileErrorTips: {
                title: '文件类型上传错误',
                desc: '请上传 ".jpg", ".jpeg", ".png" 格式的图片。'
              },
              fileMaxTips: {
                title: '文件数量限制',
                desc: '最多只能上传一张图片。'
              }
            }
          },
          {
            type: 'input',
            disabled: false,
            word: 'text',
            prop: 'xaobBannerUrl',
            name: '链接',
            placeholder: '请输入banner链接'
          },
          {
            type: 'ueditor',
            disabled: false,
            word: 'textarea',
            prop: 'xaobBannerContent',
            name: '内容',
            placeholder: ''
          }
        ],
        titles: {
          editTitle: {
            name: '分配角色',
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
        pageNum: 0,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          //{
          //  title: '标题',
          //  key: 'title',
          //  render: (h, params) => {
          //    return h('div', [
          //      h('span', {
          //        style: {
          //          display: 'inline-block',
          //          width: '100%',
          //          overflow: 'hidden',
          //          textOverflow: 'ellipsis',
          //          whiteSpace: 'nowrap'
          //        },
          //        domProps: {
          //          title: params.row.title
          //        }
          //      }, params.row.title)
          //    ])
          //  }
          //},
          {
            title: '用户名',
            key: 'account'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '电话',
            key: 'phone'
          },
          {
            title: '所属机构',
            key: 'deptName'
          },
          {
            title: '角色',
            key: 'roleName'
          },
          {
            title: '建立时间',
            key: 'createtime'
          },
          {
            title: '状态',
            key: 'statusName'
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
              children.push(h('Button', edit, '分配角色'));
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
            name: '姓名',
            placeholder: '请输入用户名/姓名'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'phone',
            name: '电话',
            placeholder: '请输入电话号码'
          },
          {
            type: 'select',
            prop: 'role',
            disabled: false,
            name: '角色',
            placeholder: '请选择角色',
            options: vm.filterRoleList
          },
          {
            type: 'select',
            prop: 'status',
            disabled: false,
            name: '状态',
            placeholder: '请选择状态',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value: 1,
                key: '启用'
              },
              {
                value: 2,
                key: '冻结'
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
          name: '添加',
          icon: 'md-add',
          color: 'primary',
          type: 'add'
        }
      ]
    }
  }
}

export default (data) => {
  return new assignRoleOptions(data);
}
