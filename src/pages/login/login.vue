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
      <h2 class="login-form-title">雄安市民服务中心App运营管理平台</h2>
      <Form ref="formLogin" :model="formLogin" :rules="ruleLogin">
        <FormItem prop="user" class="login-form-item">
          <Input type="text" class="login-form-input" v-model="formLogin.user" placeholder="请输入用户名">
          <Icon type="android-person" class="login-form-icon" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password" class="login-form-item">
          <Input type="password" class="login-form-input" v-model="formLogin.password" placeholder="请输入密码">
          <Icon type="android-lock" slot="prepend"></Icon>
          </Input>
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
          user: '',
          password: ''
        },
        ruleLogin: {
          user: [
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
        tips: '登录时连续输入密码错误超过五次，该用户将被系统锁定。'
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('校验中!');
            this.$router.push({'path': '/nodeOverview'});
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
    background: url("/static/images/login_bg.jpg");
    height: 100%;
    background-size: cover;
    .login-form{
      position: absolute;
      top: 180px;
      right: 200px;
      width: 420px;
      background: #ffffff;
      padding-top: 40px;
      border-radius: 10px;
      box-shadow: 0px -6px 35px 0px rgba(23, 45, 124, 0.3);
      .login-form-title{
        font-size: 24px;
        font-weight: bold;
        border-bottom: none;
        margin-bottom: 30px;
      }
      .login-form-item{
        height: 45px;
        margin-bottom: 15px;
        border-bottom: 1px solid #e5e5e5;
        .login-form-input{
          input{
            width: 275px;
            height: 38px;
            border: none;
            background: none;
            outline: none;
            color: #444;
            letter-spacing: 2px;
            font-size: 18px;
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
          left: inherit;
          right: 0;
          top: 10px;
        }
      }
      .login-form-btn{
        margin-top: 35px;
        .login-form-submit{
          height: 50px;
          font-size: 22px;
          border: none;
          outline: none;
          border-radius: 8px;
          box-shadow: 0 1px 10px #8a94b8;
        }
        .login-form-tips{
          color: #676a6c;
        }
      }
    }
  }
</style>
