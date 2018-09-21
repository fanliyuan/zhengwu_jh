/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <Button class="back-btn"  @click="back()" type="primary">返回</Button>
      <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import Pager from '../../../components/pager/pager.vue'
  import Data from '../../../config/resourceChangeManage/auditLogs'

  export default{
    name: 'auditDetail',
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
      this.view();
    },
    methods:{
      back () {
        history.back(-1);
      },
      //初始化资源详情
      view: function () {
        let vm = this;
        let params = {
          id: vm.$route.params.id
        };
        vm.api[vm.apis.detailApi](params).then((data) => {
          if (data.datas.status == -1) {
            data.datas.status = '待审核'
          }
          if (data.datas.status == 1) {
            data.datas.status = '已通过'
          }
          if (data.datas.status == 0) {
            data.datas.status = '已拒绝'
          }

          vm.detailData = data.datas;
        }).catch((error) => {

        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .back-btn{
    float: right;
  }
  .main-content{
    .infoCard{
      margin: 20px;
      clear: both;
      text-align: center;
      border:none!important;
    }
    .infoList{
      li{
        float: left;
        width: 34%;
        margin-bottom: 15px;
      }
    }
  }
</style>
