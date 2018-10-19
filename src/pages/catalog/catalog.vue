/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/12
*
* 描述 ：目录管理
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="tree-content">
      <Input search enter-button placeholder="请输入关键词" class="hiddenInput" @on-search="searchTree"/>
      <Tree class="tree-nodes" :data="treeData" @on-toggle-expand="expand"></Tree>
    </div>
    <div class="main-content cl" v-if="catalogId !== ''">
      <FilterForm :options="filterData"></FilterForm>
      <opreationWidgets :options="opreationData"></opreationWidgets>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal footer-hide :width="1080" v-model="modalOpreation" :closable="false" :title="modalData.title.name" :mask-closable="false">
        <Steps :current="modalData.current" class="modal-steps">
          <Step title="填写目录资源内容"></Step>
          <Step title="编辑信息项"></Step>
          <Step title="完成"></Step>
        </Steps>
        <Form class="formValidate" ref="formValidate" :model="modalData.formObj" :rules="modalData.ruleObj" :label-width="120" :show-message="true" v-show="modalData.current === 0">
          <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="item in modalData.widgets" v-show="item.show">
            <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="modalData.formObj[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum">
            </Input>
            <Input class="formValidate-widget" size="large" :rows="item.rows" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="modalData.formObj[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'textarea'">
            </Input>
            <Select @on-change="changeOption" v-model="modalData.formObj[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select'" style="width:300px">
              <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="radio-group" v-show="modalData.current === 1">
          <RadioGroup v-model="modalData.itemsOpreate" @on-change="changeRadio">
            <Radio :label="option.key" :key="option.value" v-for="option in modalData.itemsOpreateArr"></Radio>
          </RadioGroup>
        </div>
        <div class="tableList-item" v-show="modalData.current === 1">
          <Table class="tableList" :loading="modalData.itemTableData.loading" ref="selection" :columns="modalData.itemTableData.columns" :data="modalData.itemTableData.tableList" v-show="modalData.current === 1"></Table>
          <Button class="item-add" type="dashed" @click="addItem">新增数据</Button>
        </div>
        <!--<div class="cl pages" v-show="modalData.current === 1">-->
          <!--<Page class-name="tablePager" :total="modalData.itemPageData.total" :page-size="modalData.itemPageData.pageSize" show-total @on-change="changeDataTablePage" :current="modalData.itemPageData.currentPage"></Page>-->
        <!--</div>-->
        <div class="infoComplete" v-show="modalData.current === 2">
          <Icon class="icon-complete" type="ios-checkmark-circle" />
          <p>提交成功</p>
        </div>
        <div class="btn-group">
          <Button type="primary" @click="next" v-if="modalData.current === 0">下一步</Button>
          <Button type="info" @click="pre" v-if="modalData.current === 1">上一步</Button>
          <Button type="primary" @click="ok" v-if="modalData.current === 1">提交</Button>
          <Button type="error" @click="cancel('formValidate')" v-if="modalData.current < 2">取消</Button>
          <Button type="error" @click="close" v-if="modalData.current === 2">关闭</Button>
        </div>
      </Modal>
      <ModalConTent :options="modalShareOpreation" :widgets="modalShareWidgets" @modalStatus="changeModal"></ModalConTent>
    </div>
    <div class="main-content cl" style="height: 600px; line-height: 600px; text-align: center" v-if="catalogId === ''">
      <h2>请在左侧列表中选择资源</h2>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/catalog/catalog'

  export default{
    name: 'catalog',
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
      this.initTree();
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
        vm.api[vm.apis.treeApi]().then((data) => {
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
        vm.modalShareData.catalogId = id;
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
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
        vm.modalData.itemTableData.tableList.push(vm.deepCopy(vm.modalData.formObj.infoAddDtoList[0], {}));
        vm.modalData.itemTableData.loading = false;
        vm.modalData.loading = false;
        vm.modalOpreation = true;
      },
      //查看
      view: function (id) {
        let vm = this;
        vm.$router.push({'path': '/catalog/itemInfo/' + id});
      },
      //修改
      edit: function (id) {
        let vm = this;
        let ID = {
          ID: id
        };
        let initData = {
          id: id,
          name: '',
          code: '',
          shareType: '',
          openType: ''
        };
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](ID).then((data) => {
          for (let obj in vm.modalData.formObj) {
            if (obj === 'infoAddDtoList' || obj === 'catalogId') {
              continue
            } else {
              vm.modalData.formObj[obj] = data.data[obj];
            }
          }
          vm.modalData.title = vm.modalData.titles.editTitle;
          vm.modalData.apiUrl = vm.apis.editApi;
          vm.modalData.currentId = id;
          vm.modalWidgets = vm.modalData;
          vm.$Loading.finish();
          vm.modalOpreation = true;
        }).catch((error) => {
          vm.$Loading.error();
        });
        vm.api[vm.apis.listItemsApi](initData).then((data) => {
          vm.modalData.itemTableData.tableList = data.datas;
          vm.modalData.itemPageData.total = data.datas.length;
          for (let i = 0, len = vm.modalData.itemPageData.pageSize; i < len; i++) {
            vm.modalData.itemTableData.currentTableList.push(vm.modalData.itemTableData.tableList[i])
          }
          vm.modalData.itemTableData.loading = false;
        }).catch((error) => {
          vm.$Loading.error();
        });
      },
      //删除
      deleteItem: function (id) {
        let vm = this;
        let params = {
          ID: id
        };
        vm.api[vm.apis.deleteApi](params).then((data) => {
          vm.$Loading.finish();
          vm.initTable(vm.catalogId);
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //是否显示模态框
      changeModal (status) {
        let vm = this;
        vm.modalShareOpreation = status;
        vm.incrementList = [];
        vm.modalShareData.widgets[5].disabled = true;
        vm.modalShareData.widgets[5].show = false;
        vm.modalShareData.widgets[5].options = vm.incrementList;
      },
      //导入文件
      importFile () {

      },
      //下拉框选择
      changeOption (value) {
        let vm = this;

      },
      //取消
      cancel () {
        let vm = this;
        vm.modalOpreation = false;
        vm.$refs.formValidate.resetFields();
        vm.deepCopy(vm.modalData.oldFormObj, vm.modalData.formObj);
        delete vm.modalData.formObj.ID;
        vm.modalData.itemTableData.tableList = [];
        vm.modalData.current = 0;
        vm.modalData.currentId = '';
      },
      //下一步
      next () {
        let vm = this;
        vm.$refs['formValidate'].validate((valid) => {
          if (valid) {
            vm.modalData.current = 1;
          } else {
            vm.$Message.error('验证失败');
          }
        });
      },
      //上一步
      pre () {
        let vm = this;
        vm.modalData.current = 0;
      },
      //关闭
      close () {
        let vm = this;
        vm.modalOpreation = false;
        vm.modalData.current = 0;
      },
      //提交
      ok () {
        let vm = this;
        for (let i = 0, len = vm.modalData.itemTableData.tableList.length; i < len; i++) {
          if (vm.modalData.itemTableData.tableList[i].code === '' || vm.modalData.itemTableData.tableList[i].code === null) {
            return vm.$Message.error('信息项编码必填！');
          }
          delete vm.modalData.itemTableData.tableList[i].$isEdit;
        }
        vm.modalData.formObj.infoAddDtoList = vm.modalData.itemTableData.tableList;
        let params = {};
        if (vm.modalData.apiUrl === 'catalogUpdate') {
          params.ID = vm.modalData.currentId;
        }
        vm.api[vm.modalData.apiUrl](vm.modalData.formObj, params).then((data) => {
          vm.$Loading.finish();
          vm.$Message.success('提交成功！');
          vm.initTable(vm.catalogId);
          vm.$refs.formValidate.resetFields();
          vm.deepCopy(vm.modalData.oldFormObj, vm.modalData.formObj);
          delete vm.modalData.formObj.ID;
          vm.modalData.itemTableData.tableList = [];
          vm.modalData.current = 2;
          vm.modalData.currentId = '';
        }).catch((error) => {
          vm.$Loading.error();
        });
      },
      //信息项编辑
      changeRadio () {

      },
      deleteItems (params) {
        let vm = this;
        vm.modalData.itemTableData.tableList.splice(params.index, 1);
      },
      addItem () {
        let vm = this;
        vm.modalData.itemTableData.tableList.push(vm.deepCopy(vm.modalData.formObj.infoAddDtoList[0], {}));
        vm.modalData.itemPageData.total = vm.modalData.itemTableData.tableList.length;
      },
      handleEdit (row) {
        let vm = this;
        vm.$set(row, '$isEdit', true)
      },
      handleSave (row) {
        let vm = this;
        if (row.code === '') {
          return vm.$Message.error('信息项编码必填！');
        } else {
          vm.$set(row, '$isEdit', false)
        }
      },
      changeDataTablePage (page) {
        let vm = this;
        vm.modalData.itemTableData.currentTableList = [];
        let len;
        if (vm.modalData.itemPageData.pageSize * page > vm.modalData.itemPageData.total) {
          len = vm.modalData.itemPageData.total;
        } else {
          len = vm.modalData.itemPageData.pageSize * page;
        }
        for (let i = (page - 1) * vm.modalData.itemPageData.pageSize; i < len; i++) {
          vm.modalData.itemTableData.currentTableList.push(vm.modalData.itemTableData.tableList[i])
        }
      },
      //共享开放
      open (id, type) {
        let vm = this;
        let ID = {
          id: id
        };
        let params = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](params).then((data) => {
          let incrementId = data.data.mountItemId;
          let initData = {
            id: incrementId
          };
          if (type === 'db') {
            vm.modalShareData.widgets[4].options[0].children[1].disabled = false;
            vm.api[vm.apis.incrementApiUrl](initData).then((data) => {
              let structData = data.datas;
              for (let i = 0, len = structData.length; i < len; i++) {
                vm.incrementList.push({
                  value: structData[i].columnName,
                  key: structData[i].columnName + ' (' + structData[i].columnType + ')'
                });
              }
            }).catch((error) => {

            });
          } else {
            vm.modalShareData.widgets[4].options[0].children[1].disabled = true;
          }
          vm.api[vm.apis.shareDetailApi](ID).then((data) => {
            for (let obj in data.data) {
              if (obj === 'share' || obj === 'open' || obj === 'subscribeLicense') {
                if (data.data[obj]) {
                  vm.modalShareData.formObj[obj] = 1;
                }
              } else if (obj === 'publishMode') {
                if (data.data[obj] !== '') {
                  vm.modalShareData.formObj[obj] = data.data[obj].split(',');
                  if (data.data[obj] === '1,1') {
                    vm.modalShareData.widgets[5].disabled = false;
                    vm.modalShareData.widgets[5].show = true;
                  }
                } else {
                  vm.modalShareData.formObj[obj] = [];
                }
              } else {
                vm.modalShareData.formObj[obj] = data.data[obj];
              }
            }
            if (data.data.publishRate === '1') {
              vm.modalShareData.widgets.push({
                type: 'input',
                disabled: false,
                show: true,
                word: 'text',
                prop: 'timeSet',
                name: '定时设置',
                placeholder: '请输定时表达式'
              });
              vm.modalShareData.ruleObj.timeSet.push({
                required: true,
                message: '请输入定时设置',
                trigger: 'blur'
              });
            }
            vm.modalShareData.title = vm.modalShareData.titles.editTitle;
            vm.modalShareData.apiUrl = vm.apis.shareUpdateApi;
            vm.modalShareData.currentId = id;
            vm.modalShareData.incrementId = incrementId;
            vm.modalShareWidgets = vm.modalShareData;
            vm.$Loading.finish();
            vm.modalShareOpreation = true;
          }).catch((error) => {
            vm.$Loading.error();
          });
        }).catch((error) => {
          vm.$Loading.error();
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-content{
    width: 70%;
    float: left;
  }
  .tree-content{
    width: 24%;
    background-color: #ffffff;
    float: left;
    margin: 20px 0 20px 20px;
    padding: 15px 20px;
  }
  .modal-steps{
    width: 50%;
    position: relative;
    margin: 20px auto;
  }
  .formValidate{
    width: 70%;
    position: relative;
    margin: 25px auto;
  }
  .btn-group{
    width: 100%;
    position: relative;
    margin: 25px auto;
    text-align: center;
  }
  .radio-group{
    width: 90%;
    position: relative;
    margin: 25px auto;
  }
  .tableList-item{
    width: 90%;
    position: relative;
    margin: 25px auto;
    text-align: center;
  }
  .pages{
    width: 90%;
    margin: 0 auto;
  }
  .hiddenInput{
    display: none;
  }
  .infoComplete{
    text-align: center;
    .icon-complete{
      font-size: 100px;
      color: #52c41a;
    }
    p{
      font-size: 24px;
    }
  }
</style>
