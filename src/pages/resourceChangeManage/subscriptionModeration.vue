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
    <div class="main-contents cl">

        <FilterForm :options="filterData"></FilterForm>
        <!--<opreationWidgets :options="opreationData"></opreationWidgets>-->
        <Table border class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
        <Pager :options="pageData.total"></Pager>
        <Modal footer-hide  :width="600" v-model="modalOpreation" title="授权" :closable="false" :mask-closable="false">
            <RadioGroup v-model="codeReply" @on-change="changeRadio">
              <Radio :label=0 >通过</Radio>
              <Radio :label=-1>拒绝</Radio>
            </RadioGroup>
          <p v-if="showReason" class="refuseReason">请输入拒绝理由</p>
          <Input v-model="reason" v-if="showReason" class="reason" type="textarea" :rows="4" placeholder="请输入拒绝理由" />
          <div class="btn-group">
            <Button @click="cancel">取消</Button>
            <Button type="primary" @click="ok">确定</Button>
          </div>
      </Modal>
        <!--<ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>-->
        <!--<ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>-->
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/resourceChangeManage/subscriptionModeration'

  export default{
    name: 'subscriptionModeration',
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
     // this.initTree();
      // this.getCatalogList();
    },
    methods:{
      deepCopy (oldObj, newObj) {
        let vm = this;
        newObj = newObj || {};
        for (let i in oldObj) {
          if (typeof oldObj[i] === 'object') {
            newObj[i] = (oldObj[i].constructor === Array) ? [] : {};
            vm.deepCopy(oldObj[i], newObj[i]);
          } else {
            newObj[i] = oldObj[i];
          }
        }
        return newObj;
      },

      //初始化表格
      initTable: function (id) {
        let vm = this;
        console.log(vm.codeReply);
        /*vm.catalogId = id;
        vm.initData.catalogId = id;
        vm.filterData.catalogId = id;
        vm.modalData.formObj.catalogId = id;
        vm.modalData.oldFormObj.catalogId = id;*/
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = parseInt(data.totalCounts);
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


      changeRadio: function () {
        let vm = this;
        console.log(vm.codeReply);
        if (vm.codeReply == 0) {
            vm.showReason = false;
            vm.reason = "";
        } else {
          vm.showReason = true;
        }
      },
      //订阅审核
      auditing: function (dsId,subId,subscriberId) {
        let vm = this;
        vm.modalOkData.dsID = dsId;
        vm.modalOkData.subID = subId;
        vm.modalOkData.subscriberID = subscriberId;
        vm.modalOpreation = true;
       // vm.$router.push({'path': '/resourceChangeManage/itemInfo/' + id});
      },

      cancel: function () {
        let vm = this;
        vm.modalOpreation = false;
        vm.modalOk = true;
      },
      ok: function () {
        let vm = this;
        vm.modalOkData.reason = vm.reason;
        vm.modalOkData.codeReply = vm.codeReply;
        if (vm.codeReply == -1 && vm.reason =="") {
           vm.$Message.info("请填写拒绝理由");
        } else
        {
          vm.api[vm.apis.subscribeAuditApi](vm.modalOkData).then((data) => {
            console.log(data);
          /*  vm.tableData.tableList = data.datas;
            vm.pageData.total = parseInt(data.totalCounts);
            vm.tableData.loading = false;*/
            vm.cancel();
          }).catch((error) => {

          })
        }
        console.log(vm.reason);
      },

      //审核详情
      auditingDetail: function (dsId,subId,subscriberId) {
        let vm = this;
        let id = dsId+"&"+subId+"&"+subscriberId

        vm.$router.push({'path': '/subscriptionModeration/auditDetail/' +id});
      }
    }
  }
</script>

<style lang="less" scoped>
  .btn-group{
    text-align: right;
    margin-top: 20px;
  }
  .reason{
    margin-top: 8px;
  }
  .refuseReason{
    margin-top: 20px;

  }
  .main-contents{
    margin: 20px;
    background-color: #f0f2f5;
    padding: 15px 10px;
  }
  .left{
    float: left;
    width: 24%;
    height: auto;
    overflow: hidden;
    background: #fff;
    color:#666;
    margin-right:30px;
    padding: 15px 20px;
  }
  .right{
    float: left;
    width: 74%;
    height: auto;
    overflow: hidden;
    background: #fff;
    color:#666
  }
  .hiddenInput{
    display: none;
  }
</style>
