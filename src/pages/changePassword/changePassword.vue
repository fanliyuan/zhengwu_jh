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
          <FormItem label="旧密码" prop="oldPwd">
            <Input v-model="formValidate.oldPwd" placeholder="请输入旧密码" type="password"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPwd">
            <Input v-model="formValidate.newPwd" placeholder="请输入新密码" type="password"></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="checkPwd">
            <Input v-model="formValidate.checkPwd" type="password" placeholder="请再次输入新密码" @on-change="changeVal()"></Input>
            <small class="login-form-tips" v-if="showErrorPwd">{{tips}}</small>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </div>


    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import Pager from '../../components/pager/pager.vue'
  import Data from '../../config/changePassword/changePassword'

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
      //新密码确认
      changeVal: function () {
        let vm = this;
        if (vm.formValidate.newPwd != vm.formValidate.checkPwd) {
          vm.tips = "两次密码输入不一致";
          vm.showErrorPwd = true;
        } else {
          vm.tips = "";
          vm.showErrorPwd = false;
        }
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
            vm.api[vm.apis.changePwdApi](vm.formValidate).then((data) => {
              if (data === "") {
                vm.$Message.success("密码修改成功");
                history.back(-1);
              } else {
                vm.$Message.success("密码修改失败");
              }
              //vm.$Message.success("密码修改成功");
              vm.$refs.formValidate.resetFields();
              vm.deepCopy(vm.oldFormValidate, vm.formValidate);

            }).catch((error) => {
              vm.$Message.success("密码修改失败");
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
