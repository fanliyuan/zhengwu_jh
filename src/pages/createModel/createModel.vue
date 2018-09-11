/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/28
*
* 描述 ：createModel模板
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="step">
      <Steps class="step-steps" :current="step.current">
        <Step title="配置基本信息" icon="gear-a" content="配置页面的基本信息"></Step>
        <Step title="配置表单信息" icon="clipboard" content="配置页面的增删改查表单信息"></Step>
        <Step title="配置表格信息" icon="grid" content="配置页面的展示列表信息"></Step>
        <Step title="配置控件信息" icon="levels" content="配置页面的表格筛选和页头操作信息"></Step>
      </Steps>
      <Dropdown class="step-add" trigger="click" @on-click="createFormActivity" style="margin-left: 20px" v-if="step.current === 1">
        <Button type="primary">
          新增表单控件
          <Icon type="plus-circled"></Icon>
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem :name="item" :key="item" v-for="item in formDropDown">{{item}}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Form class="formValidate" :ref="forms[1].name" :model="forms[1].formObj" v-show="step.current === 1" v-if="step.current === 1">
        <Collapse v-if="forms[1].formWidgets.length > 0">
          <Panel class="cl" :key="index" v-for="(formWidget, index) in forms[1].formWidgets">
            <span v-for="(name, sindex) in currentActivityNames" v-if="sindex === index">控件{{index + 1}} - {{name}}</span>
            <span class="deleteActivity" @click="deleteFormActivity(index)"><Icon type="close-round"></Icon></span>
            <p slot="content">
              <FormItem class="formValidate-item" :label="item.name" :prop="'items.' + index + '.' + item.prop" :key="indexW" :rules="item.rules" :label-width="120" v-for="(item, indexW) in formWidget">
                <Input class="formValidate-widget" size="large" :type="item.word" v-model="forms[1].formObj.items[index][item.prop]" :placeholder="item.placeholder" v-if="item.type === 'input'">
                </Input>
                <InputNumber style="width:300px" size="large" v-model="forms[1].formObj.items[index][item.prop]" :max="item.max" :min="item.min" :placeholder="item.placeholder" v-if="item.type === 'inputNumber'"></InputNumber>
                <Select v-model="forms[1].formObj.items[index][item.prop]" :placeholder="item.placeholder" v-if="item.type === 'select'" style="width:300px">
                  <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
                </Select>
                <i-switch size="large" v-model="forms[1].formObj.items[index][item.prop]" :true-value="item.openVal" :false-value="item.closeVal" v-if="item.type === 'switch'">
                  <span slot="open">{{item.openName}}</span>
                  <span slot="close">{{item.closeName}}</span>
                </i-switch>
                <Slider v-model="item.defaultNum" :min="item.min" :max="item.max" range v-if="item.type === 'slider'"></Slider>
                <Form class="formValidate" :ref="item.prop + index" :model="forms[1].formObj.items[index][item.prop]" inline v-if="item.type === 'options'">
                  <Card :key="indexOpts" v-for="(opts, indexOpts) in item.options">
                    <FormItem class="formValidate-item" :label="opt.name" :prop="'optionItems.' + indexOpts + '.' + opt.prop" :key="indexOpt" :rules="opt.rules"  v-for="(opt, indexOpt) in opts.option">
                      <Input class="formValidate-widget" size="large" :type="opt.word" v-model="forms[1].formObj.items[index][item.prop].optionItems[indexOpts][opt.prop]" :placeholder="opt.placeholder" v-if="opt.type === 'input'">
                      </Input>
                    </FormItem>
                  </Card>
                </Form>
              </FormItem>
            </p>
          </Panel>
        </Collapse>
      </Form>
      <Form class="formValidate" v-for="(form, index) in forms" :key="form.name" :ref="form.name" :model="form.formObj" :rules="form.rules" :label-width="120" :show-message="showError" v-show="step.current === index" v-if="index !== 1">
        <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="item in form.formWidgets">
          <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="form.formObj[item.prop]" :placeholder="item.placeholder" v-if="item.type === 'input'">
          </Input>
          <CheckboxGroup v-model="form.formObj[item.prop]" v-if="item.type === 'checkboxGroup'">
            <Checkbox v-for="check in item.checkValues" :key="check" :label="check"></Checkbox>
          </CheckboxGroup>
          <InputNumber style="width:300px" size="large" v-model="formValidate[item.prop]" :max="item.max" :min="item.min" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'inputNumber'"></InputNumber>
          <Select @on-open-change="oneOfFormValidate" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select'" style="width:300px">
            <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
          </Select>
          <Select @on-open-change="oneOfFormValidate" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'selectValidateOther'" style="width:300px">
            <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
          </Select>
          <i-switch size="large" v-model="formValidate[item.prop]" :true-value="item.openVal" :false-value="item.closeVal" :disabled="item.disabled" v-if="item.type === 'switch'">
            <span slot="open">{{item.openName}}</span>
            <span slot="close">{{item.closeName}}</span>
          </i-switch>
          <Upload class="uploadListBtn" action="/api/common/fileUpload" :show-upload-list="false" :ref="item.prop" :rules="item.rules" :format="item.accept" :before-upload="handleBeforeUpload" :on-progress="handleProgress" :on-format-error="handleFormatError" :on-success="handleSuccess" :on-preview="handlePreview" :on-error="handleError" v-if="item.type === 'upload'">
            <Button type="success" icon="upload" @click="getRefName(item.prop)" :disabled="item.disabled" v-if="item.placeholder !== ''">{{item.placeholder}}</Button>
          </Upload>
          <Button type="error" icon="trash-a" @click="handleRemove(item.prop)" :disabled="item.disabled" v-if="item.type === 'upload' && item.placeholderA !== ''">{{item.placeholderA}}</Button>
          <div class="uploadListImg" v-if="item.type === 'upload'" v-show="formValidate[item.prop] !== ''">
            <img :src="formValidate[item.prop]">
          </div>
          <UEditor ref="ueditorVal" v-if="item.type === 'ueditor'" :options="formValidate[item.prop]" :disabled="item.disabled"></UEditor>
        </FormItem>
      </Form>
      <ButtonGroup class="step-btns" size="large">
        <Button type="info" @click="pre" v-if="step.showPre"><Icon type="chevron-left"></Icon> 上一步</Button>
        <Button type="primary" @click="next(step.current)" v-if="step.showNext">下一步 <Icon type="chevron-right"></Icon></Button>
        <Button type="success" @click="handleSubmit(step.current)" v-if="step.showSubmit"><Icon type="checkmark-circled"></Icon> 提 交</Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/createModel/createModel'

    export default{
      name: 'xaCreateModel',
      components: {
          ContentTitle,
          ModalConTent
      },
      data () {
          let vm = this;
          return Data(vm).setData();
      },
      created: function () {
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
        //验证表单
        validateForm (index) {
          let vm = this;
          let pass = {};
          let name = 'formValidate' + index;
          if (index === 1) {
            vm.$refs[name].validate((valid) => {
              // if (valid) {
              //   vm.$Message.success('验证通过');
              // } else {
              //   vm.$Message.error('验证失败');
              // }
              pass.isPass = valid;
            });
            for (let i = 0, len = vm.index.select; i < len; i++) {
              vm.$refs['configSelectOptions' + i][0].validate((valid) => {
                if (!valid) {
                  vm.$Message.error('还有未填写的select选项！');
                }
                pass.isPassOptions = valid;
              });
            }
          }else {
            vm.$refs[name][0].validate((valid) => {
              // if (valid) {
              //   vm.$Message.success('验证通过');
              // } else {
              //   vm.$Message.error('验证失败');
              // }
              pass.isPass = valid;
              pass.isPassOptions = true;
            });
          }
          return pass;
        },
        //生成表单控件
        createFormActivity (name) {
          let vm = this;
          let adding = [];
          let addingObj = {};
          vm.currentActivityNames.push(name);
          console.log(vm.currentActivityNames)
          adding = adding.concat(JSON.parse(JSON.stringify(vm.formConfig[name])));
          for (let i = 0, len = adding.length; i < len; i++) {
            switch (adding[i].type) {
              case 'switch':
                addingObj[adding[i].prop] = 0;
                break;
              case 'options':
                addingObj[adding[i].prop] = {
                  optionItems: [
                    {
                      configSelectOptionKey: '',
                      configSelectOptionValue: ''
                    }
                  ]
                };
                vm.index['select']++;
                break;
              case 'inputNumber':
                addingObj[adding[i].prop] = 1;
                break;
              default:
                addingObj[adding[i].prop] = '';
                break;
            }
          }
          console.log(addingObj)
          vm.forms[1].formObj.items.push(addingObj);
          vm.forms[1].formWidgets.push(adding);
          // vm.index[name]++;
          console.log(vm)
        },
        //删除表单控件
        deleteFormActivity (index) {
          let vm = this;
          vm.currentActivityNames.splice(index, 1);
          vm.forms[1].formObj.items.splice(index, 1);
          vm.forms[1].formWidgets.splice(index, 1);
          event.stopPropagation();
        },
        //生成第一步配置信息
        completeStepOne (index) {
          let vm = this;
          let apiName = vm.forms[index].formObj['apis'];
          for (let obj in vm.forms[index].formObj) {
            if (obj !== 'apis') {
              vm.defaultObj[obj] = vm.forms[index].formObj[obj];
            }
          }
          for (let i = 0, len = apiName.length; i < len; i++) {
            vm.defaultObj.apis[apiName[i].toLowerCase() + 'Api'] = vm.defaultObj.sqlCommonName + apiName[i];
          }
          vm.defaultObj.apis.listApi = vm.defaultObj.sqlCommonName + 'List';
        },
        //生成表单对象
        completeStepTwo (index) {
          let vm = this;
          // for (let i = 0, len = vm.forms[1].formWidgets[index].length; i < len; i++) {
          //   delete vm.forms[1].formObj[vm.forms[1].formWidgets[index][i].prop]
          // }
          // vm.currentActivityNames.splice(index, 1);
          // vm.forms[1].formWidgets.splice(index, 1);
          event.stopPropagation();
        },
        //生成表格信息
        completeStepThree (index) {
          console.log(1212)
        },
        //生成控件信息
        completeStepFour (index) {
          console.log(2222)
        },
        //上一步
        pre () {
          let vm = this;
          vm.step.current -= 1;
          vm.step.showPre = true;
          vm.step.showNext = true;
          vm.step.showSubmit = false;
          vm.$nextTick(() => {
            if (vm.step.current === 0) {
              vm.step.showPre = false;
              vm.step.showNext = true;
              vm.step.showSubmit = false;
            }
          });
        },
        //下一步
        next (index) {
          let vm = this;
          let pass = vm.validateForm(index);
          if (pass.isPass && pass.isPassOptions) {
            console.log('aaaa')
            let funName = vm.step.stepFun[index];
            console.log(funName)
            vm.step.current += 1;
            vm.step.showPre = true;
            vm.step.showNext = true;
            vm.step.showSubmit = false;
            vm.$nextTick(() => {
              if (vm.step.current === 3) {
                vm.step.showPre = true;
                vm.step.showNext = false;
                vm.step.showSubmit = true;
              }
            });
            vm[funName](index);
          }
        },
        //提交
        handleSubmit (index) {
          let vm = this;
          let isPass = vm.validateForm(index);
          if (isPass) {

          }
        }
        // //初始化表格
        // initTable: function () {
        //   let vm = this;
        //   vm.tableData.loading = true;
        //   vm.api[vm.apis.listApi](vm.initData).then((data) => {
        //     vm.tableData.tableList = data.records;
        //     vm.pageData.total = data.total;
        //     vm.tableData.loading = false;
        //   }).catch((error) => {
        //
        //   })
        // },
        // //新增
        // add: function () {
        //   let vm = this;
        //   if (vm.modalData.formObj[vm.modalData.idObj]) {
        //     delete vm.modalData.formObj[vm.modalData.idObj];
        //   }
        //   vm.modalData.title = vm.modalData.titles.addTitle;
        //   vm.modalData.apiUrl = vm.apis.addApi;
        //   vm.modalWidgets = vm.modalData;
        //   vm.modalOpreation = true;
        // },
        // //查看
        // view: function (id) {
        //   let vm = this;
        //   let ID = {
        //     ID: id
        //   };
        //   vm.$Loading.start();
        //   vm.api[vm.apis.detailApi](ID).then((data) => {
        //     for (let obj in vm.modalData.formObj) {
        //       vm.modalData.formObj[obj] = data[obj];
        //     }
        //     vm.modalData.formObj[vm.modalData.idObj] = id;
        //     vm.modalData.title = vm.modalData.titles.viewTitle;
        //     for (let i = 0, len = vm.modalData.widgets.length; i < len; i++) {
        //       vm.modalData.widgets[i].disabled = true;
        //     }
        //     vm.modalWidgets = vm.modalData;
        //     vm.$Loading.finish();
        //     vm.modalOpreation = true;
        //   }).catch((error) => {
        //     vm.$Loading.error();
        //   })
        // },
        // //修改
        // edit: function (id) {
        //   let vm = this;
        //   let ID = {
        //     ID: id
        //   };
        //   vm.$Loading.start();
        //   vm.api[vm.apis.detailApi](ID).then((data) => {
        //     for (let obj in vm.modalData.formObj) {
        //       vm.modalData.formObj[obj] = data[obj];
        //     }
        //     vm.modalData.formObj[vm.modalData.idObj] = id;
        //     vm.modalData.title = vm.modalData.titles.editTitle;
        //     vm.modalData.apiUrl = vm.apis.editApi;
        //     vm.modalWidgets = vm.modalData;
        //     vm.$Loading.finish();
        //     vm.modalOpreation = true;
        //   }).catch((error) => {
        //     vm.$Loading.error();
        //   })
        // },
        // //删除
        // deleteItem: function (id) {
        //   let vm = this;
        //   let params = {};
        //   params[vm.modalData.idObj] = id;
        //   vm.api[vm.apis.deleteApi](params).then((data) => {
        //     vm.$Loading.finish();
        //     vm.initTable();
        //   }).catch((error) => {
        //     vm.$Loading.error();
        //   })
        // },
        // //是否显示模态框
        // changeModal (status) {
        //   let vm = this;
        //   vm.modalOpreation = status;
        // }
      }
    }
</script>

<style lang="less" scoped>
  .step{
    margin: 30px;
    .step-steps{
      border-bottom: 1px solid #eeeeee;
      margin-bottom: 30px;
      padding: 0 0 20px 0;
    }
    .formValidate{
      border-bottom: 1px solid #eeeeee;
      margin-bottom: 30px;
    }
    .step-btns{
      float: right;
    }
    .step-add{
      margin-bottom: 30px;
    }
    .deleteActivity{
      float: right;
      margin-right: 20px;
      font-size: 18px;
      &:hover{
        color: #2E84EB;
      }
    }
  }
</style>
