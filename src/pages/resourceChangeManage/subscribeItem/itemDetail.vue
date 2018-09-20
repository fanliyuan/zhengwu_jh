/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <ContentTitle :options="title" :backbtn="isBackBtn"></ContentTitle>
    <div class="main-content cl">
      <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
        </ul>
      </Card>
      <FilterForm :options="filterData"></FilterForm>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import Pager from '../../../components/pager/pager.vue'
  import Data from '../../../config/resourceChangeManage/itemDetail'

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
      this.view();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let id = paramsArr[0];
        vm.tableData.loading = true;
        vm.initData.resourceId = id;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.result;
          vm.pageData.total = data.total;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      //初始化资源详情
      view: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let ID = {
          resourceId: paramsArr[0]
        };
        vm.api[vm.apis.detailsApi](ID).then((data) => {
          vm.detailData = data;
          vm.detailData.typeName = paramsArr[1];
        }).catch((error) => {

        })
      },
    }
  }
</script>

<style lang="less" scoped>
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
