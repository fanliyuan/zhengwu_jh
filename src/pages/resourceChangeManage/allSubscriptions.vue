/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/11
*
* 描述 ：分配角色
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <template>
        <Tabs active-key="key1">
          <Tab-pane label="已订阅" key="key1">
            <FilterForm :options="filterData"></FilterForm>

            <!--<opreationWidgets :options="opreationData"></opreationWidgets>-->
            <Table border class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
            <Pager :options="pageData.total"></Pager>
            <ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>
          </Tab-pane>
          <Tab-pane label="待审核" key="key2">标签二的内容</Tab-pane>
          <Tab-pane label="订阅失败" key="key3">标签三的内容</Tab-pane>
        </Tabs>
      </template>


      </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/resourceChangeManage/allSubscriptions'

  export default{
    name: 'allSub',
    components: {
      ContentTitle,
      FilterForm,
      opreationWidgets,
      Pager,
      ModalConTent
    },
    data () {
      let vm = this;
      return Data(vm).setData()
    },
    created: function () {
      this.initTable();
      this.getRoleList();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      //新增
      add: function () {
        let vm = this;
        if (vm.modalData.formObj[vm.modalData.idObj]) {
          delete vm.modalData.formObj[vm.modalData.idObj];
        }
        vm.modalData.title = vm.modalData.titles.addTitle;
        vm.modalData.apiUrl = vm.apis.addApi;
        vm.modalWidgets = vm.modalData;
        vm.modalOpreation = true;
      },
      //查看
      view: function (id) {
        let vm = this;
        let ID = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](ID).then((data) => {
          for (let obj in vm.modalData.formObj) {
            vm.modalData.formObj[obj] = data[obj];
          }
          vm.modalData.formObj[vm.modalData.idObj] = id;
          vm.modalData.title = vm.modalData.titles.viewTitle;
          for (let i = 0, len = vm.modalData.widgets.length; i < len; i++) {
            vm.modalData.widgets[i].disabled = true;
          }
          vm.modalWidgets = vm.modalData;
          vm.$Loading.finish();
          vm.modalOpreation = true;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //修改
      edit: function (id) {
        let vm = this;
        let ID = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.listApi](ID).then((data) => {
          for (let obj in vm.modalData.formObj) {
            vm.modalData.formObj[obj] = data[obj];
          }
          vm.modalData.formObj[vm.modalData.idObj] = id;
          vm.modalData.title = vm.modalData.titles.editTitle;
          vm.modalData.apiUrl = vm.apis.editApi;
          vm.modalWidgets = vm.modalData;
          vm.$Loading.finish();
          vm.modalOpreation = true;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //状态修改
      editStatus: function (id,statusName) {
        let vm = this;
        let ID = {
          ID: id
        };
        if (statusName === '启用') {
          vm.api[vm.apis.freeze](ID).then((data) => {
            vm.$Message.info('停用成功');
            vm.initTable();
          }).catch((error) => {
            vm.$Loading.error();
          })
        } else {
          vm.api[vm.apis.unfreeze](ID).then((data) => {
            vm.$Message.info('启用成功');
            vm.initTable();
          }).catch((error) => {
            vm.$Loading.error();
          })
        }
      },
      //删除
      deleteItem: function (id) {
        let vm = this;
        let params = {};
        let ID = {
          ID: id
        };
        params[vm.modalData.idObj] = id;
        vm.api[vm.apis.deleteApi](ID).then((data) => {
          vm.$Loading.finish();
          vm.initTable();
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //是否显示模态框
      changeModal (status) {
        let vm = this;
        vm.modalOpreation = status;
      },
      //查询用户角色列表
      getRoleList: function () {
        let vm = this;
        let params = {};
        vm.api[vm.apis.roleListApi](params).then((data) => {
          for (let i = 0, len = data.datas.length; i < len; i++) {
            vm.filterRoleList.push({
              value: data.datas[i].id,
              key: data.datas[i].name
            })
          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-contents{
    margin: 20px;
    background-color: #f0f2f5;
    padding: 15px 10px;
  }
  .left{
    float: left;
    width:470px;
    height: auto;
    overflow: hidden;
    background: #fff;
    color:#666;
    margin-right:30px;
  }
  .right{
    float: left;
    width: calc(100% - 500px);
    height: auto;
    overflow: hidden;
    background: #fff;
    color:#666
  }
</style>
