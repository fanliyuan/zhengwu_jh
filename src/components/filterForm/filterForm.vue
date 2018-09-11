/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/19
*
* 描述 ：条件筛选组件
*/
<template>
  <Form class="formInline" ref="formInline" :model="formInline" inline>
    <FormItem class="formInline-item" :prop="item.prop" :key="item.prop" v-for="item in options.data">
      <Input class="formItem-widget" size="large" :type="item.word" v-model="formInline[item.prop]" @keyup.native.13="handleSubmit('formInline')" :placeholder="item.placeholder" v-if="item.type === 'input'">
      <span class="formItem-name" slot="prepend">{{item.name}}</span>
      </Input>
    </FormItem>
    <FormItem class="formInline-item">
      <Button type="primary" size="large" icon="search" @click="handleSubmit('formInline')">搜索</Button>
    </FormItem>
  </Form>
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
