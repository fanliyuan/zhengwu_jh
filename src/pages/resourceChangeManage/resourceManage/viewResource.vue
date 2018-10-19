/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <ContentTitle :options="title" :backbtn="isBackBtn" :exportBtn="isExportBtn"></ContentTitle>
    <div class="main-content cl">
      <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
        </ul>
      </Card>
      <p class="totalNum">数据表  共<span>{{dataTableTotal}}</span>张</p>
      <Table class="tableList tableList1" id="tableList1" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <div class="dataItem" v-if="showStructureTable">
        <p class="totalNum">数据项  共<span>{{dataItemTotal}}</span>行</p>
        <Table class="tableList" :loading="tableData1.loading" ref="selection" :columns="tableData1.columns" :data="tableData1.tableList"></Table>
        <Page class-name="tablePager" :total="pageData1.total" show-total @on-change="changeStructTablePage" :current="tableData1.currentPage"></Page>
        <!--<Pager :options="pageData1.total"></Pager>-->
      </div>
      <div class="dataItem" v-if="showViewTable">
        <p class="totalNum">数据项  共<span>{{dataItemTotal1}}</span>行</p>
        <Table class="tableList" :loading="tableData2.loading" ref="selection" :columns="tableData2.columns" :data="tableData2.tableList"></Table>
        <Page class-name="tablePager" :total="pageData2.total" show-total @on-change="changeDataTablePage" :current="tableData2.currentPage"></Page>
        <!--<Pager :options="pageData2.total"></Pager>-->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import Pager from '../../../components/pager/pager.vue'
  import Data from '../../../config/resourceChangeManage/viewResource'

  export default{
    name: 'itemDetailInfo',
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
      this.initTable();

//      this.initTable2();
    //  this.view();
      this.detail();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        vm.tableData.loading = true;
        vm.api[vm.apis.tableListApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.dataTableTotal = data.totalCounts
          this.initTable1(data.datas[0].name);
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      initTable1: function (name) {
        let vm = this;
        vm.tableData1.loading = true;
        vm.initData1.tableName = name;
        vm.initData1.pageNum = 1;
        vm.tableData1.currentPage = 1;
        vm.api[vm.apis.tableStructureListApi](vm.initData1).then((data) => {
          vm.tableData1.tableList = data.datas;
          vm.pageData1.total = data.totalCounts;
          vm.dataItemTotal = data.totalCounts
          vm.tableData1.loading = false;
        }).catch((error) => {

        })
      },
      initTable2: function (name) {
        let vm = this;
        vm.tableData2.loading = true;
        vm.initData2.tableName = name;
        vm.initData2.pageNum = 1;
        vm.tableData2.currentPage = 1;
        vm.tableData2.columns = [];
        vm.api[vm.apis.tableDataListApi](vm.initData2).then((data) => {
          vm.tableData2.columns.push( {
            type: 'selection',
            width: 60,
            align: 'center'
          },
            {
              title: '序号',
              type: 'index',
              width: 70,
            });
          delete data.datas[0]["@type"];
          for ( let i in data.datas[0]) {
            vm.tableData2.columns.push(
              {
                title: i,
                key: i
              }
            );
          }
          vm.tableData2.tableList = data.datas;
          vm.pageData2.total = data.totalCounts;
          vm.dataItemTotal1 = data.totalCounts
          vm.tableData2.loading = false;
        }).catch((error) => {

        })
      },


      changeStructTablePage (page) {
        let vm = this;
        let name;
        name = vm.initData1.tableName;
        vm.initData1.pageNum = page;
        vm.tableData1.currentPage = page;
        vm.initTable1(name);
      },

      changeDataTablePage (page) {
        let vm = this;
        let name;
        name = vm.initData2.tableName;
        vm.initData2.pageNum = page;
        vm.tableData2.currentPage = page;
        vm.initTable2(name);
      },
      //初始化资源详情
      detail: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        vm.detailData.dbName =  paramsArr[1];
//        vm.detailData.dbType =  paramsArr[2];
        if (paramsArr[2] === '3') {
          vm.detailData.dbType = "Mysql"
        }
        vm.detailData.dsName =  paramsArr[3];
        vm.detailData.publishInstitution =  paramsArr[4];
        vm.detailData.updateTime =  paramsArr[5];

      },
      //浏览
      view: function (type,name,index) {
        let vm = this;
        vm.showClass = index;
        vm.operateName = type;
        if (type === "浏览") {
          vm.showStructureTable = false;
          vm.showViewTable = true;
          this.initTable2(name);
        } else if (type === "结构") {
          vm.showStructureTable = true;
          vm.showViewTable = false;
          this.initTable1(name);
        }},

      //导出
      Export: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let resourceId = paramsArr[0];
        let fileName;
        vm.$router.push({'path': '/resourceManagement/export/' +resourceId});

      }
    }
  }
</script>

<style>
  .foo{
    color:red;
    margin-left: 30px;
  }
  .active{
    color:silver!important;
    margin-right: 5px;
    /*color:'#3fa9ff',*/
    cursor:pointer;
  }
  .dataItem{
    margin-top: 90px;
  }
  .totalNum{
    margin-left: 24px;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .tableList1 span{
    /*color:red!important;*/
    cursor: default;
  }
  #tableList1 tr:nth-child(1)>td:last-of-type span:last-of-type{
       /*color:red!important;*/
       cursor: default;
  }
  .main-content{
    .infoCard{
      margin: 20px;
    }
    .infoList{
      li{
        float: left;
        width: 25%;
        margin-bottom: 15px;
        &:last-child{
          display: block;
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }


</style>
