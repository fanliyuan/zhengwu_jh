/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：分页组件
*/
<template>
  <Page class-name="tablePager" :total="options" show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize"></Page>
</template>

<script>
  export default{
    name: 'ConPager',
    props: ['options'],
    data () {
      return {}
    },
    methods: {
      //翻页
      changePage: function (page) {
        let vm = this;
        vm.$parent.initData.pageNum = page;
        vm.$parent.initTable();
      },
      //改变每页显示数量
      changePageSize: function (pageSize) {
        let vm = this;
        vm.$parent.initData.pageSize = pageSize;
        vm.$parent.initTable();
      }
    }
  }
</script>

<style lang="less" scoped>
  .opWidgets{
    margin: 15px 0;
    padding: 0 20px;
  .opWidgets-btn{
    margin-bottom: 10px;
    margin-right: 10px;
  &:last-child{
     margin-right: 0;
   }
  }
  }
</style>
