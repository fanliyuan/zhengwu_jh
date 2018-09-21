/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/18
*
* 描述 ：资源挂接
*/
<template>
  <div class="cl">
    <ContentTitle :options="title" :backbtn="isBackBtn" :saveBtn="isSaveBtn"></ContentTitle>
    <div class="main-content cl" style="padding: 15px 25px;">
      <ul class="infoList cl">
        <li v-for="(item, key) in detailNameData" :key="key">
          <span>{{item}}：</span>{{detailData[key]}}
        </li>
      </ul>
      <Divider />
      <div class="selectSource">
        <span>挂接资源名称: {{sourceName}}</span>
        <a @click="selectSource">去选择</a>
        <h4 v-if="structData.length === 0" style="color: red">
          暂未挂接资源，请选择资源需要挂接的资源
        </h4>
      </div>
      <Table class="tableList" :loading="tableData.loading" ref="tableData" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <!--<div class="split cl">-->
        <!--<div class="split-left">-->
          <!--<Table class="tableList" :loading="tableData.loading" ref="tableData" :columns="tableData.columns" :data="tableData.tableList"></Table>-->
        <!--</div>-->
        <!--<div class="split-right">-->
          <!--<Card style="width:100%" :dis-hover="true" v-if="structData.length === 0">-->
            <!--<div style="text-align:center">-->
              <!--<h3>请选择资源</h3>-->
            <!--</div>-->
          <!--</Card>-->
          <!--&lt;!&ndash;<ul class="select-list" v-if="structData.length > 0">&ndash;&gt;-->
            <!--&lt;!&ndash;<li>&ndash;&gt;-->
              <!--&lt;!&ndash;<Select @on-change="changeOption" v-model="modalData.formObj[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select'" style="width:300px">&ndash;&gt;-->
                <!--&lt;!&ndash;<Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>&ndash;&gt;-->
              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
            <!--&lt;!&ndash;</li>&ndash;&gt;-->
          <!--&lt;!&ndash;</ul>&ndash;&gt;-->
        <!--</div>-->
      <!--</div>-->
      <Modal footer-hide data-parent="sParent" :width="900" v-model="modalOpreation" :closable="false" title="选择要挂接的资源" :mask-closable="false">
        <FilterForm :options="filterData"></FilterForm>
        <Table class="tableList" :loading="sourceTableData.loading" ref="sourceTableData" highlight-row @on-current-change="selectTable" :columns="sourceTableData.columns" :data="sourceTableData.tableList"></Table>
        <Pager :options="sourceTableData.pageData.total"></Pager>
        <div class="btn-group">
          <Button @click="cancel">取消</Button>
          <Button type="primary" @click="ok" :disabled="modalOk">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import Pager from '../../../components/pager/pager.vue'
  import Data from '../../../config/catalog/catalogMount'

  export default{
    name: 'catalogItemInfo',
    components: {
      ContentTitle,
      FilterForm,
      Pager
    },
    data () {
      let vm = this;
      return Data(vm).setData()
    },
    created: function () {
      this.initItemTable();
      this.view();
    },
    methods:{
      //初始化表格
      initItemTable () {
        let vm = this;
        let id = vm.$route.params.id;
        vm.tableData.loading = true;
        vm.tableData.initData.id = id;
        vm.api[vm.apis.itemListApi](vm.tableData.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      initTable: function () {
        let vm = this;
        vm.sourceTableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.sourceTableData.tableList = data.datas;
          vm.sourceTableData.pageData.total = data.totalCounts;
          vm.sourceTableData.loading = false;
        }).catch((error) => {

        })
      },
      //初始化资源详情
      view: function () {
        let vm = this;
        let ID = {
          ID: vm.$route.params.id
        };
        vm.api[vm.apis.detailApi](ID).then((data) => {
          vm.detailData = data.data;
          if (data.data.havaMount) {
            vm.sourceName = data.data.mountItemName;
            vm.sourceId = data.data.mountItemId;
            delete data.data.mountInfoItemIdMap['@type'];
            vm.infoItemIdMap = data.data.mountInfoItemIdMap;
            vm.initStruct();
          }
        }).catch((error) => {

        })
      },
      //初始化资源表结构
      initStruct () {
        let vm = this;
        let initData = {
          id: vm.sourceId
        };
        vm.api[vm.apis.tableStructApi](initData).then((data) => {
          if (vm.tableData.columns[4]) {
            vm.tableData.columns.splice(4, 1);
          }
          vm.structData = data.datas;
          vm.tableData.columns.push({
            title: '选择映射字段',
            key: 'operate',
            render: (h, params) => {
              let defaultVal = '';
              if (vm.infoItemIdMap[params.row.id]) {
                defaultVal = vm.infoItemIdMap[params.row.id];
              }
              return h('Select', {
                props: {
                  value: defaultVal
                },
                on: {
                  'on-change': (value) => {
                    vm.infoItemIdMap[params.row.id] = value;
                  }
                }
              }, vm.structData.map((item) => {
                return h('Option', {
                  props: {
                    value: item.id,
                    label: item.columnName + ' (' + item.columnType + ')'
                  }
                })
              }))
            }
          });
          vm.modalOpreation = false;
        }).catch((error) => {

        })
      },
      //选择资源
      selectSource () {
        let vm = this;
        vm.initTable();
        vm.modalOpreation = true;
      },
      //选择表
      selectTable (currentRow, oldCurrentRow) {
        let vm = this;
        vm.sourceName = currentRow.name;
        vm.sourceId = currentRow.id;
        vm.modalOk = false;
      },
      ok (name) {
        let vm = this;
        vm.initStruct();
      },
      cancel () {
        let vm = this;
        vm.modalOpreation = false;
        vm.modalOk = true;
      },
      //保存映射
      edit () {
        let vm = this;
        let ID = {
          id: vm.$route.params.id
        };
        let params = {
          itemId: vm.sourceId,
          type: vm.$route.query.mountType,
          infoItemIdMap: vm.infoItemIdMap
        };
        vm.api[vm.apis.updateApi](ID, params).then((data) => {
          if (data.data === 'SUCCESS') {
            vm.$Notice.success({
              title: '',
              desc: '保存成功！',
              duration: 5
            });
          } else {
            vm.$Notice.warning({
              title: '',
              desc: '请求数据时出错！',
              duration: 5
            });
          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-content{
  .btn-group{
    display: block;
    margin-top: 75px;
    text-align: center;
  }
  .infoList{
  li{
    float: left;
    font-size: 16px;
    margin-right: 15px;
    span{
      font-weight: bold;
    }
  }
  }
  .selectSource{
    margin-bottom: 25px;
    span{
      font-size: 16px;
      margin-right: 10px;
    }
    a{
      font-size: 14px;
    }
  }
  .split{
    width: 100%;
    position: relative;
    margin-top: 25px;
    .split-left{
      width: 70%;
      float: left;
    }
    .split-right{
      width: 30%;
      float: left;
    }
  }
  }
</style>
