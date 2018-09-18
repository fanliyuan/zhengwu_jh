/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/09/18
 *
 * 描述 ：目录管理资源挂接配置数据
 */

class catalogMountOptions {
  constructor(data) {
    this.data = data;
  }

  setVm () {
    return this.data;
  }

  setData () {
    let vm = this.setVm();
    return {
      title: '资源挂接数据',
      isBackBtn: {
        name: '返回'
      },
      isSaveBtn: {
        name: '保存',
        method: 'edit'
      },
      apis: {
        listApi: 'resourceList',
        detailApi: 'catalogDetail',
        itemListApi: 'catalogItemsList',
        tableStructApi: 'resourceMysqlStruct',
        updateApi: 'catalogMount'
      },
      sourceName: '未选择',
      sourceId: '',
      detailData: {},
      detailNameData: {
        infoCode: '目录编码',
        name: '名称',
        providerName: '提供方',
        registerTime: '创建时间'
      },
      structData: [],
      modalOpreation: false,
      modalOk: true,
      initData: {
        name: '',
        beginTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        initData: {
          id: ''
        },
        columns: [
          {
            title: '信息编码',
            key: 'code'
          },
          {
            title: '信息名称',
            key: 'name'
          },
          {
            title: '数据类型',
            key: 'dataType'
          },
          {
            title: '数据长度',
            key: 'dataLength'
          }
        ]
      },
      sourceTableData: {
        loading: true,
        tableList: [],
        pageData: {
          total: 0
        },
        columns: [
          {
            title: 'ID',
            key: 'id'
          },
          {
            title: '资源名称',
            key: 'name'
          },
          {
            title: '数据类型',
            key: 'dataType'
          },
          {
            title: '注册时间',
            key: 'registerTime'
          }
        ]
      },
      filterData: {
        filiterObj: {
          name: '',
          beginTime: '',
          endTime: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'name',
            disabled: false,
            name: '资源名称',
            placeholder: '请输入资源名称'
          },
          //{
          //  type: 'input',
          //  word: 'text',
          //  prop: 'name',
          //  disabled: false,
          //  name: '信息项名称',
          //  placeholder: '请输入信息项名称'
          //},
          {
            type: 'dateRange',
            word: 'daterange',
            prop: 'timeRange',
            disabled: false,
            name: '时间段',
            placeholder: '请选择时间段'
          }
        ]
      }
    }
  }
}

export default (data) => {
  return new catalogMountOptions(data);
}