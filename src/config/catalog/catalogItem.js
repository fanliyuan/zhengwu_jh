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
      apis: {
        listApi: 'catalogItemsList'
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
            key: 'shareType'
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
            key: 'openType'
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
            type: 'input',
            word: 'text',
            prop: 'shareType',
            name: '共享类型',
            placeholder: '请输入共享类型'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'openType',
            name: '开放类型',
            placeholder: '请输入开放类型'
          }
        ]
      }
    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}