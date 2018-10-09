/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/13
 *
 * 描述 ：目录管理信息项配置数据
 */

class catalogItemOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '查看资源信息项',
      isBackBtn: {
        name: '返回'
      },
      apis: {
        listApi: 'catalogItemsList',
        detailApi: 'catalogDetail'
      },
      detailData: {},
      detailNameData: {
        name: '名称',
        classify: '分类',
        infoCode: '信息资源代码',
        infoFormat: '信息资源格式',
        providerName: '提供方名称',
        providerDept: '提供方内部部门',
        providerNo: '资源提供方代码',
        summary: '摘要'
      },
      initData: {
        id: '',
        name: '',
        code: '',
        shareType: '',
        openType: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '信息项编码',
            key: 'code'
          },
          {
            title: '信息项名称',
            key: 'name'
          },
          {
            title: '数据类型',
            key: 'dataType'
          },
          {
            title: '数据长度',
            key: 'dataLength'
          },
          {
            title: '共享类型',
            key: 'shareType',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.shareType) {
                        case '1':
                          return '<span>有条件共享</span>';
                        case '2':
                          return '<span>无条件共享</span>';
                        case '3':
                          return '<span>不共享</span>';
                      }
                    }()
                  }
                }, params.row.status)
              ])
            }
          },
          {
            title: '共享条件',
            key: 'shareCondition'
          },
          {
            title: '共享方式分类',
            key: 'shareModeClassify'
          },
          {
            title: '共享方式类型',
            key: 'shareModeType'
          },
          {
            title: '开放类型',
            key: 'openType',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  domProps: {
                    innerHTML: function () {
                      switch (params.row.openType) {
                        case '1':
                          return '<span>有条件开放</span>';
                        case '2':
                          return '<span>无条件开放</span>';
                        case '3':
                          return '<span>不开放</span>';
                      }
                    }()
                  }
                }, params.row.status)
              ])
            }
          },
          {
            title: '开放条件',
            key: 'openCondition'
          }
        ]
      },
      pageData: {
        total: 0
      },
      filterData: {
        filiterObj: {
          name: '',
          code: '',
          shareType: '',
          openType: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'code',
            name: '信息项编码',
            placeholder: '请输入信息项编码'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'name',
            name: '信息项名称',
            placeholder: '请输入信息项名称'
          },
          {
            type: 'select',
            word: 'text',
            prop: 'shareType',
            name: '共享类型',
            placeholder: '请选择共享类型',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value: '1',
                key: '有条件共享'
              },
              {
                value: '2',
                key: '无条件共享'
              },
              {
                value: '3',
                key: '不共享'
              }
            ]
          },
          {
            type: 'select',
            word: 'text',
            prop: 'openType',
            name: '开放类型',
            placeholder: '请选择开放类型',
            options: [
              {
                value: '',
                key: '全部'
              },
              {
                value: '1',
                key: '有条件开放'
              },
              {
                value: '2',
                key: '无条件开放'
              },
              {
                value: '3',
                key: '不开放'
              }
            ]
          }
        ]
      }
    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}