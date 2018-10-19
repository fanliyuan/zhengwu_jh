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
      <FormItem class="formValidate-item" :label="item.name" :prop="item.prop" :key="item.prop" v-for="(item, index) in formWidgets" v-show="item.show">
        <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum && !item.focues">
        </Input>
        <Input class="formValidate-widget" size="large" :readonly="item.readonly" @on-blur="changeVal(item.prop)" @on-focus="changeType(item.prop)" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'input' && !item.isNum && item.focues">
        </Input>
        <a v-if="item.random" style="margin-right: 10px" @click="random(item.prop)">随机生成</a>
        <a v-if="item.copy" @click="copy(item.prop)">复制</a>
        <div class="ivu-form-item-error-tip" v-if="item.focues && showPwdError">密码不能为连续的数字</div>
        <Input class="formValidate-widget" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" number v-if="item.type === 'input' && item.isNum === true">
        </Input>
        <Input class="formValidate-widget" size="large" :rows="item.rows" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'textarea'">
        </Input>
        <Input class="formValidate-widget" @on-change="oneOfFormValidate" @on-blur="oneOfFormValidate" size="large" :element-id="item.prop" :ref="item.prop" :type="item.word" v-model="formValidate[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" autocomplete="off" v-if="item.type === 'inputValidateOther'">
        </Input>
        <InputNumber style="width:300px" size="large" v-model="formValidate[item.prop]" :max="item.max" :min="item.min" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'inputNumber'"></InputNumber>
        <Select @on-open-change="oneOfFormValidate" @on-change="changePublishRate" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select' && item.prop === 'publishRate'" style="width:300px">
          <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
        </Select>
        <Select @on-change="changeOption" v-model="formValidate[item.prop]" :element-id="item.prop" :ref="item.prop" :placeholder="item.placeholder" :disabled="item.disabled" v-if="item.type === 'select' && item.prop !== 'publishRate'" style="width:300px">
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
        <!--<UEditor ref="ueditorVal" v-if="item.type === 'ueditor'" :options="formValidate[item.prop]" :disabled="item.disabled"></UEditor>-->
        <RadioGroup v-model="formValidate[item.prop]" @on-change="changeRadio" v-if="item.type === 'radioGroup'">
          <Radio :true-value="true" :false-value="false" :label="option.value" :key="option.value" v-for="option in item.options">
            {{option.key}}
          </Radio>
        </RadioGroup>
        <Checkbox v-model="item.state"  @on-change="changeCheckbox(item.prop,item.state,$event)" v-if="item.type === 'checkboxSingle'">{{item.label}}</Checkbox>
        <CheckboxGroup v-model="formValidate[item.prop]" @on-change="changeCheckbox1" v-if="item.type === 'checkboxGroup'">
          <Checkbox :label="option.value" :key="option.value" v-for="option in item.options">
            {{option.key}}
          </Checkbox>
        </CheckboxGroup>
        <ul class="inlineInput cl" v-if="item.type === 'inputGroup'" v-model="formValidate[item.prop]">
          <li :key="option.prop" v-for="option in item.options">
            <Input class="formValidate-widget" size="large" :element-id="option.prop" :ref="option.prop" :type="option.word" v-model="formValidate[option.prop]" :placeholder="option.placeholder" :disabled="option.disabled" autocomplete="off" number v-if="option.type === 'input' && option.isNum === true">
            </Input>
            <InputNumber size="large" v-model="formValidate[option.prop]" :min="option.min" :ref="option.prop" :placeholder="option.placeholder" :disabled="option.disabled" v-if="option.type === 'inputNumber'"></InputNumber>
          </li>
        </ul>
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

<script type="text/ecmascript-6">
//  import UEditor from '../../components/ueditor/UEditor.vue'

  export default{
    name: 'ConModal',
    props: ['options', 'widgets'],
    components: {
//      UEditor
    },
    data () {
      return {
        title: '',
        showOkBtn: true,
        selfName: 'ConModal',
        loading: true,
        showError: true,
        showPwdError: false,
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
      let passW  = document
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
      changeVal (prop) {
        let vm = this;
        let re = /^[0-9]{6,24}$/g;
        let t1,t2;
        let lineFlag = false;
        let pwd = vm.formValidate[prop];
        if (re.test(vm.formValidate[prop])) {
          for (let i = 0; i < vm.formValidate[prop].length-1; i++ ) {
            t1 = pwd.charCodeAt(i);
            t2 = pwd.charCodeAt(i+1);
            if (t2 == t1 + 1 || t2 == t1 - 1) {
              lineFlag = true;
              continue;
            } else {
              lineFlag = false;
              break;
            }
          }
          if (lineFlag) {
            vm.showPwdError = true;
           // alert("不允许输入连续的数字或字母，请重新输入！");
            return;
          } else {
            vm.showPwdError = false;
          }
        }
      },
      changeType (prop) {
        let vm = this;
        let input = document.getElementById(prop);
        input.removeAttribute("readonly");

      },
      random (prop) {
        let vm = this;
        let len = 8;
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWWXYZabcdefghijklmnopqrstuvwwxyz0123456789';
        let maxPos = chars.length;
        let input = document.getElementById(prop);
        input.setAttribute("type","password");
        let pwd = '';
        for (let i = 0; i < len; i++) {
          pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        vm.formValidate[prop] = pwd;
      },
      copy (prop) {
        let vm = this;
        let input = document.getElementById(prop);
        input.setAttribute("type","text");
        input.select();
        document.execCommand("copy");
        input.setAttribute("type","password");
        vm.$Message.success('复制成功！');
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
      },
      changeCheckbox (prop,state,event) {
        let vm = this;
        if (event === true) {
          vm.formValidate[prop] = 2;
          state = true;
        } else if(event === false) {
          vm.formValidate[prop] = 1;
          state = false;
        }
      },
      changeCheckbox1 (value) {
        let vm = this;

      },
      changeOption (value) {
        let vm = this;

      },
      changePublishRate (value) {
        let vm = this;
        if (vm.formValidate.publishRate) {
          if (vm.formValidate.publishRate === '1') {
            vm.formWidgets.push({
              type: 'input',
              disabled: false,
              show: true,
              word: 'text',
              prop: 'timeSet',
              name: '定时设置',
              placeholder: '请输定时表达式'
            });
            vm.ruleValidate.timeSet.push({
              required: true,
              message: '请输入定时设置',
              trigger: 'blur'
            });
          } else {
            vm.formWidgets.splice(7, 1);
            vm.ruleValidate.timeSet.splice(0, 1);
          }
        }
      },
      changeCascader (value, selectedData) {
        let vm = this;
        if (vm.formValidate.publishMode) {
          if (value.join(',') === '1,1') {
            vm.formValidate.incrementField = vm.formWidgets[5].options[0].value;
            vm.formWidgets[5].disabled = false;
            vm.formWidgets[5].show = true;
          } else {
            vm.formWidgets[5].disabled = true;
            vm.formWidgets[5].show = false;
            vm.formValidate.incrementField = '';
          }
        }
      },
      validateForm (name) {
        let vm = this;
          vm.$refs[name].validate((valid) => {
            if (valid) {
//            vm.$Message.success('验证通过, 提交中！');
              if (vm.formValidate.targetPersons) {
                delete vm.formValidate.targetPersons;
              }
              if (vm.formValidate.buildings) {
                delete vm.formValidate.buildings;
              }
              if (vm.$props.widgets.apiUrl === 'catalogShareUpdate') {
                vm.formValidate.id = vm.$props.widgets.currentId;
                vm.formValidate.publishMode = vm.formValidate.publishMode.join(',');
              }
              vm.api[vm.$props.widgets.apiUrl](vm.formValidate).then((data) => {
                if (vm.$props.widgets.catalogId) {
                  vm.$parent.initTable(vm.$props.widgets.catalogId);
                } else {
                  vm.$parent.initTable();
                }
                if (vm.formValidate.publishRate) {
                  vm.formWidgets.splice(7, 1);
                  vm.ruleValidate.timeSet.splice(0, 1);
                }
                if (data === "") {
                  vm.$refs.formValidate.resetFields();
                  vm.deepCopy(vm.oldFormValidate, vm.formValidate);
                  vm.$emit('modalStatus', false);
                  if (vm.title.indexOf("新增") != -1) {
                    vm.$Message.success('新增成功');
                  }
                  if (vm.title.indexOf("修改") != -1) {
                    vm.$Message.success('修改成功');
                  }
                } else {
                  vm.loading = false;
                  vm.$nextTick(() => {
                    vm.loading = true;
                  });
                }

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
        if (vm.showPwdError === false) {
          vm.validateForm(name);
          vm.loading = false;
        } else if(vm.showPwdError){
          vm.$Message.error("密码验证未通过");
          vm.loading = false;
          vm.$nextTick(() => {
            vm.loading = true;
          });
        }

      },
      cancel () {
        let vm = this;
        if (vm.$refs['ueditorVal']) {
          vm.formValidate[vm.ueName] = vm.$refs['ueditorVal'][0].editorVal;
        }
        if (vm.formValidate.publishRate) {
          vm.formWidgets.splice(7, 1);
          vm.ruleValidate.timeSet.splice(0, 1);
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
  .inlineInput{
    li{
      float: left;
      width: 15%;
    }
  }
</style>
