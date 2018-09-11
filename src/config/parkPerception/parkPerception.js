/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/26
 *
 * 描述 ：数字雄安配置数据
 */

class parkPerceptionOptions {
    constructor(data) {
        this.data = data;
    }

    setVm () {
        return this.data;
    }

    setData () {
        let vm = this.setVm();
        const validateMulti = (rule, value, callback, source, options) => {
            for (let i = 0, len = vm.$children.length; i < len; i++) {
                if (vm.$children[i].selfName && vm.$children[i].selfName === 'ConModal') {
                    vm.$nextTick(() => {
                        startValidate(i, callback);
                    });
                }
            }
        };
        const startValidate = (i, callback) => {
            let a = vm.$children[i].$refs.parkPerceptionSource[0].value;
            let b = vm.$children[i].$refs.parkPerceptionUrl[0].value;
            let c = vm.$children[i].$refs.parkPerceptionBlueUrl[0].value;
            if (a === '' && b === '' && c === '') {
                callback(new Error('内容数据源、红色链接或蓝色链接至少选填一项'));
            }else {
                callback();
            }
        };

        return {
            title: '数字雄安管理',
            apis: {
                addApi: 'parkPerceptionAdd',
                deleteApi: 'parkPerceptionDelete',
                detailApi: 'parkPerceptionDetail',
                listApi: 'parkPerceptionList',
                editApi: 'parkPerceptionUpdate'
            },
            modalOpreation: false,
            modalWidgets: {},
            modalData: {
                title: {},
                apiUrl: '',
                width: 900,
                formObj: {
                    parkPerceptionName: '',
                    parkPerceptionDescribe: '',
                    parkPerceptionImg: '',
                    parkPerceptionSource: '',
                    parkPerceptionUrl: '',
                    parkPerceptionBlueUrl: '',
                    parkPerceptionStatus: 0,
                    parkPerceptionOrder: 0
                },
                oldFormObj: {
                    parkPerceptionName: '',
                    parkPerceptionDescribe: '',
                    parkPerceptionImg: '',
                    parkPerceptionSource: '',
                    parkPerceptionUrl: '',
                    parkPerceptionBlueUrl: '',
                    parkPerceptionStatus: 0,
                    parkPerceptionOrder: 0
                },
                oneOfFormArr: ['parkPerceptionSource', 'parkPerceptionUrl', 'parkPerceptionBlueUrl'],
                ueObj: '',
                idObj: 'parkPerceptionId',
                ruleObj: {
                    parkPerceptionName: [
                        {
                            required: true,
                            message: '名称不能为空',
                            trigger: 'blur'
                        },
                        {
                            max: 15,
                            message: '名称长度不能大于15个字符'
                        }
                    ],
                    parkPerceptionDescribe: [
                        {
                            required: true,
                            message: '简介不能为空',
                            trigger: 'blur'
                        },
                        {
                            max: 50,
                            message: '简介长度不能大于50个字符'
                        }
                    ],
                    parkPerceptionImg: [
                        {
                            required: true,
                            message: '图片不能为空',
                            trigger: 'blur'
                        }
                    ],
                    parkPerceptionSource: [
                        {
                            validator: validateMulti
                        }
                    ],
                    parkPerceptionUrl: [
                        {
                            type: 'url',
                            message: '请输入正确的url格式（http://...）'
                        },
                        {
                            validator: validateMulti
                        }
                    ],
                    parkPerceptionBlueUrl: [
                        {
                            type: 'url',
                            message: '请输入正确的url格式（http://...）'
                        },
                        {
                            validator: validateMulti
                        }
                    ]
                },
                widgets: [
                    {
                        type: 'input',
                        disabled: false,
                        word: 'text',
                        prop: 'parkPerceptionName',
                        name: '名称',
                        placeholder: '请输入名称'
                    },
                    {
                        type: 'input',
                        disabled: false,
                        word: 'textarea',
                        prop: 'parkPerceptionDescribe',
                        name: '简介',
                        placeholder: '请输入简介'
                    },
                    {
                        type: 'upload',
                        disabled: false,
                        prop: 'parkPerceptionImg',
                        name: '图片',
                        placeholder: '上传图片',
                        placeholderA: '删除图片',
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
                        type: 'selectValidateOther',
                        disabled: false,
                        prop: 'parkPerceptionSource',
                        name: '内容数据源',
                        placeholder: '请选择内容数据源',
                        options: [
                            {
                                value: '1',
                                key: '展厅趣味体验'
                            },
                            {
                                value: '2',
                                key: '感知环境'
                            },
                            {
                                value: '3',
                                key: '人流分布'
                            },
                            {
                                value: '4',
                                key: '绿色节能'
                            }
                        ]
                    },
                    {
                        type: 'inputValidateOther',
                        disabled: false,
                        word: 'text',
                        prop: 'parkPerceptionUrl',
                        name: '红色链接',
                        placeholder: '请输入红色链接'
                    },
                    {
                        type: 'inputValidateOther',
                        disabled: false,
                        word: 'text',
                        prop: 'parkPerceptionBlueUrl',
                        name: '蓝色链接',
                        placeholder: '请输入蓝色链接'
                    },
                    {
                        type: 'switch',
                        disabled: false,
                        prop: 'parkPerceptionStatus',
                        name: '服务状态',
                        openName: '开启',
                        closeName: '关闭',
                        openVal: 1,
                        closeVal: 0
                    },
                    {
                        type: 'inputNumber',
                        disabled: false,
                        max: 999,
                        min: 0,
                        prop: 'parkPerceptionOrder',
                        name: '排序'
                    }
                ],
                titles: {
                    viewTitle: {
                        name: '查看数字雄安详情',
                        showOkBtn: false
                    },
                    addTitle: {
                        name: '添加数字雄安',
                        showOkBtn: true
                    },
                    editTitle: {
                        name: '编辑数字雄安',
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
                        title: '内容名称',
                        key: 'name',
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
                                        name: params.row.name
                                    }
                                }, params.row.name)
                            ])
                        }
                    },
                    {
                        title: '查看次数',
                        key: 'browse'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        render: (h, params) => {
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
                            children.push(h('Button', edit, '修改'));
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
                    name: ''
                },
                data: [
                    {
                        type: 'input',
                        word: 'text',
                        prop: 'name',
                        name: '内容名称',
                        placeholder: '请输入内容名称'
                    }
                ]
            },
            opreationData: [
                {
                    name: '添加',
                    icon: 'plus-round',
                    color: 'primary',
                    type: 'add'
                }
            ]
        }
    }
}

export default (data) => {
    return new parkPerceptionOptions(data);
}