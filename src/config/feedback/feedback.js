/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/26
 *
 * 描述 ：问题反馈配置数据
 */

class feedbackOptions {
    constructor(data) {
        this.data = data;
    }

    setVm () {
        return this.data;
    }

    setData () {
        let vm = this.setVm();
        return {
            title: '问题反馈管理',
            apis: {
                addApi: 'feedbackAdd',
                deleteApi: 'feedbackDelete',
                detailApi: 'feedbackDetail',
                listApi: 'feedbackList',
                editApi: ''
            },
            modalOpreation: false,
            modalWidgets: {},
            modalData: {
                title: {},
                apiUrl: '',
                width: 900,
                formObj: {
                    xaobFeedbackType: '',
                    xaobFeedbackBy: '',
                    xaobFeedbackUid: '',
                    xaobFeedbackCreateTime: '',
                    xaobFeedbackContent: '',
                    xaobFeedbackImg: ''
                },
                oldFormObj: {
                    xaobFeedbackType: '',
                    xaobFeedbackBy: '',
                    xaobFeedbackUid: '',
                    xaobFeedbackCreateTime: '',
                    xaobFeedbackContent: '',
                    xaobFeedbackImg: ''
                },
                ueObj: '',
                idObj: 'xaobFeedbackId',
                ruleObj: {},
                widgets: [
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobFeedbackType',
                        name: '反馈类型',
                        placeholder: '请输入反馈类型'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobFeedbackBy',
                        name: '反馈人',
                        placeholder: '请输入反馈人'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobFeedbackUid',
                        name: '雄安ID',
                        placeholder: '请输入雄安ID'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobFeedbackCreateTime',
                        name: '反馈时间',
                        placeholder: '请输入反馈时间'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'textarea',
                        prop: 'xaobFeedbackContent',
                        name: '反馈内容',
                        placeholder: '请输入反馈内容'
                    },
                    {
                        type: 'upload',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobFeedbackImg',
                        name: '反馈图片',
                        placeholder: '',
                        placeholderA: '',
                        accept: ['jpg', 'jpeg' ,'png'],
                        rules: {
                            maxNum: 1,
                            fileErrorTips: {
                                title: '文件类型上传错误',
                                desc: '请上传 ".jpg", ".jpeg", ".png" 格式的图片。'
                            },
                            fileMaxTips: {
                                title: '文件数量限制',
                                desc: '最多只能上传一张图片。'
                            }
                        }
                    }
                ],
                titles: {
                    viewTitle: {
                        name: '查看问题反馈详情',
                        showOkBtn: false
                    },
                    addTitle: {
                        name: '添加问题反馈',
                        showOkBtn: true
                    },
                    editTitle: {
                        name: '编辑问题反馈',
                        showOkBtn: true
                    }
                }
            },
            initData: {
                title: '',
                order: 'desc',
                offset: 0,
                limit: 10
            },
            tableData: {
                loading: true,
                tableList: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '反馈类型',
                        key: 'xaobFeedbackType'
                    },
                    {
                        title: '反馈内容',
                        key: 'xaobFeedbackContent',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        width: '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    },
                                    domProps: {
                                        xaobFeedbackContent: params.row.xaobFeedbackContent
                                    }
                                }, params.row.xaobFeedbackContent)
                            ])
                        }
                    },
                    {
                        title: '反馈人',
                        key: 'xaobFeedbackBy'
                    },
                    {
                        title: '雄安ID',
                        key: 'xaobFeedbackUid'
                    },
                    {
                        title: '反馈时间',
                        key: 'xaobFeedbackCreateTime'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
                            let children = [];
                            let view = {
                                props: {
                                    type: 'success'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        vm.view(params.row.id);
                                    }
                                }
                            };
                            let del = {
                                props: {
                                    type: 'error'
                                },
                                on: {
                                    click: () => {
                                        vm.$Modal.confirm({
                                            title: '信息',
                                            content: '是否删除选择的信息？',
                                            onOk: function () {
                                                vm.deleteItem(params.row.id);
                                            }
                                        });
                                    }
                                }
                            };
                            children.push(h('Button', view, '查看'));
                            children.push(h('Button', del, '删除'));
                            return h('div', children);
                        }
                    }
                ]
            },
            pageData: {
                total: 0
            },
            filterData: {
                filiterObj: {
                    condition: ''
                },
                data: [
                    {
                        type: 'input',
                        word: 'text',
                        prop: 'condition',
                        name: '反馈内容',
                        placeholder: '请输入反馈内容'
                    }
                ]
            },
            opreationData: []
        }
    }
}

export default (data) => {
    return new feedbackOptions(data);
}