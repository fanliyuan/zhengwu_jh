/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：操作按钮组件
*/
<template>
  <div class="opWidgets">
    <Button class="opWidgets-btn" v-for="(item, index) in options" :key="item.title" size="large" :type="item.color" :icon="item.icon" @click="handleOpreation(item.type, index)">{{item.name}}</Button>
  </div>
</template>

<script>
  export default{
    name: 'ConOpreation',
    props: ['options'],
    data () {
      return {}
    },
    methods: {
      handleOpreation (name, index) {
        let vm = this;
        vm.$parent[name]();
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
