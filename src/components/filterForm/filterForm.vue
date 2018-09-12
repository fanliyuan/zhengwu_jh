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
      <Select class="formItem-widget" size="large" v-model="formInline[item.prop]" :placeholder="item.placeholder" v-if="item.type === 'select'" :disabled="item.disabled" style="width: 200px">
        <Option v-for="option in item.options" :value="option.value" :key="option.value">{{option.key}}</Option>
      </Select>
      <Cascader size="large" :data="item.options" :placeholder="item.placeholder" v-model="formInline[item.prop]" @on-change="changeCascader" v-if="item.type === 'selectCascader'"></Cascader>
      <DatePicker @on-change="nowDateRange" :editable="false" :type="item.word" placement="bottom-start" :placeholder="item.placeholder" style="width: 200px" v-if="item.type === 'dateRange'"></DatePicker>
      <Checkbox v-model="formInline[item.prop]" v-if="item.type === 'checkbox'" :disabled="item.disabled">{{option.name}}</Checkbox>
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
      handleSubmit (name) {
        let vm = this;
        for (var obj in vm[name]) {
          if (obj !== 'temporaryBuildings') {
            vm.$parent.initData[obj] = vm[name][obj];
          }
        }
        vm.$parent.initTable();
      },
      nowDateRange (value) {
        let vm = this;
        vm.formInline.beginTime = value[0];
        vm.formInline.endTime = value[1];
      },
      changeCascader (value, selectedData) {
        let vm = this;
        if (vm.formInline.temporaryBuildings) {
          if (value.length < 2) {
            vm.formInline.buildingName = '';
            vm.formInline.floorName = '';
          }else {
            vm.formInline.buildingName = selectedData[0].label;
            vm.formInline.floorName = selectedData[1].label;
          }
        }
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
