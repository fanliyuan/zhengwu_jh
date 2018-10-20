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
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList" @on-selection-change="getSelected"></Table>
      <Pager :options="pageData.total"></Pager>
      <Modal footer-hide :width="1080" v-model="modalOpreation" :closable="true" :title="modalData.title.name" :mask-closable="false" @on-cancel="cancel">
        <Steps :current="modalData.current" class="modal-steps">
          <Step title="选择资源类型"></Step>
          <Step :title="modalData.stepTwoName"></Step>
          <Step title="设置采集计划"></Step>
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
          <FormItem class="formValidate-item" label="连通性测试" v-if="modalData.currentType !== 'file'">
            <a @click="connect">测试</a>
          </FormItem>
        </Form>
        <div class="table-group" v-if="modalData.current === 1 && modalData.currentType === 'sql'">
          <Divider orientation="left">数据库</Divider>
          <Select @on-change="changeDb" v-model="modalData.formObj['dbName']" element-id="dbName" ref="dbName" placeholder="请选择数据库" style="width:300px">
            <Option v-for="option in modalData.sqlDbTable.options" :value="option.name" :key="option.name">{{option.name}}</Option>
          </Select>
          <Divider orientation="left">数据表</Divider>
          <Table class="tableList" :loading="modalData.sqlTableTable.loading" highlight-row @on-current-change="selectTable" ref="sqlTableTable" :columns="modalData.sqlTableTable.columns" :data="modalData.sqlTableTable.tableList"></Table>
          <Page class-name="tablePager" :total="modalData.sqlTableTable.total" show-total @on-change="changeTablePage" :current="modalData.sqlTableTable.currentPage"></Page>
          <Divider orientation="left">数据项</Divider>
          <Card style="width:320px; margin: 0 auto;" :dis-hover="true" v-if="modalData.sqlColumnTable.tableList.length === 0">
            <div style="text-align:center">
              <h3>请选择数据库表</h3>
            </div>
          </Card>
          <Tabs v-if="modalData.sqlColumnTable.tableList.length > 0">
            <TabPane label="浏览" icon="md-list">
              <Table class="tableList" :loading="modalData.sqlDataTable.loading" ref="sqlDataTable" :columns="modalData.sqlDataTable.columns" :data="modalData.sqlDataTable.tableList"></Table>
              <Page class-name="tablePager" :total="modalData.sqlDataTable.total" show-total @on-change="changeDataTablePage" :current="modalData.sqlDataTable.currentPage"></Page>
            </TabPane>
            <TabPane label="结构" icon="md-git-network">
              <Table class="tableList" :loading="modalData.sqlColumnTable.loading" ref="sqlColumnTable" :columns="modalData.sqlColumnTable.columns" :data="modalData.sqlColumnTable.tableList"></Table>
            </TabPane>
          </Tabs>
        </div>
        <Form class="formValidate" ref="formValidateFile" :model="modalData.formObj" :label-width="120" :show-message="true" v-if="modalData.current === 1 && modalData.currentType === 'file'">
          <FormItem class="formValidate-item" label="上传文件" prop="fileAddDtoList">
            <Upload multiple type="drag" action="/api/api/v2/zhengwu/swap/resource/file/up" :max-size="51200" :default-file-list="modalData.formObj.fileAddDtoList" :before-upload="handleBeforeUpload" :on-success="uploadFileSuccess" :on-remove="removeFile" :on-error="uploadError" :on-exceeded-size="uploadExceededSize">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖拽上传文件</p>
              </div>
            </Upload>
          </FormItem>
        </Form>
        <Tree :data="modalData.ftpList" :load-data="loadData" @on-check-change="checkTree" show-checkbox v-if="modalData.current === 1 && modalData.currentType === 'ftp'"></Tree>
        <Form class="formValidate" ref="formValidateTime" :model="modalData.formTimeObj" :rules="modalData.ruleTimeObj" :label-width="120" :show-message="true" v-show="modalData.current === 2">
          <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="item in modalData.widgetsTime" v-show="item.show">
            <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="modalData.formTimeObj[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum">
            </Input>
            <Select @on-change="changeOption" v-model="modalData.formTimeObj[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select' && item.prop === 'collectRate'" style="width:300px">
              <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
            </Select>
            <Select v-model="modalData.formTimeObj[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select' && item.prop !== 'collectRate'" style="width:300px">
              <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
            </Select>
            <Cascader :data="item.options" :placeholder="item.placeholder" v-model="modalData.formTimeObj[item.prop]" @on-change="changeCascaderTime" v-if="item.type === 'selectCascader'"></Cascader>
          </FormItem>
        </Form>
        <div class="confirm-info" v-show="modalData.current === 3">
          <Card style="width:80%; margin: 0 auto;" :dis-hover="true">
            <ul class="infoList cl">
              <li v-for="(item, index) in modalData.infoObj" :key="item.key">
                <span>{{item.name}}：</span>
                <span>{{modalData.formObj[item.key]}}</span>
              </li>
            </ul>
          </Card>
        </div>
        <div class="btn-group">
          <Button type="info" @click="pre" v-if="modalData.current >= 1">上一步</Button>
          <Button type="primary" @click="next" v-if="modalData.current <= 2 && modalData.currentType === 'sql'" :disabled="modalData.current === 1 && modalData.formObj.tableName === ''">下一步</Button>
          <Button type="primary" @click="next" v-if="modalData.current <= 2 && modalData.currentType !== 'sql'" :disabled="modalData.current === 1 && !modalData.fileNext">下一步</Button>
          <Button type="primary" @click="ok" v-if="modalData.current === 3">提交</Button>
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
          for (let i = 0; i < data.datas.length; i++) {
           if (!data.datas[i].sc) {
             data.datas[i]._disabled = true;
            }
          }
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;

        }).catch((error) => {

        })
      },
      //获取选择内容
      getSelected (selection) {
        let vm = this;
        vm.tableData.selectedIds = [];
        for (let i = 0, len = selection.length; i < len; i++) {
          vm.tableData.selectedIds.push({
            id: selection[i].id,
            type: selection[i].type
          });
        }
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
        vm.modalData.ruleTimeObj = vm.modalData.setRuleTimeObj;
        vm.modalData.widgets = vm.modalData.sqlWidgetsObj;
        vm.modalData.widgetsTime = vm.modalData.setWidgetsTimeObj;
        vm.deepCopy(vm.modalData.sqlObj, vm.modalData.formObj);
        vm.deepCopy(vm.modalData.timeObj, vm.modalData.formTimeObj);
        vm.modalWidgets = vm.modalData;
        vm.modalOpreation = true;
      },
      //查看sql资源详情
      view: function (id, api, items) {
        let vm = this;
        let ID = {
          ID: id
        };
        vm.$Loading.start();
        vm.api[api](ID).then((data) => {
          let content = `<ul>`;
          for (let i = 0, len = items.length; i < len; i++ ) {
            content += `<li>${items[i].name}：${data.data[items[i].key]}</li>`
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
      edit: function (id) {
        let vm = this;
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
      deleteItem: function (id, type) {
        let vm = this;
        let params;
        if (id && type) {
          params = [];
          params.push({
            id: id,
            type: type
          });
          vm.api[vm.apis.deleteApi](params).then((data) => {
            vm.$Loading.finish();
            vm.initTable();
          }).catch((error) => {
            vm.$Loading.error();
          })
        } else {
          if (vm.tableData.selectedIds.length === 0) {
            vm.$Message.error('请选择需要删除的资源！');
            return false;
          } else {
            params = vm.tableData.selectedIds;
            vm.$Modal.confirm({
              title: '信息',
              content: '是否删除选择的信息？',
              onOk: function () {
                vm.api[vm.apis.deleteApi](params).then((data) => {
                  vm.$Loading.finish();
                  vm.initTable();
                  vm.tableData.selectedIds = [];
                }).catch((error) => {
                  vm.$Loading.error();
                })
              }
            });
          }
        }
      },
      //是否显示模态框
      changeModal (status) {
        let vm = this;
        vm.modalOpreation = status;
      },
      //改变类型
      changeCascader (value, selectedData) {
        let vm = this;
        for (let obj in vm.modalData.formObj) {
          if (vm.modalData.oldFormObj[obj] === undefined) {
            delete vm.modalData.formObj[obj];
          }
        }
        switch (value[0]) {
          case 1:
            vm.modalData.stepTwoName = '选择数据库';
            vm.modalData.currentType = 'sql';
            vm.modalData.ruleObj = vm.modalData.sqlRuleObj;
            vm.modalData.widgets = vm.modalData.sqlWidgetsObj;
            vm.deepCopy(vm.modalData.sqlObj, vm.modalData.formObj);
            break;
          case 2:
            if (value.join(',') === '2,3') {
              vm.modalData.stepTwoName = '上传文件';
              vm.modalData.currentType = 'file';
              vm.modalData.apiUrl = vm.apis.addFilesApi;
              vm.modalData.ruleObj = vm.modalData.filesRuleObj;
              vm.modalData.widgets = vm.modalData.filesWidgetsObj;
              vm.deepCopy(vm.modalData.filesObj, vm.modalData.formObj);
            } else {
              vm.modalData.stepTwoName = '选择文件';
              vm.modalData.currentType = 'ftp';
              vm.modalData.apiUrl = vm.apis.addFtpApi;
              vm.modalData.ruleObj = vm.modalData.ftpRuleObj;
              vm.modalData.widgets = vm.modalData.ftpWidgetsObj;
              vm.deepCopy(vm.modalData.ftpObj, vm.modalData.formObj);
            }
            break;
        }
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
      //上传本地文件-成功
      handleBeforeUpload (file) {

      },
      uploadFileSuccess (response, file, fileList) {
        let vm = this;
        let fileInfo = response.result.data;
        if (fileInfo) {
          vm.$set(vm.modalData.formObj.fileAddDtoList, vm.modalData.formObj.fileAddDtoList.length, {
            uid: file.uid,
            name: fileInfo.name,
            size: fileInfo.size,
            type: fileInfo.type,
            uploadTime: fileInfo.uploadTime,
            url: fileInfo.url
          });
          vm.modalData.fileNext = true;
        }
      },
      //上传本地文件-删除
      removeFile (file, fileList) {
        let vm = this;
        let files = vm.modalData.formObj.fileAddDtoList;
        for (let i = 0, len = files.length; i < len; i++) {
          if (files[i].uid === file.uid) {
            files.splice(i, 1);
            break;
          }
        }
        if (files.length < 1) {
          vm.modalData.fileNext = false;
        }
      },
      //上传本地文件-上传失败
      uploadError () {
        let vm = this;
        vm.$Notice.warning({
          title: '',
          desc: '文件上传失败！',
          duration: 3
        });
      },
      //上传本地文件-大小超出
      uploadExceededSize () {
        let vm = this;
        vm.$Notice.warning({
          title: '',
          desc: '最大上传文件大小：50MB',
          duration: 3
        });
      },
      //设置采集计划-选择采集频率
      changeOption (value) {
        let vm = this;
        if (vm.modalData.formTimeObj.collectRate === '1') {
          vm.modalData.widgetsTime.push({
            type: 'input',
            disabled: false,
            show: true,
            word: 'text',
            prop: 'timeSet',
            name: '定时设置',
            placeholder: '请输定时表达式'
          });
          vm.modalData.setRuleTimeObj.timeSet.push({
            required: true,
            message: '请输入定时设置',
            trigger: 'blur'
          });
        } else {
          vm.modalData.widgetsTime.splice(3, 1);
          vm.modalData.setRuleTimeObj.timeSet.splice(0, 1);
        }
      },
      //设置采集计划-选择采集模式
      changeCascaderTime (value) {
        let vm = this;
        if (value.join(',') === '1,1') {
          vm.modalData.formTimeObj.incrementField = vm.modalData.widgetsTime[1].options[0].value;
          vm.modalData.widgetsTime[1].disabled = false;
          vm.modalData.widgetsTime[1].show = true;
        } else {
          vm.modalData.widgetsTime[1].disabled = true;
          vm.modalData.widgetsTime[1].show = false;
          vm.modalData.formTimeObj.incrementField = '';
        }
      },
      //取消
      cancel () {
        let vm = this;
        vm.modalOpreation = false;
        vm.modalData.sqlDbTable.options.splice(0, vm.modalData.sqlDbTable.options.length);
        vm.incrementList.splice(0, vm.incrementList.length);
        vm.modalData.setWidgetsTimeObj[1].disabled = true;
        vm.modalData.setWidgetsTimeObj[1].show = false;
        vm.$refs.formValidate.resetFields();
        vm.$refs.formValidateTime.resetFields();
        vm.modalData.current = 0;
      },
      //下一步
      next () {
        let vm = this;
        if (vm.modalData.current === 0) {
          vm.$refs['formValidate'].validate((valid) => {
            if (valid) {
              if (vm.modalData.currentType !== 'file') {
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
                    if (vm.modalData.currentType === 'sql') {
                      vm.initSqlDbList(vm.modalData.currentDataBase);
                    } else {
                      vm.initFtpData(vm.modalData.currentDataBase, '/');
                    }
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
        } else if (vm.modalData.current === 2) {
          vm.$refs['formValidateTime'].validate((valid) => {
            if (valid) {
              vm.modalData.current += 1;
            } else {
              vm.$Message.error('验证失败');
            }
          });
        } else {
          if (vm.modalData.current === 3) {
            vm.modalData.current = 3;
          } else {
            vm.modalData.current += 1;
          }
        }
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
//        let params = {};
//        if (vm.modalData.apiUrl === 'catalogUpdate') {
//          params.ID = vm.modalData.currentId;
//        }
        switch (vm.modalData.currentType) {
          case 'sql':
            vm.modalData.formObj.alias = vm.modalData.currentDataBase;
            vm.modalData.formObj.resourceType = vm.modalData.dataType[vm.modalData.formObj.dbType.join('-')];
            vm.modalData.formObj.dbType = vm.modalData.formObj.dbType[1];
            break;
          case 'file':
            break;
          case 'ftp':
            vm.modalData.formObj.alias = vm.modalData.currentDataBase;
            break;
        }
        vm.modalData.formObj.collectEditDto = vm.modalData.formTimeObj;
        vm.api[vm.modalData.apiUrl](vm.modalData.formObj).then((data) => {
          vm.$Loading.finish();
          vm.$Message.success('提交成功！');
          vm.initTable();
          vm.modalOpreation = false;
          switch (vm.modalData.currentType) {
            case 'sql':
              vm.modalData.sqlDbTable.options.splice(0, vm.modalData.sqlDbTable.options.length);
              vm.incrementList.splice(0, vm.incrementList.length);
              vm.modalData.setWidgetsTimeObj[1].disabled = true;
              vm.modalData.setWidgetsTimeObj[1].show = false;
              vm.$refs.formValidate.resetFields();
              break;
            case 'file':
              vm.modalData.currentType = 'sql';
              vm.modalData.fileNext = false;
              vm.modalData.stepTwoName = '选择数据库';
              break;
            case 'ftp':
              break;
          }
          vm.$refs.formValidateTime.resetFields();
          vm.modalData.current = 0;
        }).catch((error) => {
          vm.$Loading.error();
        });
      },
      //初始化FTP数据
      initFtpData (alias, path) {
        let vm = this;
        let initData = {
          alias: alias,
          path: path
        };
        vm.modalData.ftpList = [];
        vm.api[vm.apis.ftpDataApi](initData).then((data) => {
          for (let i = 0, len = data.datas.length; i < len; i++) {
            if (data.datas[i].open) {
              vm.modalData.ftpList.push({
                title: data.datas[i].name,
                loading: false,
                children: [],
                open: data.datas[i].open,
                path: data.datas[i].path,
                type: data.datas[i].type
              });
            } else {
              vm.modalData.ftpList.push({
                title: data.datas[i].name,
                children: [],
                open: data.datas[i].open,
                path: data.datas[i].path,
                type: data.datas[i].type
              });
            }
          }
          vm.deepTree(vm.modalData.ftpList);
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //异步加载FTP数据
      loadData (item, callback) {
        let vm = this;
        let initData = {
          alias: vm.modalData.currentDataBase,
          path: item.path + item.title + '/'
        };
        let childrenData = [];
        vm.api[vm.apis.ftpDataApi](initData).then((data) => {
          for (let i = 0, len = data.datas.length; i < len; i++) {
            if (data.datas[i].open) {
              childrenData.push({
                title: data.datas[i].name,
                loading: false,
                children: [],
                open: data.datas[i].open,
                path: data.datas[i].path,
                type: data.datas[i].type
              });
            } else {
              childrenData.push({
                title: data.datas[i].name,
                children: [],
                open: data.datas[i].open,
                path: data.datas[i].path,
                type: data.datas[i].type
              });
            }
          }
          vm.deepTree(childrenData);
          callback(childrenData);
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      checkTree (value) {
        let vm = this;
        vm.modalData.formObj.ftpfileAddDtoList = [];
        for (let i = 0, len = value.length; i < len; i++) {
          delete value[i].notPost;
        }
        vm.deepNodes(value);
        vm.setNodes(value);
      },
      //设置需要传输的节点
      setNodes (arr) {
        let vm = this;
        for (let i = 0, len = arr.length; i < len; i++) {
          if (!arr[i].notPost) {
            vm.modalData.formObj.ftpfileAddDtoList.push({
              name: arr[i].title,
              open: arr[i].open,
              path: arr[i].path,
              type: arr[i].type
            });
          }
        }
        if (vm.modalData.formObj.ftpfileAddDtoList.length > 0) {
          vm.modalData.fileNext = true;
        } else {
          vm.modalData.fileNext = false;
        }
      },
      //递归传输节点
      deepNodes (arr) {
        let vm = this;
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i].children.length > 0) {
            vm.deleteChildren(arr[i].title, arr);
            vm.deepNodes(arr[i].children);
          }
        }
      },
      //删除子节点
      deleteChildren (title, arr) {
        let vm = this;
        for (let i = 0, len = arr.length; i < len; i++) {
          let path = arr[i].path.substr(arr[i].path.lastIndexOf('/', arr[i].path.lastIndexOf('/') - 1) + 1);
          let pathStr = path.substring(0, path.length - 1);
          if (pathStr === title) {
            arr[i].notPost = true;
          }
        }
      },
      //递归树
      deepTree (arr) {
        let vm = this;
        for (let i = 0, len = arr.length; i < len; i++) {
          if (arr[i].type === 'folder') {
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
//                      vm.filterData.filiterObj = vm.deepCopy(vm.filterData.defaultFiliterObj, vm.filterData.filiterObj);
//                      vm.initData = vm.deepCopy(vm.defaultInitData, vm.initData);
//                      vm.initTable(data.id);
//                      vm.currentTreeNode = node.nodeKey;
//                      for (let i = 0, len = root.length; i < len; i++) {
//                        if (root[i].nodeKey === node.nodeKey) {
//                          document.getElementById('treeNode' + root[i].nodeKey).style.backgroundColor = '#1890ff';
//                          document.getElementById('treeNode' + root[i].nodeKey).style.color = '#ffffff';
//                        } else {
//                          if (document.getElementById('treeNode' + root[i].nodeKey)) {
//                            document.getElementById('treeNode' + root[i].nodeKey).style.backgroundColor = '#ffffff';
//                            document.getElementById('treeNode' + root[i].nodeKey).style.color = '#515a6e';
//                          } else {
//                            continue
//                          }
//                        }
//                      }
                    }
                  }
                }, data.title)
              ])
            }
          }
        }
      },
      //初始化数据库
      initSqlDbList (alias) {
        let vm = this;
        let initData = {
          alias: alias
        };
        vm.api[vm.apis.mysqlDbApi](initData).then((data) => {
          vm.modalData.sqlDbTable.options = data.datas;
          if (vm.modalData.formObj.dbName === '' || vm.modalData.formObj.dbName === undefined) {
            vm.modalData.formObj.dbName = data.datas[0].name;
          }
          vm.initSqlTableTable(alias, vm.modalData.formObj.dbName);
        }).catch((error) => {
          vm.$Loading.error();
        })
      },
      //选择数据库
      changeDb (value) {
        let vm = this;
        vm.modalData.formObj.dbName = value;
        vm.modalData.sqlTableTable.initData.pageNum = 1;
        vm.modalData.sqlTableTable.currentPage = 1;
        if (vm.modalData.sqlDbTable.options.length !== 0) {
          vm.initSqlTableTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName);
        }
        vm.modalData.formObj.tableName = '';
        vm.modalData.sqlColumnTable.tableList = [];
        vm.modalData.sqlColumnTable.total = 0;
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
        vm.modalData.sqlTableTable.currentPage = page;
        vm.initSqlTableTable();
      },
      //选择表
      selectTable (currentRow, oldCurrentRow) {
        let vm = this;
        vm.modalData.formObj.tableName = currentRow.name;
        vm.modalData.sqlColumnTable.initData.pageNum = 1;
        vm.modalData.sqlDataTable.initData.pageNum = 1;
        vm.modalData.sqlDataTable.currentPage = 1;
        vm.initSqlColumnTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName, vm.modalData.formObj.tableName);
        vm.initSqlDataTable(vm.modalData.currentDataBase, vm.modalData.formObj.dbName, vm.modalData.formObj.tableName);
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
        vm.modalData.formObj.structAddDtoList = [];
        if (vm.incrementList.length !== 0) {
          vm.incrementList.splice(0, vm.incrementList.length);
        }
        vm.api[vm.apis.mysqlColumnApi](vm.modalData.sqlColumnTable.initData).then((data) => {
          for (let i = 0, len = data.datas.length; i < len; i++) {
            let primaryKey = false;
            vm.incrementList.push({
              value: data.datas[i].name,
              key: data.datas[i].name + ' (' + data.datas[i].type + ')'
            });
            if (data.datas[i].primaryKey) {
              primaryKey = true;
            }
            vm.modalData.formObj.structAddDtoList.push({
              columnName: data.datas[i].name,
              columnType: data.datas[i].type,
              note: data.datas[i].comment,
              primaryKey: primaryKey
            });
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
        vm.modalData.sqlDataTable.initData.db = vm.modalData.formObj.dbName;
        vm.modalData.sqlDataTable.initData.pageNum = page;
        vm.modalData.sqlDataTable.currentPage = page;
        vm.initSqlDataTable();
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
  .infoList{
    li{
      float: left;
      width: 50%;
    }
  }
</style>
