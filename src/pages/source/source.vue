/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/12
*
* 描述 ：资源管理
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <FilterForm :options="filterData"></FilterForm>
      <opreationWidgets :options="opreationData"></opreationWidgets>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal footer-hide fullscreen v-model="modalOpreation" :closable="false" :title="modalData.title.name" :mask-closable="false">
        <Steps :current="modalData.current" class="modal-steps">
          <Step title="选择资源类型"></Step>
          <Step title="选择数据库"></Step>
          <Step title="确认信息"></Step>
        </Steps>
        <Form class="formValidate" ref="formValidate" :model="modalData.formObj" :rules="modalData.ruleObj" :label-width="120" :show-message="true" v-show="modalData.current === 0">
          <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="item in modalData.widgets" v-show="item.show">
            <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="modalData.formObj[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum">
            </Input>
            <Input class="formValidate-widget" size="large" :rows="item.rows" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="modalData.formObj[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'textarea'">
            </Input>
            <Cascader :data="item.options" :placeholder="item.placeholder" v-model="modalData.formObj[item.prop]" @on-change="changeCascader" v-if="item.type === 'selectCascader'"></Cascader>
          </FormItem>
          <FormItem class="formValidate-item" label="连通性测试">
            <a @click="connect">测试</a>
          </FormItem>
        </Form>
        <div class="table-group" v-show="modalData.current === 1">
          <Divider orientation="left">数据库</Divider>
          <Select @on-change="changeDb" v-model="modalData.formObj['dbName']" element-id="dbName" ref="dbName" placeholder="请选择数据库" style="width:300px">
            <Option v-for="option in modalData.sqlDbTable.options" :value="option.name" :key="option.name">{{option.name}}</Option>
          </Select>
          <Divider orientation="left">数据表</Divider>
          <Table class="tableList" :loading="modalData.sqlTableTable.loading" highlight-row ref="sqlTableTable" :columns="modalData.sqlTableTable.columns" :data="modalData.sqlTableTable.tableList"></Table>
          <Page class-name="tablePager" :total="modalData.sqlTableTable.total" show-total @on-change="changeTablePage"></Page>
          <Divider orientation="left">数据项</Divider>
        </div>
        <div class="confirm-info" v-show="modalData.current === 2">
          确认信息
        </div>
        <div class="btn-group">
          <Button type="info" @click="pre" v-if="modalData.current >= 1">上一步</Button>
          <Button type="primary" @click="next" v-if="modalData.current <= 1">下一步</Button>
          <Button type="primary" @click="ok" v-if="modalData.current === 2">提交</Button>
          <Button type="error" @click="cancel('formValidate')">取消</Button>
        </div>
      </Modal>
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
  import Data from '../../config/source/source'

  export default{
    name: 'sources',
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
      //新增
      add: function () {
        let vm = this;
        if (vm.modalData.formObj[vm.modalData.idObj]) {
          delete vm.modalData.formObj[vm.modalData.idObj];
        }
        vm.modalData.title = vm.modalData.titles.addTitle;
        vm.modalData.apiUrl = vm.apis.addApi;
        vm.modalData.ruleObj = vm.modalData.sqlRuleObj;
        vm.modalData.widgets = vm.modalData.sqlWidgetsObj;
        vm.deepCopy(vm.modalData.sqlObj, vm.modalData.formObj);
        vm.modalWidgets = vm.modalData;
        vm.modalOpreation = true;
        console.log(vm.modalWidgets)
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
      edit: function (id, roleName, roleId) {
        let vm = this;
        if (roleName === '') {
          roleName = '节点管理员';
        }
        let ID = {
          userId: id,
          roleName: roleName,
          roleIds: roleId
        };
        vm.$Loading.start();
        for (let obj in vm.modalData.formObj) {
          vm.modalData.formObj[obj] = ID[obj];
        }
//        vm.modalData.formObj[vm.modalData.idObj] = id;
        vm.modalData.title = vm.modalData.titles.editTitle;
        vm.modalData.apiUrl = vm.apis.editApi;
        vm.modalWidgets = vm.modalData;
        vm.$Loading.finish();
        vm.modalOpreation = true;
      },
      //删除
      deleteItem: function (id) {
        let vm = this;
        let params = {};
        params[vm.modalData.idObj] = id;
        vm.api[vm.apis.deleteApi](params).then((data) => {
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
      //改变类型
      changeCascader (value, selectedData) {
        let vm = this;

      },
      //连通性测试
      connect () {
        let vm = this;
        vm.$Message.info('连接中！');
        let connectInit = {
          type: vm.modalData.dataType[vm.modalData.formObj.dbType.join('-')],
          addr: vm.modalData.formObj.addr,
          port: vm.modalData.formObj.port,
          username: vm.modalData.formObj.username,
          password: vm.modalData.formObj.password
        };
        vm.api[vm.apis.connectApi](connectInit).then((data) => {
          if (data.data) {
            vm.modalData.currentDataBase = data.data;
            vm.$Message.success('连接成功！');
          } else {
            vm.$Message.error('连接失败！');
          }
        }).catch((error) => {
          vm.$Loading.error();
          vm.$Message.error('连接失败！');
        })
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
        console.log(vm.modalData)
        vm.$refs['formValidate'].validate((valid) => {
          if (valid) {
            if (vm.modalData.current === 2) {
              vm.modalData.current = 2;
            } else if (vm.modalData.current === 0) {
              vm.$Message.info('连接中！');
              let connectInit = {
                type: vm.modalData.dataType[vm.modalData.formObj.dbType.join('-')],
                addr: vm.modalData.formObj.addr,
                port: vm.modalData.formObj.port,
                username: vm.modalData.formObj.username,
                password: vm.modalData.formObj.password
              };
              vm.api[vm.apis.connectApi](connectInit).then((data) => {
                if (data.data) {
                  vm.modalData.currentDataBase = data.data;
                  vm.$Message.success('连接成功！');
                  vm.initSqlDbList(vm.modalData.currentDataBase);
                  vm.modalData.current += 1;
                } else {
                  vm.$Message.error('连接失败！');
                }
              }).catch((error) => {
                vm.$Loading.error();
                vm.$Message.error('连接失败！');
              })
            } else {
              vm.modalData.current += 1;
            }
          } else {
            vm.$Message.error('验证失败');
          }
        });
      },
      //上一步
      pre () {
        let vm = this;
        if (vm.modalData.current === 0) {
          vm.modalData.current = 0;
        } else {
          vm.modalData.current -= 1;
        }
      },
      //提交
      ok () {
        let vm = this;
        for (let i = 0, len = vm.modalData.itemTableData.tableList.length; i < len; i++) {
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
          vm.modalOpreation = false;
          vm.$refs.formValidate.resetFields();
          vm.deepCopy(vm.modalData.oldFormObj, vm.modalData.formObj);
          delete vm.modalData.formObj.ID;
          vm.modalData.itemTableData.tableList = [];
          vm.modalData.current = 0;
          vm.modalData.currentId = '';
        }).catch((error) => {
          vm.$Loading.error();
        });
      },
      //初始化数据库
      initSqlDbList (alias) {
        let vm = this;
        let initData = {
          alias: alias
        };
        vm.api[vm.apis.mysqlDbApi](initData).then((data) => {
          vm.modalData.sqlDbTable.options = data.datas;
          vm.modalData.formObj.dbName = data.datas[0].name;
          vm.initSqlTableTable(alias, vm.modalData.formObj.dbName);
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //选择数据库
      changeDb (value) {
        let vm = this;
        vm.modalData.formObj.dbName = value;
        vm.initSqlTableTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName);
      },
      //初始化数据库表
      initSqlTableTable (alias, db) {
        let vm = this;
        if (alias) {
          vm.modalData.sqlTableTable.initData.alias = alias;
          vm.modalData.sqlTableTable.initData.db = db;
        }
        vm.modalData.sqlTableTable.loading = true;
        vm.api[vm.apis.mysqlTableApi](vm.modalData.sqlTableTable.initData).then((data) => {
          console.log(data)
          vm.modalData.sqlTableTable.tableList = data.datas;
          vm.modalData.sqlTableTable.total = data.totalCounts;
          vm.modalData.sqlTableTable.loading = false;
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      changeTablePage (page) {
        let vm = this;
        vm.modalData.sqlTableTable.initData.alias = vm.modalData.currentDataBase;
        vm.modalData.sqlTableTable.initData.db = vm.modalData.formObj.dbName;
        vm.modalData.sqlTableTable.initData.pageNum = page;
        vm.initSqlTableTable();
      },
      //查看表结构
      viewSqlStruct (id) {
        let vm = this;
      },
      //查看表数据
      viewSqlTable (id) {
        let vm = this;
      }
    }
  }
</script>

<style lang="less" scoped>
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
</style>
