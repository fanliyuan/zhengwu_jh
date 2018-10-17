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
      <!--<Button class="back-btn"  @click="back()" type="primary">返回</Button>-->
      <div class="infoTitle">
        <Card class="infoTitle-Card" :dis-hover="true">
          <ul class="infoList cl">
            <li v-for="(item, key) in detailTitle" :key="key">
              {{item}}：<span>{{detailTitleData[key]}}</span>
            </li>
          </ul>
        </Card>
      </div>
      <div class="infoContent">
        <div class="infoDetail">
          <p>资源挂接</p>
          <Card class="infoCard" :dis-hover="true">
            <ul class="infoList cl">
              <li v-for="(item, key) in resourceNameData" :key="key">
                <span>{{item}}：</span>
                <span>{{resourceData[key]}}</span>
              </li>
              <li>
                <span>资源：</span>
                <a @click="source()">查看</a>
              </li>
            </ul>
          </Card>
        </div>
        <div class="infoDetail">
          <p>订阅详情</p>
          <Card class="infoCard" :dis-hover="true">
            <ul class="infoList cl">
              <li v-for="(item, key) in subscriptionNameData" :key="key">
                <span>{{item}}：</span>
                <span>{{subscriptionData[key]}}</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
   <!--   <Card class="infoCard" :dis-hover="true">
        <ul class="infoList cl">
          <li v-for="(item, key) in detailNameData" :key="key">
            {{item}}：{{detailData[key]}}
          </li>
        </ul>
      </Card>-->
      <Modal :width="900" footer-hide v-model="modalOpreation" :closable="false" title="资源详情" :mask-closable="false">
        <ul class="infoLists cl">
          <li>数据库：{{modalData.sqlTableTable.dbName}}</li>
          <li>数据表：{{modalData.sqlTableTable.tableName}}</li>
          <li>中文标注：{{modalData.sqlTableTable.tableNote}}</li>
        </ul>
        <Divider orientation="left">数据项</Divider>
        <Tabs v-if="modalData.sqlColumnTable.tableList.length > 0">
          <TabPane label="浏览" icon="md-list">
            <Table class="tableList" :loading="modalData.sqlDataTable.loading" ref="sqlDataTable" :columns="modalData.sqlDataTable.columns" :data="modalData.sqlDataTable.tableList"></Table>
            <Page class-name="tablePager" :total="modalData.sqlDataTable.total" @on-change="changeDataTablePage" :current="modalData.sqlDataTable.currentPage" show-total></Page>
          </TabPane>
          <TabPane label="结构" icon="md-git-network">
            <Table class="tableList" :loading="modalData.sqlColumnTable.loading" ref="sqlColumnTable" :columns="modalData.sqlColumnTable.columns" :data="modalData.sqlColumnTable.tableList"></Table>
          </TabPane>
        </Tabs>
        <div class="btn-group">
          <Button type="error" @click="cancel">关闭</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import Pager from '../../components/pager/pager.vue'
  import Data from '../../config/resourceChangeManage/auditDetail'

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
      this.getMountId();
    },
    methods:{
      back () {
        history.back(-1);
      },
      //初始化资源详情
      view: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let params = {
          dsID: paramsArr[0],
          subID: paramsArr[1],
          subscriberID: paramsArr[2]
        };
        vm.api[vm.apis.detailApi](params).then((data) => {
          vm.resourceData.resourceName = data.datas.providerName;
          vm.resourceData.dataType = data.datas.mountType;
          vm.resourceData.node = data.datas.node;
          vm.resourceData.registerTime = data.datas.registerTime;
          vm.resourceData.institutions = data.datas.institution;
          vm.subscriptionData.subscriberName = data.datas.subscriberName;
          vm.subscriptionData.subscribeInstitution = data.datas.subscribeInstitution;
          vm.subscriptionData.subTime = data.datas.subTime;
          vm.subscriptionData.reviewReason = data.datas.reviewReason;
          vm.detailTitleData.infoCode = data.datas.infoCode;
          vm.detailTitleData.name = data.datas.name;
          vm.detailTitleData.providerName = data.datas.providerName;
          vm.detailTitleData.infoCode = data.datas.infoCode;
          vm.detailTitleData.registerTime = data.datas.registerTime;
             if (data.datas.status == 0) {
//               data.datas.status = '已拒绝'
               vm.subscriptionData.status = '已拒绝 '+ data.datas.reviewTime;
             }
             if (data.datas.status == -1) {
//               data.datas.status = '待授权'
               vm.subscriptionData.status = '待授权 '+ data.datas.reviewTime;
             }
             if (data.datas.status == 1) {
//               data.datas.status = '已通过'
               vm.subscriptionData.status = '已通过 '+ data.datas.reviewTime;
             }

          vm.detailData = data.datas;
        }).catch((error) => {

        })
//        let resourceId;
        let param = {
          resourceId: paramsArr[0]
        };
        vm.api[vm.apis.mountResourceIdApi](param).then((data) => {
          vm.resourceId = data;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },

      //得到资源id
      getMountId: function () {
        let vm = this;
        let paramsArr = (vm.$route.params.id).split("&");
        let param = {
          resourceId: paramsArr[0]
        };
        vm.api[vm.apis.mountResourceIdApi](param).then((data) => {
          vm.resourceId = data;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },

      //查看资源
      //资源
      source: function () {
        let vm = this;
        let ID = {
          ID: vm.resourceId
        };
        vm.$Loading.start();
        vm.api[vm.apis.modalDetailApi](ID).then((data) => {
          vm.$Message.info('连接中！');
          let connectInit = {
            type: data.data.resourceType,
            addr: data.data.addr,
            port: data.data.port,
            username: data.data.username,
            password: data.data.password
          };
          vm.api[vm.apis.connectApi](connectInit).then((dataA) => {
            if (dataA.data) {
              vm.$Message.success('连接成功！');
              vm.modalData.currentDataBase = data.data.alias;
              vm.modalData.sqlTableTable.dbName = data.data.dbName;
              vm.modalData.sqlTableTable.tableName = data.data.tableName;
              vm.modalData.sqlTableTable.tableNote = data.data.tableNote;
              vm.initSqlColumnTable(data.data.alias, data.data.dbName, data.data.tableName);
              vm.initSqlDataTable(data.data.alias, data.data.dbName, data.data.tableName);
              vm.$Loading.finish();
              vm.modalOpreation = true;
            } else {
              vm.$Message.error('连接失败！');
            }
          }).catch((error) => {
            vm.$Loading.error();
            vm.$Message.error('连接失败！');
          })
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //初始化数据库表字段
      initSqlColumnTable (alias, db, tableName) {
        let vm = this;
        if (alias) {
          vm.modalData.sqlColumnTable.initData.alias = alias;
          vm.modalData.sqlColumnTable.initData.db = db;
          vm.modalData.sqlColumnTable.initData.table = tableName;
        }
        vm.modalData.sqlColumnTable.loading = true;
        vm.api[vm.apis.mysqlColumnApi](vm.modalData.sqlColumnTable.initData).then((data) => {
          for (let i = 0, len = data.datas.length; i < len; i++) {
            let primaryKey = false;
            if (data.datas[i].primaryKey) {
              primaryKey = true;
            }
          }
          vm.modalData.sqlColumnTable.tableList = data.datas;
          vm.modalData.sqlColumnTable.loading = false;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      initSqlDataTable (alias, db, tableName) {
        let vm = this;
        if (alias) {
          vm.modalData.sqlDataTable.initData.alias = alias;
          vm.modalData.sqlDataTable.initData.db = db;
          vm.modalData.sqlDataTable.initData.table = tableName;
        }
        vm.modalData.sqlDataTable.loading = true;
        vm.api[vm.apis.mysqlDataApi](vm.modalData.sqlDataTable.initData).then((data) => {
          vm.modalData.sqlDataTable.columns = [];
          if (data.datas.length > 0) {
            for (let obj in data.datas[0]) {
              if (obj !== '@type') {
                vm.modalData.sqlDataTable.columns.push({
                  title: obj,
                  key: obj
                });
              }
            }
          }
          vm.modalData.sqlDataTable.tableList = data.datas;
          vm.modalData.sqlDataTable.total = data.totalCounts;
          vm.modalData.sqlDataTable.loading = false;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      changeDataTablePage (page) {
        let vm = this;
        vm.modalData.sqlDataTable.initData.alias = vm.modalData.currentDataBase;
        vm.modalData.sqlDataTable.initData.db = vm.modalData.sqlTableTable.dbName;
        vm.modalData.sqlDataTable.initData.table = vm.modalData.sqlTableTable.tableName;
        vm.modalData.sqlDataTable.initData.pageNum = page;
        vm.modalData.sqlDataTable.currentPage = page;
        vm.initSqlDataTable();
      },
      //取消
      cancel () {
        let vm = this;
        vm.modalData.sqlDataTable.initData.pageNum = 1;
        vm.modalData.sqlDataTable.currentPage = 1;
        vm.modalOpreation = false;
      },
      //是否显示模态框
      changeModal (status) {
        let vm = this;
        vm.modalOpreation = status;
      }
    }
  }
</script>

<style lang="less" scoped>
  .back-btn{
    float: right;
  }
  .main-content{
    .infoTitle {
      /*padding-bottom: 24px;*/
      border-bottom: 1px solid #e8e8e8;
      margin-left: 20px;
      margin-right: 20px;
      .ivu-card-body{
        padding: 1px;
      }
      .infoTitle-Card{
        /*margin: 20px;*/
        clear: both;
        text-align: left;
        border:none!important;
        margin-bottom: 20px;
        .infoList{
          li{
            font-weight: 700;
            font-size: 16px;
            float: left;
            /*width: 20%;*/
            margin-right: 20px;
            /*margin-bottom: 15px;*/
            span{
              font-weight:100;
              font-size: 16px;
            }
          }
        }
      }
    }
    .infoContent {
      margin-top: 70px;
      padding: 24px 32px;
      .infoDetail{
        float: left;
        width:50%;
        p{
          font-size: 18px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
        }
        .infoCard{
          margin: 20px;
          clear: both;
          margin-left: 175px;
          /*text-align: center;*/
          border:none!important;
          .infoList{
            li{
              /*float: left;*/
              font-size: 16px;
              line-height: 3;
              /*margin-bottom: 15px;*/
              span:first-of-type{
                display: inline-block;
                text-align: right;
                width: 100px;
                margin-right: 4px;
              }
            }
          }
        }
      }
    }


  }
  .infoLists li{
    float: left;
    font-size: 16px;
    margin-right: 20px;
  }
  .btn-group{
    text-align: right;
  }
</style>
