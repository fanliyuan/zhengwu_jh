<template>
  <Content id="app">
    <router-view/>
  </Content>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import "./assets/less/common.less";
  #app{
    height: 100%;
  }
  .ivu-layout-sider-trigger{
    display: none;
  }
  .tableList{
    margin: 0 20px 20px 20px;
    th{
      font-size: 16px;
    }
    td{
      font-size: 14px;
      padding: 5px 0;
    }
  }
  .tablePager{
    margin: 0 20px 20px 20px;
    float: right;
  }
  .main-content{
    margin: 20px;
    background-color: #ffffff;
    padding: 15px 10px;
  }
</style>
