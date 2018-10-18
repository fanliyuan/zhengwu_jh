/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/13
*
* 描述 ：查看资源信息项
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <div class="content">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <FormItem label="导出格式" prop="oldPwd">
            <Select v-model="formValidate.oldPwd">
              <Option v-for="item in exportFormat" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="导出文件名" prop="newPwd">
            <Input v-model="formValidate.newPwd" placeholder="请输入文件名" type="text"></Input>
          </FormItem>
          <FormItem label="导出编码格式" prop="checkPwd">
            <Select v-model="formValidate.checkPwd">
              <Option v-for="item in exportEncodeFormat" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">开始导出</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
          </FormItem>
        </Form>
      </div>


    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../../components/filterForm/filterForm.vue'
  import Pager from '../../../components/pager/pager.vue'
  import Data from '../../../config/resourceChangeManage/export'

  export default{
    name: 'changePassword',
    components: {
      ContentTitle,
    },
    data () {
      let vm = this;
      return Data(vm).setData()
    },
    created: function () {
      //  this.initTable();
      // this.view();
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


      //提交
      handleSubmit: function (name) {
        let vm = this;
        vm.$refs[name].validate((valid) => {
          if (valid) {
            // vm.$Message.success('密码验证通过');
            if (vm.formValidate.checkPwd) {
              delete vm.formValidate.checkPwd;
            }
            let id = vm.$route.params.id;
            let ID = {
              resourceId: id
            };
            vm.api[vm.apis.downLoadFileApi](ID).then((data) => {
              //vm.$Message.success("密码修改成功");
              vm.$refs.formValidate.resetFields();
              vm.deepCopy(vm.oldFormValidate, vm.formValidate);

            }).catch((error) => {
             // vm.$Message.success("导出失败");
              vm.$Loading.error();
              //  vm.loading = false;

            });
          } else {
            vm.$Message.error('验证失败');
            vm.loading = false;

          }
        });
      },

      //取消
      handleReset: function (name) {
        let vm = this;
        vm.modalOpreation = false;
        vm.$refs.formValidate.resetFields();
        history.back(-1);
        //  vm.modalData.current = 0;
      }

    }
  }
</script>

<style lang="less" scoped>

  .main-content{
    .content{
      margin: 0 auto;
      width:50%;
      text-align: center;
    }
    .login-form-tips{
      color: #ed4014;
      float: left;
    }
    .infoList{
      li{
        float: left;
        width: 25%;
        margin-bottom: 15px;
        &:last-child{
          display: block;
          width: 100%;
          margin-bottom: 0;
        }
      }
    }
  }
</style>
