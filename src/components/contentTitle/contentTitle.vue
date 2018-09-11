/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：内容名称组件
*/
<template>
    <h3 class="container-title">{{options}}</h3>
</template>

<script>
  export default{
    name: 'ConTitle',
    props: ['options'],
    data () {
      return {}
    }
  }
</script>

<style lang="less" scoped>
  .container-title{
    font-size: 14px;
    font-weight: normal;
    border-bottom: 1px solid #e7eaec;
    padding: 15px 20px;
    background-color: #ffffff;
    &:before{
       content: '';
       display: inline-block;
       height: 19px;
       vertical-align: top;
       margin-right: 4px;
       border-left: 4px solid #2d81bb;
     }
  }
</style>
