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
  import Data from '../../../config/catalog/catalogItem'

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
      this.initTable();
      this.view();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        let id = vm.$route.params.id;
        vm.tableData.loading = true;
        vm.initData.id = id;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;
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
          console.log(data);
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
