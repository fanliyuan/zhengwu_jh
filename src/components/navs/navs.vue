/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：导航菜单
*/
<template>
  <div>
    <div class="layout-logo">
      <img src="/static/images/logo.74bab573.png" alt="">
      {{options.title}}
    </div>
    <Menu :active-name="setActiveUrl.childName" :open-names="setActiveUrl.parentName" ref="mainMenu" theme="dark" width="auto" :class="menuitemClasses" @on-select="changeUrl" accordion>
      <Submenu class="menu-item-li" v-for="option in options.data" :key="option.navId" :name="option.navId" v-if="option.isParent && option.show">
        <template slot="title">
          <Icon :type="option.icon"></Icon>
          {{option.label}}
        </template>
        <MenuItem class="menu-item-submenu" v-for="item in option.children" :key="item.navId" :name="item.frontUrl">
          {{item.label}}
        </MenuItem>
      </Submenu>
      <MenuItem class="menu-item-noSubmenu" v-for="option in options.data" :key="option.navId" :name="option.frontUrl" v-if="!option.isParent && option.show">
        <Icon :type="option.icon"></Icon>
        <span>{{option.label}}</span>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
  export default{
    name: 'NavsBar',
    props: ['options'],
    data () {
      return {

      }
    },
    computed: {
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      },
      setActiveUrl () {
        let vm = this;
        let navArr = vm.$props.options.data;
        return vm.$store.getters.setActiveUrl(navArr);
      }
    },
    methods: {
      changeUrl: function (name) {
        let vm = this;
        vm.$router.push({'path': name});
        vm.$store.commit('activeUrl', name);
      }
    }
  }
</script>

<style lang="less" scoped>
  .layout-logo{
    font-size: 20px;
    color: #ffffff;
    font-weight: bold;
    padding: 10px 20px;
    background: #002140;
    img{
      display: inline-block;
      vertical-align: middle;
      height: 45px;
    }
  }
  .menu-item{
    font-size: 14px;
    background: #001529;
    .menu-item-li.ivu-menu-opened{
      border-left: 4px solid #5B99E6;
      .menu-item-submenu{
        padding: 7px 24px 7px 55px!important;
      }
    }
    .menu-item-noSubmenu{
      span{
        font-size: 16px;
      }
      &.ivu-menu-item-selected{
        color: #ffffff;
        background: #2B323A!important;
        border-left: 4px solid #5B99E6;
        border-right: none;
       }
    }
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 18px;
  }
  .collapsed-menu span{
    width: 0;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
