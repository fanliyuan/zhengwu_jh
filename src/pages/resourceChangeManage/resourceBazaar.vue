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
      <div class="left">
        <div class="tree-content">
          <Input search enter-button placeholder="请输入关键词" class="hiddenInput" @on-search="searchTree"/>
          <Tree class="tree-nodes" :data="treeData" @on-toggle-expand="expand"></Tree>
        </div>
      </div>
      <div class="right"  v-if="catalogId !== ''">
         <FilterForm :options="filterData"></FilterForm>
      <!--<opreationWidgets :options="opreationData"></opreationWidgets>-->
      <Table border class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>
      </div>
      <div class="right" style="height: 600px; line-height: 600px; text-align: center" v-if="catalogId === ''">
        <h2>请在左侧列表中选择资源</h2>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/resourceChangeManage/resourceBazaar'

  export default{
    name: 'resourceBazaar',
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
     // this.initTable();
      this.initTree();
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
                      vm.initTable(data.id);
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
      searchTree (value) {

      },
      //初始化表格
      initTable: function (id) {
        let vm = this;
        vm.catalogId = id;
        vm.initData.catalogId = id;
        vm.filterData.catalogId = id;
        vm.modalData.formObj.catalogId = id;
        vm.modalData.oldFormObj.catalogId = id;
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.rows;
          vm.pageData.total = parseInt(data.total);
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

       //资源订阅
      subscribe: function (id,typeName,resourceProviderName,resourceName,dataType,mountResourceId,nodeId,typeId) {
        let vm = this;
        let params = id + "&" + typeName + "&" + resourceProviderName + "&"+ resourceName + "&" +dataType+"&"+mountResourceId+"&"+nodeId+"&"+typeId;
        vm.$router.push({'path': '/resourceChangeManage/itemInfo/' + params});
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
