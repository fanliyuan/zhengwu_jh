/**
 * Created by Administrator on 2018/9/17 0017.
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
      title: '订阅(文件)',
      isBackBtn: {
        name: '返回'
      },
      isSureBtn: {
        name: '确定12',
        method: 'sure',
        show: 'true'
      },

      type: '否',
      showPath:false,
      filePath:'',
      orderStatus: true, //是否订阅
      subscribeName:'',
      pubfreQuency: '',//发布频率
      pubMode: '',//发布模式
      minutes: '',//分钟
      hours:'',//小时
      day: '',//日期
      month:'',//月
      week: '',//星期
      apis: {
        listApi: 'catalogItemsList',
        detailApi: 'catalogDetail',
        subscribeApi: 'subscribe',
        resourceTaskInfoApi:'resourceTaskInfo'
      },
      sureData:{
        catalogId: '',
        directoryName: '',
        dsID: '',
        dsName: '',
        publishInstitution: '',
        publisherID: '',
        subscribeName: '',
        mountResourceId:'',
        dataType:''
      },
      detailData: {
        resourceName:'',
        resourceProviderName: '',
        dataType: '',
        typeName: '',
      },
      detailNameData: {
        resourceName: '目录名称',
        resourceProviderName: '发布机构',
        dataType: '数据类型',
        typeName: '所属分类',
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
      },
      modalData : {
            type: 'input',
            disabled: false,
            show:true,
            word: 'text',
            prop: 'name',
            name: '订阅名称',
            placeholder: '请输入订阅名称'
      }
    }
  }
}

export default (data) => {
  return new catalogItemOptions(data);
}
