/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：雄安发布
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <FilterForm :options="filterData"></FilterForm>
    <opreationWidgets :options="opreationData"></opreationWidgets>
    <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList" @on-selection-change="getSelected"></Table>
    <Pager :options="pageData.total"></Pager>
    <ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>
    <Modal :width="700" v-model="modalRelease" @on-ok="sortRelease">
      <h3 slot="header">您选择了{{tableData.selectedItem.length}}条咨询内容，确定发布吗？</h3>
      <ul class="orderList">
        <li class="orderTitle">
          <span class="newsName">标题</span>
          <span class="newsImg">图片</span>
          <span class="newsOrder">操作排序</span>
        </li>
        <li class="orderItem" v-for="(item, index) in tableData.selectedItem">
          <span class="newsName">{{item.title}}</span>
          <span class="newsImg"><img :src="item.img"></span>
          <span class="newsOrder">
            <p v-if="tableData.selectedItem.length === 1">只有一条数据时无排序操作</p>
            <Icon class="newsOpreate" type="arrow-up-c" size="22" @click="orderUp(index)" v-if="index !== 0"></Icon>
            <Icon class="newsOpreate" type="arrow-down-c" size="22" @click="orderDown(index)" v-if="index !== tableData.selectedItem.length - 1"></Icon>
          </span>
        </li>
      </ul>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/newsRelease/newsRelease'

  export default {
    name: 'xaRelease',
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
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.records;
          vm.pageData.total = data.total;
          vm.tableData.loading = false;
          for (let i = 0, len = vm.tableData.tableList.length; i < len; i++) {
            if (vm.tableData.tableList[i].status === 1) {
              vm.tableData.tableList[i]._disabled = true;
            }
          }
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
        vm.api[vm.apis.detailApi](ID).then((data) => {
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
      //删除
      deleteItem: function (id) {
        let vm = this;
        let params = {};
        params[vm.modalData.idObj] = id;
        vm.api[vm.apis.deleteApi](params).then((data) => {
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
      //批量发布
      releases: function () {
        let vm = this;
        if (vm.tableData.selectedItem.length === 0) {
          vm.$Notice.warning({
            title: '',
            desc: '请选择需要发布的内容！'
          });
        }else if (vm.tableData.selectedItem.length > 4) {
          vm.$Notice.warning({
            title: '',
            desc: '一次最多只能批量发布4条资讯！'
          });
        }else {
          vm.modalRelease = true;
        }
      },
      //发布排序操作
      orderUp: function (index) {
        let vm = this;
        let temp = vm.tableData.selectedItem[index];
        vm.tableData.selectedItem.splice(index, 1, vm.tableData.selectedItem[index - 1]);
        vm.tableData.selectedItem.splice(index - 1, 1, temp);
      },
      orderDown: function (index) {
        let vm = this;
        let temp = vm.tableData.selectedItem[index];
        vm.tableData.selectedItem.splice(index, 1, vm.tableData.selectedItem[index + 1]);
        vm.tableData.selectedItem.splice(index + 1, 1, temp);
      },
      //排序后发布
      sortRelease: function () {
        let vm = this;
        vm.tableData.selectedIds = [];
        for (let i = 0, len = vm.tableData.selectedItem.length; i < len; i++) {
          vm.tableData.selectedIds.push(vm.tableData.selectedItem[i].id);
        }
        let params = {
          ids: vm.tableData.selectedIds.join(',')
        };
        vm.api.newsRelease(params).then((data) => {
          vm.$Loading.finish();
          vm.$Notice.warning({
            title: '',
            desc: '发布成功！'
          });
          vm.initTable();
        }).catch((error) => {
          vm.$Loading.error();
          vm.$Notice.warning({
            title: '',
            desc: '发布失败！'
          });
        });
      },
      //获取选择内容
      getSelected: function (selection) {
        let vm = this;
        vm.tableData.selectedItem = [];
        for (let i = 0, len = selection.length; i < len; i++) {
          vm.tableData.selectedItem.push(selection[i]);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .orderList{
    border: 1px solid #eeeeee;
    li{
      span{
        display: inline-block;
        width: 32%;
        text-align: center;
      }
      &.orderTitle{
        span{
          font-weight: bold;
          height: 35px;
          line-height: 35px;
        }
      }
      &.orderItem{
        border-top: 1px solid #eeeeee;
        padding: 15px 0;
        .newsImg{
          height: 100px;
          overflow: hidden;
          vertical-align: middle;
          img{
            width: 150px;
          }
        }
        .newsOrder{
          .newsOpreate{
            cursor: pointer;
            &:hover{
              color: #2E84EB;
            }
          }
        }
      }
    }
  }
</style>
