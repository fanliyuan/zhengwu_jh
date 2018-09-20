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
        connectApi: 'catalogConnect',
        listItemsApi: 'catalogItemsList',
        shareDetailApi: 'catalogShareDetail',
        shareUpdateApi: 'catalogShareUpdate',
        treeApi: 'showCatalogList'
      },
      treeData: [],
      currentTreeNode: '',
      catalogId: '',
      modalOpreation: false,
      modalWidgets: {},
      modalData: {
        title: {},
        apiUrl: '',
        width: 1200,
        current: 0,
        currentId: '',
        itemsOpreate: '手工建立',
        itemsOpreateArr: [
          {
            key: '从数据资源导入',
            value: 1
          },
          {
            key: '模板导入',
            value: 2
          },
          {
            key: '手工建立',
            value: 3
          }
        ],
        itemTableData: {
          loading: true,
          tableList: [],
          columns: [
            {
              title: '信息项编码',
              key: 'code',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.code
                    },
                    on: {
                      input: (val) => {
                        params.row.code = val;
                        vm.$emit('input', val);
                      }
                    }
                  }, params.row.code)
                } else {
                  return h('span', params.row.code);
                }
              }
            },
            {
              title: '信息项名称',
              key: 'name',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.name
                    },
                    domProps: {
                      value: params.row.name
                    },
                    on: {
                      input: (val) => {
                        params.row.name = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.name);
                }
              }
            },
            {
              title: '数据类型',
              key: 'dataType',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.dataType
                    },
                    domProps: {
                      value: params.row.dataType
                    },
                    on: {
                      input: (val) => {
                        params.row.dataType = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.dataType);
                }
              }
            },
            {
              title: '数据长度',
              key: 'dataLength',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.dataLength
                    },
                    domProps: {
                      value: params.row.dataLength
                    },
                    on: {
                      input: (val) => {
                        params.row.dataLength = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.dataLength);
                }
              }
            },
            {
              title: '共享类型',
              key: 'shareType',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.shareType
                    },
                    domProps: {
                      value: params.row.shareType
                    },
                    on: {
                      input: (val) => {
                        params.row.shareType = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.shareType);
                }
              }
            },
            {
              title: '共享条件',
              key: 'shareCondition',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.shareCondition
                    },
                    domProps: {
                      value: params.row.shareCondition
                    },
                    on: {
                      input: (val) => {
                        params.row.shareCondition = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.shareCondition);
                }
              }
            },
            {
              title: '共享方式分类',
              key: 'shareModeClassify',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.shareModeClassify
                    },
                    domProps: {
                      value: params.row.shareModeClassify
                    },
                    on: {
                      input: (val) => {
                        params.row.shareModeClassify = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.shareModeClassify);
                }
              }
            },
            {
              title: '共享方式类型',
              key: 'shareModeType',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.shareModeType
                    },
                    domProps: {
                      value: params.row.shareModeType
                    },
                    on: {
                      input: (val) => {
                        params.row.shareModeType = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.shareModeType);
                }
              }
            },
            {
              title: '开放类型',
              key: 'openType',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.openType
                    },
                    domProps: {
                      value: params.row.openType
                    },
                    on: {
                      input: (val) => {
                        params.row.openType = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.openType);
                }
              }
            },
            {
              title: '开放条件',
              key: 'openCondition',
              render: (h, params) => {
                if (params.row.$isEdit) {
                  return h('Input', {
                    props: {
                      value: params.row.openCondition
                    },
                    domProps: {
                      value: params.row.openCondition
                    },
                    on: {
                      input: (val) => {
                        params.row.openCondition = val;
                        vm.$emit('input', val);
                      }
                    }
                  })
                } else {
                  return h('span', params.row.openCondition);
                }
              }
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
                      if (params.row.$isEdit) {
                        vm.handleSave(params.row);
                        for (let obj in vm.modalData.itemTableData.tableList[params.index]) {
                          vm.modalData.itemTableData.tableList[params.index][obj] = params.row[obj];
                        }
                      } else {
                        vm.handleEdit(params.row)
                      }
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
                          vm.deleteItems(params);
                        }
                      });
                    }
                  }
                };
                children.push(h('Button', edit, params.row.$isEdit ? '保存' : '编辑'));
                children.push(h('Button', del, '删除'));
                return h('div', children);
              }
            }
          ]
        },
        itemPageData: {
          total: 1
        },
        formObj:{
          catalogId: '',
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
              shareType: '',
              $isEdit: true
            }
          ]
        },
        oldFormObj:{
          catalogId: '',
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
              shareType: '',
              $isEdit: true
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
              trigger: 'change'
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
              trigger: 'change'
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
            type: 'textarea',
            disabled: false,
            show: true,
            word: 'textarea',
            rows: 6,
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
                key: '数据库',
                value: 'db'
              },
              {
                key: '电子文件',
                value: 'eDoc'
              },
              {
                key: '电子表格',
                value: 'eSheet'
              },
              {
                key: '图形图像',
                value: 'image'
              },
              {
                key: '流媒体',
                value: 'streaming'
              },
              {
                key: '其它',
                value: 'other'
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
      modalShareOpreation: false,
      modalShareWidgets: {},
      modalShareData: {
        title: {},
        apiUrl: '',
        width: 900,
        catalogId: '',
        currentId: '',
        formObj:{
          share: 0,
          open: 0,
          switchAreaId: [],
          publishMode: [],
          publishRate: '',
          timeSet: [],
          timeSet0: '',
          timeSet1: '',
          timeSet2: '',
          timeSet3: '',
          timeSet4: ''
        },
        oldFormObj:{
          share: 0,
          open: 0,
          switchAreaId: [],
          publishMode: [],
          publishRate: '',
          timeSet: [],
          timeSet0: '',
          timeSet1: '',
          timeSet2: '',
          timeSet3: '',
          timeSet4: ''
        },
        idObj: 'id',
        ruleObj: {
          switchAreaId: [
            {
              required: true,
              message: '至少选择一个交换域',
              type: 'array',
              min: 1,
              trigger: 'change'
            }
          ],
          publishMode: [
            {
              required: true,
              type: 'array',
              message: '请选择发布模式',
              trigger: 'change'
            }
          ],
          publishRate: [
            {
              required: true,
              message: '请选择发布频率',
              trigger: 'change'
            }
          ],
          timeSet: [
            {
              required: true,
              message: '定时设置至少输入一项',
              type: 'array',
              min: 5,
              trigger: 'change'
            }
          ]
        },
        widgets: [
          {
            type: 'radioGroup',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'share',
            name: '是否共享',
            options: [
              {
                key: '无条件共享',
                value: 1
              },
              {
                key: '有条件共享',
                value: 2
              },
              {
                key: '不予共享',
                value: 3
              }
            ]
          },
          {
            type: 'radioGroup',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'open',
            name: '是否开放',
            options: [
              {
                key: '有条件开放',
                value: 1
              },
              {
                key: '无条件开放',
                value: 2
              },
              {
                key: '不予开放',
                value: 3
              }
            ]
          },
          {
            type: 'checkboxGroup',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'switchAreaId',
            name: '交换域',
            options: [
              {
                key: '交换域1',
                value: '1'
              },
              {
                key: '交换域2',
                value: '2'
              },
              {
                key: '交换域3',
                value: '3'
              }
            ]
          },
          {
            type: 'selectCascader',
            disabled: false,
            show: true,
            prop: 'publishMode',
            name: '发布模式',
            placeholder: '请选择发布模式',
            options: [
              {
                label: '增量',
                value: '1',
                children: [
                  {
                    value: '11',
                    label: '日志'
                  },
                  {
                    value: '12',
                    label: '增量字段'
                  }
                ]
              },
              {
                label: '全量',
                value: '2'
              }
            ]
          },
          {
            type: 'select',
            disabled: false,
            show: true,
            prop: 'publishRate',
            name: '发布频率',
            placeholder: '请选择发布频率',
            options: [
              {
                key: '定时',
                value: '1'
              },
              {
                key: '实时',
                value: '2'
              },
              {
                key: '手动',
                value: '3'
              }
            ]
          },
          {
            type: 'inputGroup',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'timeSet',
            name: '定时设置',
            options: [
              {
                type: 'inputNumber',
                disabled: false,
                show: true,
                max: 59,
                min: 0,
                prop: 'timeSet0',
                placeholder: '分钟'
              },
              {
                type: 'inputNumber',
                disabled: false,
                show: true,
                max: 23,
                min: 0,
                prop: 'timeSet1',
                placeholder: '小时'
              },
              {
                type: 'inputNumber',
                disabled: false,
                show: true,
                max: 366,
                min: 0,
                prop: 'timeSet2',
                placeholder: '天'
              },
              {
                type: 'inputNumber',
                disabled: false,
                show: true,
                max: 12,
                min: 0,
                prop: 'timeSet3',
                placeholder: '月'
              },
              {
                type: 'inputNumber',
                disabled: false,
                show: true,
                max: 999,
                min: 0,
                prop: 'timeSet4',
                placeholder: '星期'
              }
            ]
          }
        ],
        titles: {
          editTitle: {
            name: '开放共享',
            showOkBtn: true
          }
        }
      },
      defaultInitData: {
        catalogId: '',
        name: '',
        providerName: '',
        status: '',
        beginTime: '',
        endTime: '',
        mount: false,
        pageNum: 1,
        pageSize: 10
      },
      initData: {
        catalogId: '',
        name: '',
        providerName: '',
        status: '',
        beginTime: '',
        endTime: '',
        mount: false,
        pageNum: 1,
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
                  type: 'warning'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    if (!params.row.havaGj) {
                      let radioGroup = [];
                      let defaultVal = 'db';
                      vm.$Modal.confirm({
                        title: '请选择挂接类型',
                        render: (h) => {
                          return h('RadioGroup',{
                                props:{
                                  value: defaultVal
                                },
                                on:{
                                  'on-change': (val) => {
                                    defaultVal = val;
                                  }
                                }
                              },[
                                h('Radio',{
                                  props:{
                                    label: 'db'
                                  }
                                },'db'),
                                h('Radio',{
                                  props:{
                                    label: 'ftp',
                                    disabled: true
                                  }
                                },'ftp'),
                                h('Radio',{
                                  props:{
                                    label: '文件',
                                    disabled: true
                                  }
                                },'文件')
                              ]
                          );
                        },
                        onOk: () => {
                          vm.$router.push({'path': '/catalog/mount/' + params.row.id, params: {
                            id: params.row.id
                          }, query: {
                            mountType: defaultVal
                          }});
                        }
                      })
                    } else {
                      vm.$router.push({'path': '/catalog/mount/' + params.row.id, params: {
                        id: params.row.id
                      }, query: {
                        mountType: params.row.mountType
                      }});
                    }
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
              children.push(h('a', view, '信息项'));
              children.push(h('a', link, '资源挂接'));
              if (params.row.havaGj) {
                children.push(h('a', open, '共享开放'));
              }
              children.push(h('a', edit, '修改'));
              children.push(h('a', del, '删除'));
              return h('div', children);
            }
          }
        ]
      },
      pageData: {
        total: 0
      },
      filterData: {
        defaultFiliterObj: {
          catalogId: '',
          name: '',
          providerName: '',
          status: '',
          beginTime: '',
          endTime: '',
          mount: false
        },
        filiterObj: {
          catalogId: '',
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