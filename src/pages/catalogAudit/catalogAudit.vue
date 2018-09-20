/**
* 作者 ：yhzzy
*
* 日期 ：2018/09/19
*
* 描述 ：目录审核
*/
<template>
  <div class="cl">
    <ContentTitle :options="title"></ContentTitle>
    <div class="main-content cl">
      <FilterForm :options="filterData"></FilterForm>
      <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
      <Pager :options="pageData.total"></Pager>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ContentTitle from '../../components/contentTitle/contentTitle.vue'
  import FilterForm from '../../components/filterForm/filterForm.vue'
  import Pager from '../../components/pager/pager.vue'
  import ModalConTent from '../../components/modal/modal.vue'
  import Data from '../../config/catalogAudit/catalogAudit'

  export default{
    name: 'sourceAudit',
    components: {
      ContentTitle,
      FilterForm,
      Pager,
      ModalConTent
    },
    data () {
      let vm = this;
      return Data(vm).setData()
    },
    created: function () {
      this.initTable();
    },
    methods:{
      //初始化表格
      initTable: function () {
        let vm = this;
        vm.tableData.loading = true;
        vm.api[vm.apis.listApi](vm.initData).then((data) => {
          vm.tableData.tableList = data.datas;
          vm.pageData.total = data.totalCounts;
          vm.tableData.loading = false;
        }).catch((error) => {

        })
      },
      //查看
      view: function (id) {
        let vm = this;
        vm.$router.push({'path': '/catalog/itemInfo/' + id});
      },
      //修改
      edit: function (id, type) {
        let vm = this;
        let defaultVal = 1;
        let reason = '';
        let loading = false;
        vm.$Modal.confirm({
          title: '审核',
          loading: loading,
          render: (h) => {
            return [h('RadioGroup',{
                      props:{
                        value: defaultVal
                      },
                      on:{
                        'on-change': (val) => {
                          defaultVal = val;
                          if (defaultVal === 0) {
                            document.getElementById('pass').style.display = 'none';
                            document.getElementById('rejectReason').style.display = 'block';
                          } else {
                            document.getElementById('pass').style.display = 'block';
                            document.getElementById('rejectReason').style.display = 'none';
                          }
                        }
                      }
                    },[
                      h('Radio',{
                        props:{
                          label: 1
                        }
                      }, '通过'),
                      h('Radio',{
                        props:{
                          label: 0
                        }
                      }, '拒绝')
                    ]
            ), h('Input', {
              props:{
                type: 'textarea',
                placeholder: '请输入拒绝理由',
                autosize: {
                  minRows: 2, maxRows: 5
                },
                value: reason
              },
              attrs: {
                id: 'rejectReason'
              },
              style: {
                marginTop: '10px',
                display: 'none'
              },
              on:{
                'on-blur': (event) => {
                  reason = event.target.value;
                }
              }
            }), h('p', {
              domProps: {
                innerHTML: '您是否确定通过此次审核？'
              },
              attrs: {
                id: 'pass'
              },
              style: {
                fontSize: '16px',
                marginTop: '10px'
              }
            })];
          },
          onOk: () => {
            let ID = {
              id: id
            };
            let params = {
              reason: reason,
              status: defaultVal
            };
            if (defaultVal === 2 && reason === '') {
              vm.$Message.info('请填写拒绝原因');
              loading = true;
              vm.$nextTick(() => {
                loading = false;
              });
              return false;
            } else if (defaultVal === 1) {
              params.reason = '';
            }
            vm.$Loading.start();
            vm.api[vm.apis.editApi](ID, params).then((data) => {
              if (data.data === 'SUCCESS') {
                vm.$Message.info('审核成功！');
                vm.initTable();
                vm.$Loading.finish();
              } else {
                vm.$Message.info('审核失败！');
              }
            }).catch((error) => {

            })
          }
        })
      },
      //审核日志
      log: function (id, type) {
        let vm = this;
        let ID = {
          id: id
        };
        vm.$Loading.start();
        vm.api[vm.apis.logApi](ID).then((data) => {
          let content = `<ul class="reviewList">`;
          for (let i = 0, len = data.datas.length; i < len; i++ ) {
            content += `<li style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px">
            <p>申请人：${data.datas[i].applyUsername}</p>
            <p>申请时间：${data.datas[i].applyTime}</p>
            <p>审核人：${data.datas[i].reviewUsername}</p>
            <p>审核时间：${data.datas[i].reviewTime}</p>`;
            if (data.datas[i].status === 1) {
              content += `<p>审核结果：通过</p>`;
            } else {
              content += `<p>审核结果：拒绝</p><p>拒绝理由：${data.datas[i].reason}</p>`
            }
            content += `</li>`;
          }
          content += `</ul>`;
          vm.$Modal.info({
            title: '摘要信息',
            content: content
          });
          vm.$Loading.finish();
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .infoList{
  li{
    float: left;
    font-size: 16px;
    margin-right: 20px;
  }
  }
  .btn-group{
    text-align: right;
  }
</style>
