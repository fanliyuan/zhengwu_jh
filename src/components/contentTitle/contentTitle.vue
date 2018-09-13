/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：内容名称组件
*/
<template>
  <div class="cl titleDiv">
    <h3 class="container-title">{{options}}</h3>
    <Button class="back-btn" v-if="backbtn" @click="back()">{{backbtn.name}}</Button>
  </div>
</template>

<script>
  export default{
    name: 'ConTitle',
    props: ['options', 'backbtn'],
    data () {
      return {}
    },
    methods: {
      back () {
        history.back(-1);
      }
    }
  }
</script>

<style lang="less" scoped>
  .titleDiv{
    background-color: #ffffff;
    border-bottom: 1px solid #e7eaec;
    padding: 15px 20px;
  }
  .container-title{
    float: left;
    font-size: 14px;
    font-weight: normal;
    line-height: 30px;
    &:before{
       content: '';
       display: inline-block;
       height: 19px;
       vertical-align: middle;
       margin-right: 4px;
       border-left: 4px solid #2d81bb;
     }
  }
  .back-btn{
    float: right;
  }
</style>
