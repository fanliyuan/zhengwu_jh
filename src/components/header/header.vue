/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：头部
*/
<template>
  <Header class="layout-header-bar cl">
    <div class="header-opreation">
      <Dropdown trigger="click" placement="bottom-start">
        <a class="user-name" href="javascript:void(0)">
          <Icon type="ios-contact"></Icon>
          <span>{{userName}}</span>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem v-for="item in dropdownMenu" :key="item.navId" class="header-drop-menu">
            <Icon :type="item.icon"></Icon>
            {{item.label}}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <a class="login-out" href="">退出</a>
    </div>
  </Header>
</template>

<script>
  export default{
    data () {
      return {
        dropdownMenu: [
          {
            navId: 9,
            show: true,
            label: '个人资料',
            icon: 'pricetags',
            isParent: false,
            frontUrl: ''
          },
          {
            navId: 10,
            show: true,
            label: '修改密码',
            icon: 'wrench',
            isParent: false,
            frontUrl: ''
          }
        ],
        userName: window.sessionStorage.getItem("userName")
      }
    }
  }
</script>

<style lang="less" scoped>
  .ivu-icon-ios-contact{
    font-size: 28px;
    margin-bottom: 2px;
  }
  .layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 20px;
    z-index: 1;
    .header-opreation{
      float: right;
      .user-name{
        font-size: 16px;
      }
      .header-drop-menu{
        font-size: 14px!important;
      }
      .login-out{
        font-size: 16px;
        margin-left: 10px;
        color: #888888;
        &:hover{
           color: #57a3f3;
         }
      }
    }
  }
</style>
