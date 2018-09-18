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
      </div>
      <div class="split cl">
        <div class="split-left">
          <Table class="tableList" :loading="tableData.loading" ref="tableData" :columns="tableData.columns" :data="tableData.tableList"></Table>
        </div>
        <div class="split-right">
          <Card style="width:100%" :dis-hover="true" v-if="structData.length === 0">
            <div style="text-align:center">
              <h3>请选择资源</h3>
            </div>
          </Card>
        </div>
      </div>
      <Modal data-parent="sParent" :width="900" v-model="modalOpreation" :closable="false" title="选择要挂接的资源" :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
        <FilterForm :options="filterData"></FilterForm>
        <Table class="tableList" :loading="sourceTableData.loading" ref="sourceTableData" highlight-row @on-current-change="selectTable" :columns="sourceTableData.columns" :data="sourceTableData.tableList"></Table>
        <Pager :options="sourceTableData.pageData.total"></Pager>
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
        console.log(vm.$route)
        let ID = {
          ID: vm.$route.params.id
        };
        vm.api[vm.apis.detailApi](ID).then((data) => {
          vm.detailData = data.data;
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
        vm.modalData.sqlColumnTable.initData.pageNum = 1;
        vm.initSqlColumnTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName, vm.modalData.formObj.tableName);
        vm.initSqlDataTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName, vm.modalData.formObj.tableName);
      },
      ok (name) {
        let vm = this;

      },
      cancel () {
        let vm = this;
        vm.modalOpreation = false;
      },
    }
  }
</script>

<style lang="less" scoped>
  .main-content{
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
