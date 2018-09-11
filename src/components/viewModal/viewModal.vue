/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/25
*
* 描述 ：查看详情组件
*/
<template>

</template>

<script>
  export default{
    name: 'ConFilter',
    props: ['options'],
    data () {
      return {
        formInline: this.$props.options.filiterObj
      }
    },
    methods: {
      handleSubmit(name) {
        let vm = this;
        for (var obj in vm[name]) {
          vm.$parent.initData[obj] = vm[name][obj];
        }
        vm.$parent.initTable();
      }
    }
  }
</script>

<style lang="less" scoped>
  .formInline{
    margin: 15px 0;
    padding: 0 20px;
  .formInline-item{
    margin-bottom: 10px;
  }
  }
</style>
