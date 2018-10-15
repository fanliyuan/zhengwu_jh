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
    <Button class="back-btn" type="primary" v-if="saveBtn" @click="save(saveBtn.method)">{{saveBtn.name}}</Button>
    <Button class="back-btn" type="primary" v-if="surebtn" @click="sure(surebtn.method)">{{surebtn.name}}</Button>
    <Button class="back-btn" type="primary" v-if="exportBtn" @click="Export(exportBtn.method)">{{exportBtn.name}}</Button>
  </div>
</template>

<script>
  export default{
    name: 'ConTitle',
    props: ['options', 'backbtn', 'saveBtn','surebtn','exportBtn','Surebtn'],
    data () {
      return {

      }
    },
    methods: {
      back () {
        history.back();
      },
      save (method) {
        let vm = this;
        vm.$parent[method]();
        history.back();
      },
      sure (method) {
        let vm = this;
        vm.$parent[method]();
       // history.back(-1);
      },
      Export (method) {
        let vm = this;
        vm.$parent[method]();
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
    margin-left: 10px;
  }
  .back-btn1{
    float: right;
    .back{
      margin-left: 10px;
    }
  }
</style>
