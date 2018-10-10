/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/19
*
* 描述 ：资源审核
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <FilterForm :options="filterData"></FilterForm>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal :width="900" footer-hide v-model="modalOpreation" :closable="false" title="资源详情" :mask-closable="false">
        <ul class="infoList cl">
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
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/sourceAudit/sourceAudit'

  export default{
    name: 'sourceAudit',
    components: {
      ContentTitle,
      FilterForm,
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
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      //资源
      source: function (id) {
        let vm = this;
        let ID = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](ID).then((data) => {
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
      //查看
      view: function (id) {
        let vm = this;
        let ID = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](ID).then((data) => {
          let content = `<ul>`;
          for (let i = 0, len = vm.modalData.infoObj.length; i < len; i++ ) {
            content += `<li>${vm.modalData.infoObj[i].name}：${data.data[vm.modalData.infoObj[i].key]}</li>`
          }
          content += `</ul>`;
          vm.$Modal.info({
            title: '摘要信息',
            content: content
          });
          vm.$Loading.finish();
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //修改
      edit: function (id, type) {
        let vm = this;
        let defaultVal = 1;
        let reason = '';
        let loading = false;
        vm.$Modal.confirm({
          title: '审核',
          loading: loading,
          render: (h) => {
            return [h('RadioGroup',{
                      props:{
                        value: defaultVal
                      },
                      on:{
                        'on-change': (val) => {
                          defaultVal = val;
                          if (defaultVal === 0) {
                            document.getElementById('pass').style.display = 'none';
                            document.getElementById('rejectReason').style.display = 'block';
                          } else {
                            document.getElementById('pass').style.display = 'block';
                            document.getElementById('rejectReason').style.display = 'none';
                          }
                        }
                      }
                    },[
                      h('Radio',{
                        props:{
                          label: 1
                        }
                      }, '通过'),
                      h('Radio',{
                        props:{
                          label: 0
                        }
                      }, '拒绝')
                    ]
            ), h('Input', {
              props:{
                type: 'textarea',
                placeholder: '请输入拒绝理由',
                autosize: {
                  minRows: 2, maxRows: 5
                },
                value: reason
              },
              attrs: {
                id: 'rejectReason'
              },
              style: {
                marginTop: '10px',
                display: 'none'
              },
              on:{
                'on-blur': (event) => {
                  reason = event.target.value;
                }
              }
            }), h('p', {
              domProps: {
                innerHTML: '您是否确定通过此次审核？'
              },
              attrs: {
                id: 'pass'
              },
              style: {
                fontSize: '16px',
                marginTop: '10px'
              }
            })];
          },
          onOk: () => {
            let ID = {
              id: id,
              type: type
            };
            let params = {
              reason: reason,
              status: defaultVal
            };
            if (defaultVal === 2 && reason === '') {
              vm.$Message.info('请填写拒绝原因');
              loading = true;
              vm.$nextTick(() => {
                loading = false;
              });
              return false;
            } else if (defaultVal === 1) {
              params.reason = '';
            }
            vm.$Loading.start();
            vm.api[vm.apis.editApi](ID, params).then((data) => {
              if (data.data === 'SUCCESS') {
                vm.$Message.info('审核成功！');
                vm.initTable();
                vm.$Loading.finish();
              } else {
                vm.$Message.info('审核失败！');
              }
            }).catch((error) => {

            })
          }
        })
      },
      //审核日志
      log: function (id, type) {
        let vm = this;
        let ID = {
          id: id,
          type: type
        };
        vm.$Loading.start();
        vm.api[vm.apis.logApi](ID).then((data) => {
          let content = `<ul class="reviewList">`;
          for (let i = 0, len = data.datas.length; i < len; i++ ) {
            content += `<li style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px">
            <p>申请人：${data.datas[i].applyUsername}</p>
            <p>申请时间：${data.datas[i].applyTime}</p>
            <p>审核人：${data.datas[i].reviewUsername}</p>
            <p>审核时间：${data.datas[i].reviewTime}</p>`;
            if (data.datas[i].status === 1) {
              content += `<p>审核结果：通过</p>`;
            } else {
              content += `<p>审核结果：拒绝</p><p>拒绝理由：${data.datas[i].reason}</p>`
            }
            content += `</li>`;
          }
          content += `</ul>`;
          vm.$Modal.info({
            title: '摘要信息',
            content: content
          });
          vm.$Loading.finish();
        }).catch((error) => {

        })
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
  .infoList{
    li{
      float: left;
      font-size: 16px;
      margin-right: 20px;
    }
  }
  .btn-group{
    text-align: right;
  }
</style>
