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
        <Tabs active-key="key1"  @on-click="tabClick">
          <Tab-pane label="数据库" key="key1">
            <div>
              <div class="f-formItem">
                <input type="hidden" v-model="catalogId">
                <Input class="formItem-widget" size="large"  @on-focus="showModal" v-model="catalogName" placeholder="搜索分类" >
                <span class="formItem-name" slot="prepend">搜索分类</span>
                </Input>
              </div>
              <div class="f-formItem">
                <Input class="formItem-widget" size="large"  v-model="dsName" placeholder="订阅名称/目录名称" >
                <span class="formItem-name" slot="prepend">名称</span>
                </Input>
              </div>
              <div class="f-formItem">
                <Input class="formItem-widget" size="large"  v-model="publishInstitution" placeholder="请输入发布机构" >
                <span class="formItem-name" slot="prepend">发布机构</span>
                </Input>
              </div>

              <div class="f-formItem">
                <DatePicker type="daterange" @on-change="nowDateRange" :editable="false" split-panels placeholder="请选择时间段" ></DatePicker>
              </div>
              <Button type="primary" class="search" size="large" icon="md-search" @click="handleSubmit('table1')">搜索</Button>
            </div>

            <Table border class="tableList" @on-selection-change="selectionClick" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
            <Pager :options="pageData.total"></Pager>
            <!--<ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>-->
          </Tab-pane>
          <Tab-pane label="数据文件" key="key2" >
            <div>
              <div class="f-formItem">
                <input type="hidden" v-model="catalogId">
                <Input class="formItem-widget" size="large"   @on-focus="showModal" v-model="catalogName" placeholder="搜索分类" >
                <span class="formItem-name" slot="prepend">搜索分类</span>
                </Input>
              </div>
              <div class="f-formItem">
                <Input class="formItem-widget" size="large"  v-model="dsName" placeholder="订阅名称/目录名称" >
                <span class="formItem-name" slot="prepend">名称</span>
                </Input>
              </div>
              <div class="f-formItem">
                <Input class="formItem-widget" size="large"  v-model="publishInstitution" placeholder="请输入发布机构" >
                <span class="formItem-name" slot="prepend">发布机构</span>
                </Input>
              </div>

              <div class="f-formItem">
                <DatePicker type="daterange" @on-change="nowDateRange" :editable="false" split-panels placeholder="请选择时间段"></DatePicker>
              </div>
              <Button type="primary" class="search" size="large" icon="md-search" @click="handleSubmit('table2')">搜索</Button>
            </div>
            <Table border class="tableList" :loading="tableData1.loading" :columns="tableData1.columns" :data="tableData1.tableList"></Table>
            <Pager :options="pageData1.total"></Pager>
          </Tab-pane>

        </Tabs>
        <Modal :width="520" footer-hide v-model="modalOpreation" :closable="false" title="分类" :mask-closable="false">
          <Tree class="tree-nodes" :data="treeData" @on-toggle-expand="expand"></Tree>
          <div class="btn-group">
            <Button type="error" @click="cancel">关闭</Button>
            <Button type="primary" @click="ok">确定</Button>
          </div>
        </Modal>
      </template>


    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../../components/pager/pager.vue'
  import ModalConTent from '../../../components/modal/modal.vue'
  import Data from '../../../config/resourceChangeManage/resourceManage'

  export default{
    name: 'resourceManage',
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
      this.initTable1();
      this.initTree();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        vm.tableData.loading = true;
        vm.initData.status = 1;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      initTable1: function () {
        let vm = this;
        vm.tableData1.loading = true;
        vm.initData1.status = -1;
        vm.api[vm.apis.listApi](vm.initData1).then((data) => {
          vm.tableData1.tableList = data.datas;
          vm.pageData1.total = data.totalCounts;
          vm.tableData1.loading = false;
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
      view: function (id,directoryName,publishInstitution,dsName,subscribeName) {
        let vm = this;
        let params = id + "&" + directoryName + "&" + publishInstitution + "&"+ dsName + "&"+ subscribeName;
        vm.$router.push({'path': '/resourceChangeManage/itemInfo/' +params});
      },

      //审核日志
      audit: function (id) {
        let vm = this;
        vm.$router.push({'path': '/allSub/auditLogs/' +id});
      },

      //返回选中的值
      selectionClick:function (selection) {
        let vm = this;
        console.log(selection);
        vm.tableData.selectedIds = [];
        for (let i = 0, len = selection.length; i < len; i++) {
          vm.tableData.selectedIds.push({
            subscriberID: selection[i].subscriberId,
            dsID: selection[i].dsId,
            dataType: selection[i].dataType
          });
        }
        //  return arr;
      },


      //tab标签页点击
      tabClick: function () {
        let vm = this;
        vm.catalogName = "";
        vm.catalogId = "";
        vm.dsName = "";
        vm.publishInstitution = "";
        vm.runStatus = "";
        vm.filterData.filiterObj.dsName = "";
        vm.filterData.filiterObj.catalogId = "";
        vm.filterData.filiterObj.publishInstitution = "";
        vm.filterData.filiterObj.runStatus = "";
        vm.filterData.filiterObj.beginTime = "";
        vm.filterData.filiterObj.endTime = "";
      },
      //搜索
      handleSubmit: function (types) {
        let vm = this;
        vm.filterData.filiterObj.dsName = vm.dsName;
        vm.filterData.filiterObj.catalogId = vm.catalogId;
        vm.filterData.filiterObj.publishInstitution = vm.publishInstitution;
        vm.filterData.filiterObj.runStatus = vm.runStatus;
        console.log(vm.filterData.filiterObj);
        if (types == 'table1') {
          this.initTable(vm.filterData.filiterObj);
        } else if (types == 'table2') {
          this.initTable1(vm.filterData.filiterObj);
        } else if (types == 'table3') {
          this.initTable2(vm.filterData.filiterObj);
        }
      },
      //时间段
      nowDateRange (value) {
        let vm = this;
        vm.filterData.filiterObj.beginTime = value[0];
        vm.filterData.filiterObj.endTime = value[1];
      },

      //启动
      start: function () {
        let vm = this;
        let params;
        if (vm.tableData.selectedIds.length === 0) {
          vm.$Message.error('请选择需要启动的资源！');
          return false;
        } else {
          params = vm.tableData.selectedIds;
          console.log(params);
          vm.$Modal.confirm({
            title: '信息',
            content: '是否启动选择的信息？',
            onOk: function () {
              vm.api[vm.apis.runApi](params).then((data) => {
                vm.$Loading.finish();
                vm.initTable();
                vm.tableData.selectedIds = [];
              }).catch((error) => {
                vm.$Loading.error();
              })
            }
          });
        }
      },

      //停止
      stop: function () {
        let vm = this;
        let params;
        if (vm.tableData.selectedIds.length === 0) {
          vm.$Message.error('请选择需要启动的资源！');
          return false;
        } else {
          params = vm.tableData.selectedIds;
          console.log(params);
          vm.$Modal.confirm({
            title: '信息',
            content: '是否停止选择的信息？',
            onOk: function () {
              vm.api[vm.apis.stopApi](params).then((data) => {
                vm.$Loading.finish();
                vm.initTable();
                vm.tableData.selectedIds = [];
              }).catch((error) => {
                vm.$Loading.error();
              })
            }
          });
        }
      },

      //分类弹框显示
      showModal: function () {
        let vm = this;
        vm.modalOpreation = true;
      },
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
      //递归树
      deepTree (arr) {
        let vm = this;
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i].children.length > 0) {
            arr[i].render = (h, { root, node, data }) => {
              return h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', {
                  style: {
                    backgroundColor: '#ffffff'
                  }
                }, data.title)
              ])
            };
            vm.deepTree(arr[i].children);
          } else {
            arr[i].render = (h, { root, node, data }) => {
              return h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-paper-outline'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', {
                  attrs: {
                    id: 'treeNode' + node.nodeKey
                  },
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      //清空对象
                      vm.filterData.filiterObj = vm.deepCopy(vm.filterData.defaultFiliterObj, vm.filterData.filiterObj);
                      vm.initData = vm.deepCopy(vm.defaultInitData, vm.initData);
                      vm.catalogId = data.id;
                      vm.catalogName = data.title;
                      // vm.initTable(data.id);
                      vm.currentTreeNode = node.nodeKey;
                      for (let i = 0, len = root.length; i < len; i++) {
                        if (root[i].nodeKey === node.nodeKey) {
                          document.getElementById('treeNode' + root[i].nodeKey).style.backgroundColor = '#1890ff';
                          document.getElementById('treeNode' + root[i].nodeKey).style.color = '#ffffff';
                        } else {
                          if (document.getElementById('treeNode' + root[i].nodeKey)) {
                            document.getElementById('treeNode' + root[i].nodeKey).style.backgroundColor = '#ffffff';
                            document.getElementById('treeNode' + root[i].nodeKey).style.color = '#515a6e';
                          } else {
                            continue
                          }
                        }
                      }
                    }
                  }
                }, data.title)
              ])
            }
          }
        }
      },
      expand (node) {
        let vm = this;
        for (let i = 0, len = node.children.length; i < len; i++) {
          if (node.children[i].nodeKey === vm.currentTreeNode && !document.getElementById('treeNode' + node.children[i].nodeKey)) {
            vm.$nextTick(() => {
              document.getElementById('treeNode' + node.children[i].nodeKey).style.backgroundColor = '#1890ff';
              document.getElementById('treeNode' + node.children[i].nodeKey).style.color = '#ffffff';
            });
          }
        }
      },
      //初始化树形
      initTree () {
        let vm = this;
        vm.api[vm.apis.showCatalogListApi]().then((data) => {
          vm.treeData = JSON.parse(JSON.stringify(data).replace(/typeName/g, "title"));
          vm.deepTree(vm.treeData);
          vm.$Loading.finish();
        }).catch((error) => {
          vm.$Loading.error();
        })
      },


      ok: function () {
        let vm = this;
        vm.modalOpreation = false;
      },
      cancel: function () {
        let vm = this;
        vm.catalogName = "";
        vm.catalogId = "";
        vm.modalOpreation = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .f-formItem{
    display: inline-block;
    width:14%;
    margin-right: 10px;
    vertical-align: text-bottom;
    margin-bottom: 20px;
    &:first-child{
      margin-left: 20px;
    }
    .ivu-date-picker{
      width:100%;
    }
  }
  .search{
    vertical-align: top;
  }
  .main-contents{
    margin: 20px;
    background-color: #f0f2f5;
    padding: 15px 10px;
  }
  .back-btn{
    /*margin-top:8px!important;*/
    margin-bottom: 12px;
  }
  .btn-group{
    text-align: right;
  }
  .start{
    margin-left: 20px;
    margin-right: 10px;
  }
</style>
