/**
* 作者 ：yhzzy
*
* 日期 ：2018/06/28
*
* 描述 ：问题反馈
*/
<template>
    <div class="cl">
        <ContentTitle :options="title"></ContentTitle>
        <FilterForm :options="filterData"></FilterForm>
        <opreationWidgets :options="opreationData"></opreationWidgets>
        <Table class="tableList" :loading="tableData.loading" ref="selection" :columns="tableData.columns" :data="tableData.tableList"></Table>
        <Pager :options="pageData.total"></Pager>
        <ModalConTent :options="modalOpreation" :widgets="modalWidgets" @modalStatus="changeModal"></ModalConTent>
    </div>
</template>

<script type="text/ecmascript-6">
    import ContentTitle from '../../components/contentTitle/contentTitle.vue'
    import FilterForm from '../../components/filterForm/filterForm.vue'
    import opreationWidgets from '../../components/opreationWidgets/opreationWidgets.vue'
    import Pager from '../../components/pager/pager.vue'
    import ModalConTent from '../../components/modal/modal.vue'
    import Data from '../../config/feedback/feedback'

    export default{
        name: 'xaFeedback',
        components: {
            ContentTitle,
            FilterForm,
            opreationWidgets,
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
                    vm.tableData.tableList = data.records;
                    vm.pageData.total = data.total;
                    vm.tableData.loading = false;
                }).catch((error) => {

                })
            },
            //查看
            view: function (id) {
                let vm = this;
                let ID = {
                    ID: id
                };
                vm.$Loading.start();
                vm.api[vm.apis.detailApi](ID).then((data) => {
                    for (let obj in vm.modalData.formObj) {
                        vm.modalData.formObj[obj] = data[obj];
                    }
                    vm.modalData.formObj[vm.modalData.idObj] = id;
                    vm.modalData.title = vm.modalData.titles.viewTitle;
                    for (let i = 0, len = vm.modalData.widgets.length; i < len; i++) {
                        vm.modalData.widgets[i].disabled = true;
                    }
                    vm.modalWidgets = vm.modalData;
                    vm.$Loading.finish();
                    vm.modalOpreation = true;
                }).catch((error) => {
                    vm.$Loading.error();
                })
            },
            //删除
            deleteItem: function (id) {
                let vm = this;
                let params = {};
                params[vm.modalData.idObj] = id;
                vm.api[vm.apis.deleteApi](params).then((data) => {
                    vm.$Loading.finish();
                    vm.initTable();
                }).catch((error) => {
                    vm.$Loading.error();
                })
            },
            //是否显示模态框
            changeModal (status) {
                let vm = this;
                vm.modalOpreation = status;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
