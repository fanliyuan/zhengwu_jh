/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"  :surebtn="isSureBtn" :backbtn="isBackBtn" :sureData="sureData" :subscribeName="subscribeName"></ContentTitle>
    <div class="main-content cl">
      <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li>
            <label><span style="color:red">*</span>订阅名称:</label>
            <Input class="formValidate-widget" size="large"   v-model="subscribeName" placeholder="请输入订阅名称"  autocomplete="off" >
            </Input>
          </li>
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
          <li>
            详情：<a @click="view">查看</a>
          </li>
          <li>

           <!-- <div class="createFile">
              <span>是否存文件：</span>
              <RadioGroup v-model="type" @on-change="showFile(type)">
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
              </RadioGroup>
              <div class="radioStyle" v-if="showPath">
                <label>订阅存储路径:</label>
                <Input class="formValidate-widget" size="large"   v-model="filePath" placeholder="请选择存储路径"  autocomplete="off" >
                </Input>
                <Button type="primary" @click="browserFolder">选择</Button>
              </div>

            </div>-->
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
  import Data from '../../../config/resourceChangeManage/subscribeItem'

  export default{
    name: 'subscribeItemInfo',
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
      this.initDetail();
      //this.view();
      this.showFile();
    },
    methods:{
      //初始化表格
      initDetail: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        vm.detailData = {
          resourceName: paramsArr[3],
          resourceProviderName: paramsArr[2],
          dataType: '数据库',
          typeName: paramsArr[1]
        }

      },
      //跳转到资源详情
      view: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let id = paramsArr[0] +"&"+paramsArr[1]; //资源id
        vm.$router.push({'path': '/resourceChangeManage/itemInfoDetail/' + id});
      },


      sure: function () {
        let vm = this;
        vm.sureData.subscribeName = vm.subscribeName;
        if ( vm.subscribeName == "" ||  vm.subscribeName == undefined ||  vm.subscribeName == null) {
          vm.$Message.info('请填写订阅名称');
          return;
        } else {
          vm.api[vm.apis.subscribeApi](vm.sureData).then((data) => {
            history.back(-1);
          }).catch((error) => {
            vm.$Loading.error();

          });
        }
      },
      //是否显示选择文件
      showFile: function (type) {
        let vm = this;
        if (vm.type == '是') {
             vm.showPath = true;
        } else {
          vm.showPath = false;
        }
      },
      //文件夹目录选择
      browserFolder: function () {
        let vm = this;

      }
    }
  }
</script>

<style lang="less" scoped>
  .main-content{
    .infoCard{
      margin: 20px;
    }
    .infoList{
      width:50%;
      margin-left: 40px;
      li{
        float: left;
        width:50%;
        margin-bottom: 45px;
        .ivu-input-wrapper{
          width:50%;
        }
        &:nth-child(3){
         clear: both;
        }
      }
    }
    .createFile{
      /*margin-left: 92px;*/
      margin-top: 5px;
      .radioStyle{
        margin-top: 10px;
        div{
          margin-top: 5px;
          .ivu-input-wrapper{
            width:100%!important;
          }
        }
      }
    }
  }
</style>
