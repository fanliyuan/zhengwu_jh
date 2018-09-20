/**
 * Created by Administrator on 2018/9/18 0018.
 */
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
        listApi: 'subscribeResourceList',
        detailsApi: 'subscribeResourceDetail'
      },
      detailData: {
        resourceName: '',
        typeName: '',
        resourceCode: '',
        resourceFormatClassify: '',
        resourceProviderName: '',
        resourceProviderDepartment: '',
        resourceProviderCode: '',
        resourceAbstract: ''
      },
      detailNameData: {
        resourceName: '名称',
        typeName: '分类',
        resourceCode: '信息资源代码',
        resourceFormatClassify: '信息资源格式',
        resourceProviderName: '提供方名称',
        resourceProviderDepartment: '提供方内部部门',
        resourceProviderCode: '资源提供方代码',
        resourceAbstract: '摘要'
      },
      initData: {
        resourceId: '',
        resourceItemName: '',
        resourceItemCode: '',
        shareType: '',
        disparkType: '',
        pageNum: 1,
        pageSize: 10
      },
      tableData: {
        loading: true,
        tableList: [],
        columns: [
          {
            title: '信息项编码',
            key: 'resourceItemCode'
          },
          {
            title: '信息项名称',
            key: 'resourceItemName'
          },
          {
            title: '数据类型',
            key: 'resourceType'
          },
          {
            title: '数据长度',
            key: 'resourceLength'
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
            key: 'shareWayType'
          },
          {
            title: '共享方式类型',
            key: 'shareWayClassifyName'
          },
          {
            title: '开放类型',
            key: 'disparkType'
          },
          {
            title: '开放条件',
            key: 'disparkCondition'
          }
        ]
      },
      pageData: {
        total: 0
      },
      filterData: {
        filiterObj: {
          resourceItemName: '',
          resourceItemCode: '',
          shareType: '',
          disparkType: ''
        },
        data: [
          {
            type: 'input',
            word: 'text',
            prop: 'resourceItemCode',
            name: '信息项编码',
            placeholder: '请输入信息项编码'
          },
          {
            type: 'input',
            word: 'text',
            prop: 'resourceItemName',
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
            prop: 'disparkType',
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
