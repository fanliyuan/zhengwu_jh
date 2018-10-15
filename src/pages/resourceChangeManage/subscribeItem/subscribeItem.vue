/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <!--<ContentTitle :options="title"  :surebtn="isSureBtn" :backbtn="isBackBtn"></ContentTitle>-->
    <div class="cl titleDiv">
      <h3 class="container-title">{{title}}</h3>
      <Button class="back-btn"  @click="back()">返回</Button>
      <Button class="back-btn" type="primary" v-if="!orderStatus" @click="sure()">确定</Button>
    </div>
    <div class="main-content cl">
      <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li>
            <label><span style="color:red">*</span>订阅名称:</label>
            <Input class="formValidate-widget" size="large"   v-model="subscribeName" placeholder="请输入订阅名称"  autocomplete="off" :disabled="orderStatus">
            </Input>
          </li>
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
        <!--  <li>
            是否订阅：{{orderStatus}}
          </li>-->
          <li>
            详情：<a @click="view">查看</a>
          </li>

          <li class="publish">
           发布模式： <Input class="formValidate-widget" size="large" disabled  v-model="pubMode" placeholder="发布模式"  autocomplete="off" >
          </Input>
          </li>
          <li class="publish">
            发布频率： <Input class="formValidate-widget" size="large"  disabled v-model="pubfreQuency" placeholder="发布频率"  autocomplete="off" >
            </Input>
          </li>
          <li class="publish">
            定时设置：
            <Input class="formValidate-widget smallInput" size="large" disabled  v-model="minutes" placeholder="分钟"  autocomplete="off" >
            </Input>
            <Input class="formValidate-widget smallInput" size="large" disabled  v-model="hours" placeholder="小时"  autocomplete="off" >
            </Input>
            <Input class="formValidate-widget smallInput" size="large"  disabled v-model="day" placeholder="日"  autocomplete="off" >
            </Input>
            <Input class="formValidate-widget smallInput" size="large" disabled  v-model="month" placeholder="月"  autocomplete="off" >
            </Input>
            <Input class="formValidate-widget smallInput" size="large"  disabled v-model="week" placeholder="星期"  autocomplete="off" >
            </Input>
          </li>
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
          <!--</li>-->
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
      this.initEntityInfo();
      this.showFile();
    },
    methods:{
      //初始化表格
      initDetail: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        if (paramsArr.length == 5) {
          vm.subscribeName = paramsArr[4];
        }
        vm.detailData = {
          resourceName: paramsArr[3],
          resourceProviderName: paramsArr[2],
          dataType: '数据库',
          typeName: paramsArr[1]
        }

      },

      //初始化发布模式、发布频率和定时设置
      initEntityInfo: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let ID = {
          resourceId: paramsArr[0]
        };
        vm.api[vm.apis.resourceTaskInfoApi](ID).then((data) => {
          if (data.pubMode == '1,1') {
            vm.pubMode = '自增字段';
          } else if (data.pubMode == '1,5'){
            vm.pubMode = '日志';
          } else if (data.pubMode == '4') {
            vm.pubMode = '全量';
          }
//          vm.orderStatus = data.orderStatus;
          if (data.orderStatus === "是") {
            vm.orderStatus = true;
            vm.subscribeName = data.subscribeName;
          } else {
            vm.orderStatus = false;
            vm.subscribeName = "";
          }
          switch (data.pubfreQuency) {
            case "1" :
              vm.pubfreQuency = '定时';
              break;
            case "2" :
              vm.pubfreQuency = '实时';
              break;
            case "3" :
              vm.pubfreQuency = '手动';
              break;
          }

          let timeSetting = (data.timSetting).split(',');
          if (timeSetting[0] == "") {
            vm.minutes = ""
          } else {
            vm.minutes = timeSetting[0] + "秒";
          }
          if (timeSetting[1] == "") {
            vm.hours = ""
          } else {
            vm.hours = timeSetting[1] + "分";
          }
          if (timeSetting[2] == "") {
            vm.day = ""
          } else {
            vm.day = timeSetting[2] + "小时";
          }
          if (timeSetting[3] == "") {
            vm.month = ""
          } else {
            vm.month = timeSetting[3] + "天";
          }
          if (timeSetting[4] == "") {
            vm.week = ""
          } else {
            vm.week = timeSetting[4] + "月" ;
          }

        }).catch((error) => {
          vm.$Loading.error();

        });

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
        let paramsArr = (vm.$route.params.id).split("&");
        let id = paramsArr[0] +"&"+paramsArr[1]; //资源id
        vm.sureData.catalogId = paramsArr[7];
//        vm.sureData.directoryName = paramsArr[7];
        vm.sureData.dsID = paramsArr[0];
        vm.sureData.dsName = paramsArr[3];
        vm.sureData.publishInstitution = paramsArr[2];
        vm.sureData.publisherID = paramsArr[6];
        vm.sureData.mountResourceId = paramsArr[5];
        vm.sureData.dataType = paramsArr[4];
        if ( vm.subscribeName == "" ||  vm.subscribeName == undefined ||  vm.subscribeName == null) {
          vm.$Message.warning('请填写订阅名称');
          return;
        } else {

          vm.api[vm.apis.subscribeApi](vm.sureData).then((data) => {
            vm.$Message.success("订阅成功")
            history.back(-1);
          }).catch((error) => {
            //vm.$Message.info("订阅成功")
            vm.$Loading.error();

          });
        }
      },

      back () {
        history.back();
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
  .titleDiv{
    background-color: #ffffff;
    border-bottom: 1px solid #e7eaec;
    padding: 15px 20px;
  }
  .container-title{
    float: left;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    &:before{
      content: '';
      display: inline-block;
      height: 19px;
      vertical-align: middle;
      margin-right: 4px;
      border-left: 4px solid #2d81bb;
    }
  }
  .back-btn{
    float: right;
    margin-left: 10px;
  }
  .back-btn1{
    float: right;
    .back{
      margin-left: 10px;
    }
  }
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
    .publish{
      display: block;
      clear: both;
      .smallInput{
        width:56px!important;
        display: inline-block;
      }
    }
  }
</style>
