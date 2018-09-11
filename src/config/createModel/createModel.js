/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/28
 *
 * 描述 ：createModel管理配置数据
 */

class createModelOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '模板生成',
      showError: true,
      step: {
        current: 0,
        showPre: false,
        showNext: true,
        showSubmit: false,
        stepFun: ['completeStepOne', 'completeStepTwo', 'completeStepThree', 'completeStepFour']
      },
      index: {
        input: 0,
        inputNumber: 0,
        textarea: 0,
        select: 0,
        switchs: 0,
        upload: 0,
        ueditor: 0,
        date: 0
      },
      currentActivityNames: [],
      formDropDown: ['input', 'inputNumber', 'textarea', 'select', 'switchs', 'upload', 'ueditor', 'date'],
      formConfig:  {
        input: [
          {
            type: 'input',
            word: 'text',
            name: '输入框名称',
            prop: 'configInputTitle',
            placeholder: '请输入输入框名称',
            rules: [
              {
                required: true,
                message: '输入框名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '输入框名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '输入框提示语',
            prop: 'configInputPlaceholder',
            placeholder: '请输入输入框提示语',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configInputSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'select',
            name: '字符类型',
            prop: 'configInputType',
            placeholder: '请选择字符类型',
            options: [
              {
                value: 'text',
                key: '字符串'
              },
              {
                value: 'password',
                key: '密码'
              },
              {
                value: 'url',
                key: '链接'
              },
              {
                value: 'email',
                key: '邮件'
              }
            ],
            rules: [
              {
                required: true,
                message: '请选择input输入的类型',
                trigger: 'change'
              }
            ]
          },
          {
            type: 'switch',
            name: '限制字符长度',
            prop: 'configInputSwitch',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          },
          {
            type: 'slider',
            prop: 'configInputSlider',
            defaultNum: [5, 20],
            min: 0,
            max: 200,
            name: '字符长度'
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configInputRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        inputNumber: [
          {
            type: 'input',
            word: 'text',
            name: '输入框名称',
            prop: 'configInputNumberTitle',
            placeholder: '请输入输入框名称',
            rules: [
              {
                required: true,
                message: '输入框名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '输入框名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '输入框提示语',
            prop: 'configInputNumberPlaceholder',
            placeholder: '请输入输入框提示语',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configInputNumberSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'inputNumber',
            name: '最大数',
            prop: 'configInputNumberMax',
            placeholder: '请输入最大数'
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configInputNumberRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        select: [
          {
            type: 'input',
            word: 'text',
            name: '选择器名称',
            prop: 'configSelectTitle',
            placeholder: '请输入选择器名称',
            rules: [
              {
                required: true,
                message: '选择器名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '选择器名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '选择器提示语',
            prop: 'configSelectPlaceholder',
            placeholder: '请输入选择器提示语',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configSelectSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'options',
            prop: 'configSelectOptions',
            index: 0,
            options: [
              {
                option: [
                  {
                    type: 'input',
                    word: 'text',
                    name: '选项名称',
                    prop: 'configSelectOptionKey',
                    placeholder: '请输入选项名称',
                    rules: [
                      {
                        required: true,
                        message: '选项名称不能为空',
                        trigger: 'blur'
                      }
                    ]
                  },
                  {
                    type: 'input',
                    word: 'text',
                    name: '选项值',
                    prop: 'configSelectOptionValue',
                    placeholder: '请输入选项值',
                    rules: [
                      {
                        required: true,
                        message: '选项值不能为空',
                        trigger: 'blur'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            type: 'switch',
            name: '是否必选',
            prop: 'configSelectRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        textarea: [
          {
            type: 'input',
            word: 'text',
            name: '文本域名称',
            prop: 'configTextareaTitle',
            placeholder: '请输入文本域名称',
            rules: [
              {
                required: true,
                message: '文本域名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '文本域名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '文本域提示语',
            prop: 'configTextareaPlaceholder',
            placeholder: '请输入文本域提示语',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configTextareaSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'switch',
            name: '限制字符长度',
            prop: 'configTextareaSwitch',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          },
          {
            type: 'slider',
            prop: 'configTextareaSlider',
            defaultNum: [5, 20],
            min: 0,
            max: 500,
            name: '字符长度'
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configTextareaRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        switchs: [
          {
            type: 'input',
            word: 'text',
            name: '开关名称',
            prop: 'configSwitchsTitle',
            placeholder: '请输入开关名称',
            rules: [
              {
                required: true,
                message: '开关名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '开关名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '关闭文字',
            prop: 'configSwitchsCloseText',
            placeholder: '请输入关闭状态文字',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '开启文字',
            prop: 'configSwitchsOpenText',
            placeholder: '请输入开启状态文字',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configSwitchsSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          }
        ],
        upload: [
          {
            type: 'input',
            word: 'text',
            name: '上传组件名称',
            prop: 'configUploadTitle',
            placeholder: '请输入上传组件名称',
            rules: [
              {
                required: true,
                message: '上传组件名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '上传组件名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '上传按钮文字',
            prop: 'configUploadUpText',
            placeholder: '请输入上传按钮文字',
            rules: [
              {
                required: true,
                message: '上传按钮文字不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '删除按钮文字',
            prop: 'configUploadDeleteText',
            placeholder: '请输入删除按钮文字',
            rules: [
              {
                required: true,
                message: '删除按钮文字不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configUploadSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'select',
            name: '接受的文件类型',
            prop: 'configUploadAccept',
            placeholder: '请选择可上传的文件类型',
            options: [
              {
                value: 'jpg',
                key: 'jpg'
              },
              {
                value: 'jpeg',
                key: 'jpeg'
              },
              {
                value: 'png',
                key: 'png'
              },
              {
                value: 'gif',
                key: 'gif'
              }
            ],
            rules: []
          },
          {
            type: 'inputNumber',
            name: '最大上传数量',
            prop: 'configUploadUpMax',
            placeholder: '请输入最大上传数量',
            max: 5,
            min: 1
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configUploadRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        ueditor: [
          {
            type: 'input',
            word: 'text',
            name: 'ueditor名称',
            prop: 'configUeditorTitle',
            placeholder: '请输入ueditor名称',
            rules: [
              {
                required: true,
                message: 'ueditor名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: 'ueditor名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configUeditorSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configUeditorRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ],
        date: [
          {
            type: 'input',
            word: 'text',
            name: '日期框名称',
            prop: 'configDateTitle',
            placeholder: '请输入日期框名称',
            rules: [
              {
                required: true,
                message: '日期框名称不能为空',
                trigger: 'blur'
              },
              {
                max: 20,
                message: '日期框名称长度不能大于20个字符',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'input',
            word: 'text',
            name: '日期框提示语',
            prop: 'configDatePlaceholder',
            placeholder: '请输入日期框提示语',
            rules: []
          },
          {
            type: 'input',
            word: 'text',
            name: '绑定字段名称',
            prop: 'configDateSql',
            placeholder: '请输入对应数据库字段名称',
            rules: [
              {
                required: true,
                message: '数据库字段名称名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'switch',
            name: '是否必填项',
            prop: 'configDateRequire',
            openName: '是',
            closeName: '否',
            openVal: 1,
            closeVal: 0
          }
        ]
      },
      forms: [
        {
          name: 'formValidate0',
          formObj: {
            title: '',
            sqlCommonName: '',
            apis: []
          },
          rules: {
            title: [
              {
                required: true,
                message: '页面名称不能为空',
                trigger: 'blur'
              },
              {
                max: 15,
                message: '名称长度不能大于15个字符'
              }
            ],
            sqlCommonName: [
              {
                required: true,
                message: '数据库公共字段名称不能为空',
                trigger: 'blur'
              }
            ]
          },
          formWidgets: [
            {
              type: 'input',
              word: 'text',
              prop: 'title',
              name: '页面名称',
              placeholder: '请输入页面名称'
            },
            {
              type: 'input',
              word: 'text',
              prop: 'sqlCommonName',
              name: '字段名称',
              placeholder: '请输入数据库字段的公共部分'
            },
            {
              type: 'checkboxGroup',
              prop: 'apis',
              name: '接口功能',
              checkValues: ['Add', 'Update', 'Detail', 'Delete']
            }
          ]
        },
        {
          name: 'formValidate1',
          formObj: {
            items: []
          },
          rules: [],
          widgets: [],
          formWidgets: []
        },
        // {
        //   name: 'formValidate2',
        //   formObj: {},
        //   rules: [],
        //   formWidgets: []
        // },
        // {
        //   name: 'formValidate3',
        //   formObj: {},
        //   rules: [],
        //   formWidgets: []
        // }
      ],
      defaultObj: {
        title: '',
        sqlCommonName: '',
        apis: {},
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
          ruleObj: {},
          widgets: [],
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
          columns: []
        },
        pageData: {
          total: 0
        },
        filterData: {},
        opreationData: []
      }
    }
  }
}

export default (data) => {
  return new createModelOptions(data);
}
