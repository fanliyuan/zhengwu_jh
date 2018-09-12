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
        addApi: 'bannerAdd',
        deleteApi: 'bannerDelete',
        detailApi: 'bannerDetail',
        listApi: 'bannerList',
        editApi: 'bannerUpdate'
      },
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 900,
        formObj:{
          xaobBannerTitle: '',
          xaobBannerImg: '',
          xaobBannerBlueImg: '',
          xaobBannerUrl: '',
          xaobBannerContent: ''
        },
        oldFormObj:{
          xaobBannerTitle: '',
          xaobBannerImg: '',
          xaobBannerBlueImg: '',
          xaobBannerUrl: '',
          xaobBannerContent: ''
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
          viewTitle: {
            name: '查看banner详情',
            showOkBtn: false
          },
          addTitle: {
            name: '添加banner',
            showOkBtn: true
          },
          editTitle: {
            name: '编辑banner',
            showOkBtn: true
          }
        }
      },
      initData: {
        title: '',
        order: 'desc',
        offset: 0,
        limit: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '标题',
            key: 'title',
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
                    title: params.row.title
                  }
                }, params.row.title)
              ])
            }
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '发布人',
            key: 'createName'
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
              children.push(h('Button', edit, '修改'));
              children.push(h('Button', view, '查看'));
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
          title: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'title',
            name: '标题',
            placeholder: '请输入标题'
          }
        ]
      },
      opreationData: [
        {
          name: '添加',
          icon: 'plus-round',
          color: 'primary',
          type: 'add'
        }
      ]
    }
  }
}

export default (data) => {
  return new sourceOptions(data);
}