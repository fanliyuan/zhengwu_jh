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
    <div class="main-content cl">
      <FilterForm :options="filterData"></FilterForm>
      <opreationWidgets :options="opreationData"></opreationWidgets>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal footer-hide fullscreen v-model="modalOpreation" :title="modalData.title.name" :mask-closable="false">
        <Steps :current="modalData.current" class="modal-steps">
          <Step title="填写目录资源内容"></Step>
          <Step title="编辑信息项"></Step>
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
        <div class="cl pages" v-show="modalData.current === 1">
          <Pager :options="modalData.itemPageData.total"></Pager>
        </div>
        <div class="btn-group">
          <Button type="primary" @click="next" v-if="modalData.current === 0">下一步</Button>
          <Button type="info" @click="pre" v-if="modalData.current === 1">上一步</Button>
          <Button type="primary" @click="ok" v-if="modalData.current === 1">提交</Button>
        </div>
      </Modal>
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
        vm.$Loading.start();
        vm.api[vm.apis.detailApi](ID).then((data) => {
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
      //导入文件
      importFile () {

      },
      //下拉框选择
      changeOption (value) {
        let vm = this;
        if (vm.hideToken) {
          let options = vm.$props.widgets.widgets[3].options;
          let tokenSelect = vm.$props.widgets.widgets[4];
          let tokenShow = '';
          for (let i = 0, len = options.length; i < len; i++) {
            if (value === options[i].value) {
              tokenShow = options[i].tokenStatus;
              switch (tokenShow) {
                case 0:
                  tokenSelect.show = false;
                  break;
                case 1:
                  tokenSelect.show = true;
                  break;
              }
            }
          }
        }
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
      //提交
      ok () {
        let vm = this;
        for (let i = 0, len = vm.modalData.itemTableData.tableList.length; i < len; i++) {
          delete vm.modalData.itemTableData.tableList[i].$isEdit;
        }
        vm.modalData.formObj.infoAddDtoList = vm.modalData.itemTableData.tableList;
        vm.api[vm.apis.addApi](vm.modalData.formObj).then((data) => {
          vm.$Loading.finish();
          vm.initTable();
          vm.modalOpreation = false;
          vm.$refs.formValidate.resetFields();
          vm.deepCopy(vm.modalData.oldFormObj, vm.modalData.formObj);
          vm.modalData.itemTableData.tableList = [];
          vm.modalData.current = 0;
          console.log(vm.modalData.itemTableData.tableList)
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
</style>
