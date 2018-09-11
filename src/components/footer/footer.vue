/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：底部
*/
<template>
  <Footer class="layout-footer-bar cl">
    <div class="copyRights">
      {{copyRights.rights}}
      <a :href="copyRights.href" target="_blank">{{copyRights.company}}</a>
    </div>
  </Footer>
</template>

<script>
  export default{
    data () {
      return {
        copyRights: {
          rights: '© 2018 ',
          company: '优易数据',
          href: 'http://www.youedata.cn/'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .layout-footer-bar{
    background: #fff;
    box-shadow: 0 -1px 1px rgba(0,0,0,.1);
    padding: 15px 20px;
    .copyRights{
      float: right;
    }
  }
</style>
