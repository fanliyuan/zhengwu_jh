/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：公共弹窗组件
*/
<template>
  <Modal :width="widgets.width" v-model="status" :title="title" :closable="false" :mask-closable="false" :loading="loading" @on-ok="ok('formValidate')" @on-cancel="cancel('formValidate')">
    <Form class="formValidate" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" :show-message="showError">
      <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="item in formWidgets" v-show="item.show">
        <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum">
        </Input>
        <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" number v-if="item.type === 'input' && item.isNum === true">
        </Input>
        <Input class="formValidate-widget" size="large" :rows="item.rows" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'textarea'">
        </Input>
        <Input class="formValidate-widget" @on-change="oneOfFormValidate" @on-blur="oneOfFormValidate" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'inputValidateOther'">
        </Input>
        <InputNumber style="width:300px" size="large" v-model="formValidate[item.prop]" :max="item.max" :min="item.min" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'inputNumber'"></InputNumber>
        <Select @on-open-change="oneOfFormValidate" @on-change="changeOption" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select'" style="width:300px">
          <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
        </Select>
        <Select @on-open-change="oneOfFormValidate" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'selectValidateOther'" style="width:300px">
          <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
        </Select>
        <Cascader :data="item.options" :placeholder="item.placeholder" v-model="formValidate[item.prop]" @on-change="changeCascader" v-if="item.type === 'selectCascader'"></Cascader>
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
        <RadioGroup v-model="formValidate[item.prop]" @on-change="changeRadio" v-if="item.type === 'radioGroup'">
          <Radio :label="option.key" :key="option.value" v-for="option in item.options"></Radio>
        </RadioGroup>
      </FormItem>
    </Form>
    <Alert show-icon v-if="widgets.tips && widgets.tips.length > 0">
      <p :key="indexTip" v-for="(tip, indexTip) in widgets.tips">
        {{tip}}
      </p>
    </Alert>
    <div slot="footer" v-if="!showOkBtn">
      <Button type="error" size="large" icon="reply" @click="cancel('formValidate')">取消</Button>
    </div>
  </Modal>
</template>

<script>
  import UEditor from '../../components/ueditor/UEditor.vue'

  export default{
    name: 'ConModal',
    props: ['options', 'widgets'],
    components: {
      UEditor
    },
    data () {
      return {
        title: '',
        showOkBtn: true,
        selfName: 'ConModal',
        loading: true,
        showError: true,
        uploadNames: {},
        formValidate: {},
        ruleValidate: this.$props.widgets.ruleObj,
        formWidgets: this.$props.widgets.widgets,
        ueName: '',
        imgName: '',
        uploadErrorTips: {}
      }
    },
    computed:{
      status: {
        get: function () {
          let vm = this;
          return vm.options;
        },
        set: function () {
          let vm = this;
          return vm.options;
        },
        widgets () {
          let vm = this;
          return vm.$props.widgets;
        }
      }
    },
    mounted () {
      let vm = this;
      vm.formValidate = vm.$props.widgets.formObj;
    },
    watch: {
      widgets: {
        handler(newValue, oldValue) {
          let vm = this;
          vm.title = newValue.title.name;
          vm.showOkBtn = newValue.title.showOkBtn;
          vm.oldFormValidate = newValue.oldFormObj;
          vm.formValidate = newValue.formObj;
          vm.ruleValidate = newValue.ruleObj;
          vm.formWidgets = newValue.widgets;
          vm.ueName = newValue.ueObj;
          if (newValue.oneOfFormArr) {
            vm.oneOfFormArr = newValue.oneOfFormArr;
          }
          if (newValue.hideToken) {
            vm.hideToken = newValue.hideToken;
          }
        },
        deep: true
      }
    },
    methods: {
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
      oneOfFormValidate (event) {
        let vm = this;
        if (vm.oneOfFormArr) {
          for (let i = 0, len = vm.oneOfFormArr.length; i < len; i++) {
            vm.$refs.formValidate.validateField(vm.oneOfFormArr[i]);
          }
        }
      },
      changeRadio (value) {
        let vm = this;
        console.log(value);
        console.log(vm.$props.widgets)
        console.log(vm.formValidate)
        let roleList = vm.$props.widgets.options;
        for (let i = 0, len = roleList.length; i < len; i++) {
          if (roleList[i].key === value) {
//            vm.formValidate.
          }
        }
      },
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
      changeCascader (value, selectedData) {
        let vm = this;
        if (vm.formValidate.buildings) {
          vm.formValidate.buildingId = selectedData[0].value;
          vm.formValidate.buildingName = selectedData[0].label;
          vm.formValidate.floorId = selectedData[1].value;
          vm.formValidate.floorName = selectedData[1].label;
        }
      },
      validateForm (name) {
        let vm = this;
        vm.$refs[name].validate((valid) => {
          if (valid) {
            vm.$Message.success('验证通过, 提交中！');
            if (vm.formValidate.targetPersons) {
              delete vm.formValidate.targetPersons;
            }
            if (vm.formValidate.buildings) {
              delete vm.formValidate.buildings;
            }
            vm.api[vm.$props.widgets.apiUrl](vm.formValidate).then((data) => {
              vm.$parent.initTable();
            vm.$emit('modalStatus', false);
            vm.$refs.formValidate.resetFields();
            vm.deepCopy(vm.oldFormValidate, vm.formValidate);
            for (let i in vm.uploadNames) {
              if (i) {
                vm[i + 'UploadList'].splice(0, vm[i + 'UploadList'].length);
              }
            }
          }).catch((error) => {
              vm.$Loading.error();
            vm.loading = false;
            vm.$nextTick(() => {
              vm.loading = true;
          });
          });
          } else {
            vm.$Message.error('验证失败');
        vm.loading = false;
        vm.$nextTick(() => {
          vm.loading = true;
      });
      }
      });
      },
      ok (name) {
        let vm = this;
        if (vm.$refs['ueditorVal']) {
          vm.formValidate[vm.ueName] = vm.$refs['ueditorVal'][0].editorVal;
        }
        vm.validateForm(name);
      },
      cancel () {
        let vm = this;
        if (vm.$refs['ueditorVal']) {
          vm.formValidate[vm.ueName] = vm.$refs['ueditorVal'][0].editorVal;
        }
        vm.$nextTick(() => {
          vm.$refs.formValidate.resetFields();
        vm.deepCopy(vm.oldFormValidate, vm.formValidate);
      });
        for (let i in vm.uploadNames) {
          if (i) {
            vm[i + 'UploadList'].splice(0, vm[i + 'UploadList'].length);
          }
        }
        for (let k = 0, len = vm.formWidgets.length; k < len; k++) {
          vm.formWidgets[k].disabled = false;
        }
        vm.$emit('modalStatus', false);
      },
      getRefName (name) {
        let vm = this;
        vm.imgName = name;
        vm.uploadNames[name] = name;
        vm.uploadRules = vm.$refs[vm.imgName][0].$attrs.rules;
        vm[vm.imgName + 'UploadList'] = vm.$refs[vm.imgName][0].fileList;
      },
      handleBeforeUpload () {
        let vm = this;
        vm.uploadErrorTips = vm.uploadRules.fileErrorTips;
        const check = vm[vm.imgName + 'UploadList'].length < vm.uploadRules.maxNum;
        if (!check) {
          vm.$Notice.warning(vm.uploadRules.fileMaxTips);
        }
        return check;
      },
      handleProgress () {
        let vm = this;
        vm.$Spin.show({
                  render: (h) => {
                  return h('div', [
                    h('Icon', {
                      'class': 'demo-spin-icon-load',
                      props: {
                        type: 'load-c',
                        size: 18
                      }
                    }),
                    h('div', '上传中...')
                  ])
                }
      });
      },
      handleFormatError (file) {
        let vm = this;
        vm.$Notice.warning(vm.uploadErrorTips);
      },
      handleSuccess (response, file, fileList) {
        let vm = this;
        vm.$Spin.hide();
        vm.formValidate[vm.imgName] = response;
        vm.$refs.formValidate.validateField(vm.imgName);
      },
      handlePreview (file) {
      },
      handleError (error, file, fileList) {
        let vm = this;
        vm.$Spin.hide();
        vm.$Message.error('上传时出错！');
      },
      handleRemove (name) {
        let vm = this;
        vm.formValidate[name] = '';
        vm.$refs[name][0].clearFiles();
        if (vm.ruleValidate[name]) {
          vm.$refs.formValidate.validateField(name);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .uploadListBtn{
    display: inline-block;
    margin-right: 5px;
  }
  .uploadListImg{
    width: 150px;
    height: 100px;
    margin-top: 10px;
    overflow: hidden;
  img{
    width: 100%;
  }
  }
</style>
