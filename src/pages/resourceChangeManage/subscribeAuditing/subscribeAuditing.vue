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
      <FilterForm :options="filterData"></FilterForm>
      <!--<opreationWidgets :options="opreationData"></opreationWidgets>-->
      <Table border class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal footer-hide  :width="600" v-model="modalOpreation" title="审核" :closable="true" :mask-closable="false" @on-cancel="cancel">
        <RadioGroup v-model="higherUpStatus" @on-change="changeRadio">
          <Radio :label=1 >通过</Radio>
          <Radio :label=0>拒绝</Radio>
        </RadioGroup>
        <p v-if="!showReason" class="refuseReason">您是否确定通过此次审核？</p>
        <p v-if="showReason" class="refuseReason">请输入拒绝理由</p>
        <Input v-model="higherUpReason" v-if="showReason" class="reason" type="textarea" :rows="4" placeholder="请输入拒绝理由" />
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
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../../components/pager/pager.vue'
  import ModalConTent from '../../../components/modal/modal.vue'
  import Data from '../../../config/resourceChangeManage/subscribeAuditing'

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
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = parseInt(data.totalCounts);
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },

      //是否显示模态框
      changeModal (status) {
        let vm = this;
        vm.modalOpreation = status;
      },


      changeRadio: function () {
        let vm = this;
        if (vm.higherUpStatus == 1) {
          vm.showReason = false;
          vm.higherUpReason = "";
        } else {
          vm.showReason = true;
        }
      },
      //订阅审核
      auditing: function (id) {
        let vm = this;
        vm.modalOkData.id = id;
//        vm.modalOkData.subID = subId;
//        vm.modalOkData.subscriberID = subscriberId;
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
        vm.modalOkData.higherUpReason = vm.higherUpReason;
        vm.modalOkData.higherUpStatus = vm.higherUpStatus;
        vm.api[vm.apis.higherUpAuditApi](vm.modalOkData).then((data) => {
          vm.modalOpreation = false;
          vm.$Message.success("审核成功");
          vm.initTable();
          vm.cancel();
        }).catch((error) => {
          vm.$Message.error(error);
        })

      },

      //审核详情
      auditingDetail: function (id) {
        let vm = this;
//        let id = dsId+"&"+subId+"&"+subscriberId + "&" + rowId;
        vm.$router.push({'path': '/subscribeAuditing/subscribeAuditingLogs/' +id});
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
