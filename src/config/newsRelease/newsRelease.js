/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/26
 *
 * 描述 ：雄安发布配置数据
 */

class newsReleaseOptions {
    constructor(data) {
        this.data = data;
    }

    setVm () {
        return this.data;
    }

    setData () {
        let vm = this.setVm();
        return {
            title: '雄安资讯',
            apis: {
                addApi: 'newsAdd',
                deleteApi: 'newsDelete',
                detailApi: 'newsDetail',
                listApi: 'newsList',
                editApi: 'newsUpdate'
            },
            modalRelease: false,
            modalOpreation: false,
            modalWidgets: {},
            modalData: {
                title: {},
                apiUrl: '',
                width: 900,
                formObj:{
                    xaobNewsReleaseTitle: '',
                    xaobNewsReleaseSource: '',
                    xaobNewsReleaseImg: '',
                    xaobNewsReleaseDescribe: '',
                    xaobNewsReleaseContent: ''
                },
                oldFormObj:{
                    xaobNewsReleaseTitle: '',
                    xaobNewsReleaseSource: '',
                    xaobNewsReleaseImg: '',
                    xaobNewsReleaseDescribe: '',
                    xaobNewsReleaseContent: ''
                },
                idObj: 'xaobNewsReleaseId',
                ueObj: 'xaobNewsReleaseContent',
                ruleObj: {
                    xaobNewsReleaseTitle: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur'
                        },
                        {
                            max: 100,
                            message: '标题长度不能大于100个字符'
                        }
                    ],
                    xaobNewsReleaseImg: [
                        {
                            required: true,
                            message: '图片不能为空',
                            trigger: 'blur'
                        }
                    ],
                    xaobNewsReleaseDescribe: [
                        {
                            required: true,
                            message: '简介不能为空',
                            trigger: 'blur'
                        },
                        {
                            max: 300,
                            message: '简介长度不能大于300个字符'
                        }
                    ],
                    xaobNewsReleaseContent: [
                        {
                            required: true,
                            message: '内容不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                widgets: [
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobNewsReleaseTitle',
                        name: '标题',
                        placeholder: '请输入资讯标题'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobNewsReleaseSource',
                        name: '来源',
                        placeholder: '请输入资讯来源'
                    },
                    {
                        type: 'upload',
                        disabled: false,
                        word: 'text',
                        prop: 'xaobNewsReleaseImg',
                        name: '图片',
                        placeholder: '上传封面图片',
                        placeholderA: '删除封面图片',
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
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'textarea',
                        prop: 'xaobNewsReleaseDescribe',
                        name: '简介',
                        placeholder: '请输入简介信息'
                    },
                    {
                        type: 'ueditor',
                        disabled: false,
                        word: 'textarea',
                        prop: 'xaobNewsReleaseContent',
                        name: '内容',
                        placeholder: ''
                    }
                ],
                titles: {
                    viewTitle: {
                        name: '查看资讯详情',
                        showOkBtn: false
                    },
                    addTitle: {
                        name: '添加资讯',
                        showOkBtn: true
                    },
                    editTitle: {
                        name: '编辑资讯',
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
                selectedIds: [],
                selectedItem: [],
                loading: true,
                tableList: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'title',
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
                                        title: params.row.title
                                    }
                                }, params.row.title)
                            ])
                        }
                    },
                    {
                        title: '浏览次数',
                        key: 'browse',
                        align: 'center'
                    },
                    {
                        title: '发布人',
                        key: 'createName'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '发布时间',
                        key: 'updateTime'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    domProps: {
                                        innerHTML: function () {
                                            switch (params.row.status) {
                                                case 0:
                                                    return '<span style="color: #5b99e6">未发布</span>';
                                                case 1:
                                                    return '<span style="color: red">已发布</span>';
                                            }
                                        }()
                                    }
                                }, params.row.status)
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
                            //let vm = this;
                            let children = [];
                            let edit = {
                                props: {
                                    type: 'primary'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        vm.edit(params.row.id);
                                    }
                                }
                            };
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
                            if (params.row.status === 0) {
                                children.push(h('Button', edit, '修改'));
                            }
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
                    title: ''
                },
                data: [
                    {
                        type: 'input',
                        word: 'text',
                        prop: 'title',
                        name: '标题',
                        placeholder: '请输入标题'
                    }
                ]
            },
            opreationData: [
                {
                    name: '添加',
                    icon: 'plus-round',
                    color: 'primary',
                    type: 'add'
                },
                {
                    name: '批量发布',
                    icon: 'share',
                    color: 'primary',
                    type: 'releases'
                }
            ]
        }
    }
}

export default (data) => {
    return new newsReleaseOptions(data);
}