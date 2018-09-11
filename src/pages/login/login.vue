/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：登录页面
*/
<template>
  <Content id="login">
    <Card shadow class="login-form">
     <Tooltip placement="top">
        <Button class="login-help">?</Button>
        <!--<Icon type="ios-help-circle-outline" class="login-help"/>-->
      <!--  <Icon type="ios-help-circle-outline" class="login-help" v-tip.top="55666"/>-->
        <div slot="content">
          <p>节点管理员 : admin</p>
          <p>节点安全员 : security</p>
          <p>节点审核员 : auditor</p>
          <p>节点审计员 : assessor</p>
          <p>节点操作员 : user</p>
        </div>
      </Tooltip>

      <img src="../../../static/images/logo.png" class="login-logo">
      <h2 class="login-form-title">
      政务数据共享交换开放系统</h2>
      <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
        <FormItem prop="user" class="login-form-item">
          <Input  style="width: auto" class="login-form-input" v-model="formLogin.userName" placeholder="请输入用户名">
          <Icon type="ios-contact" slot="prefix" />
          </Input>
       <!--   <Input type="text" class="login-form-input" v-model="formLogin.user" placeholder="请输入用户名">
          <Icon type="android-person" class="login-form-icon" slot="prepend"></Icon>
          </Input>-->
        </FormItem>
        <FormItem prop="password" class="login-form-item">
          <Input placeholder="请输入密码"  type="password" style="width: auto" class="login-form-input" v-model="formLogin.password">
          <Icon type="ios-lock" slot="prefix" />
          </Input>
          <!--<Input type="password" class="login-form-input" v-model="formLogin.password" placeholder="请输入密码">
          <Icon type="android-lock" slot="prepend"></Icon>
          </Input>-->
        </FormItem>
        <FormItem class="login-form-btn">
          <Button type="primary" class="login-form-submit" @click="handleSubmit('formLogin')" long>登录</Button>
          <small class="login-form-tips">{{tips}}</small>
        </FormItem>
      </Form>
    </Card>
  </Content>
</template>

<script>
  export default{
    data () {
      return {
        formLogin: {
          userName: '',
          password: ''
        },
        ruleLogin: {
          userName: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ]
        },
        tips: 'Copyright  www.youedata.cn,All Rights Reserved'
      }
    },
    methods: {
      handleSubmit (name) {
        let vm = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('校验中!');
            vm.api.login(vm.formLogin).then((res) => {
                this.$router.push({'path': '/nodeOverview'});

            });
          //  this.$router.push({'path': '/nodeOverview'});
          } else {
            this.$Message.error('请填写完整的登录信息!');
          }
        });
      }
    }
  }
</script>

<style lang="less">
  #login {
    background: url("./img/login_bg.jpg");
    height: 100%;
    background-size: cover;
    .login-form{
      position: absolute;
      width:395px;
      height:412px;
      text-align: center;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      background: #ffffff;
      padding-top: 15px;
      border-radius: 10px;
      box-shadow: 0px -6px 35px 0px rgba(23, 45, 124, 0.3);
      .ivu-tooltip{
        position: absolute;
        left: 30px;
        top: -2px;
      }
      .login-help{
        cursor: pointer;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        position: absolute;
        padding: 0!important;
        span{
          margin-top: 0px;
          display: inline-block;
          /* margin-right: 38px; */
          font-size: 12px;
          margin-left: 1px;
          color: #999;
        }
      }
      .login-logo{
        height: 77px;
        width:76px;
        vertical-align: top;
      }
      .login-form-title{
        font-size: 24px;
        font-weight: bold;
        border-bottom: none;
        margin-bottom: 30px;
      }
      .login-form-item{
        height: 45px;
        margin-bottom: 15px;
        //border-bottom: 1px solid #e5e5e5;
        .login-form-input{
          input{
            width: 325px;
            height: 38px;
           // border: none;
            background: none;
            outline: none;
            color: #444;
            letter-spacing: 2px;
            font-size: 14px;
            &:focus{
              box-shadow: none;
             }
          }
          .ivu-input-group-prepend{
            border: none;
            background-color: transparent;
            color: #a8a8a8;
            font-size: 24px;
            font-weight: bold;
          }
        }
        .ivu-form-item-error-tip{
          left: 22px;
          /* right: 0; */
          top: 34px;
        }
      }
      .login-form-btn{
        margin-top: 35px;
        .login-form-submit{
          height: 38px;
        //  font-size: 22px;
          border: none;
          outline: none;
          border-radius: 8px;
          box-shadow: 0 1px 10px #8a94b8;
          background: #2d81bb;
          font-size: 16px;
          width:326px;
        }
        .login-form-tips{
          color: #676a6c;
        }
      }
    }
  }
</style>
