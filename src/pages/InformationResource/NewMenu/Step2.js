/*
 * @Author: ChouEric
 * @Date: 2018-07-05 16:45:01
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-22 23:38:35
 * @描述: 这个页面的上传应该是 上传完数据,然后后台处理,返回给前台,前台再核对,确认
 *        12/19 废了很大心思解决bug 1009576
*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Modal,
  Form,
  Button,
  Radio,
  Input,
  Select,
  Upload,
  Card,
  Steps,
  message,
  InputNumber,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import isEmpty from 'lodash/isEmpty';
import intersectionBy from 'lodash/intersectionBy';
import cloneDeep from 'lodash/cloneDeep';

import { Bind, Debounce, Throttle } from 'lodash-decorators';
import TableForm from './TableForm';
import styles from './index.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';

const { Item } = Form;
const { Step } = Steps;
const { Option } = Select;
// const TabPane = Tabs.TabPane
let keyId = 1;
// let rewriteItem = [];
// let step2Arr = [];

let typeId = [];
function getTreeId(treeArr = [], [...arr]) {
  for (const item of treeArr) {
    if (item.name === arr[0]) {
      arr.shift();
      typeId.push(item.id);
      getTreeId(item.children, arr);
      return false;
    }
  }
}

@connect(({ informationResource, loading }) => ({
  informationResource,
  loading: loading.effects['informationResource/reWriteItemList'],
}))
@Form.create()
export default class Step2 extends PureComponent {
  buttonList = [
    {
      text: '取消',
      fn() {
        router.push('/informationResource/sourceManagement');
      },
    },
  ];

  formOptions = {
    formData: [
      {
        name: 'infoSourceName',
        typeOption: {
          placeholder: '信息项名称',
        },
      },
    ],
    searchHandler: this.handleSearch,
    resetHandler: this.handleReset,
  };

  state = {
    data: {
      method: 1,
    },
    tableData: [],
    modalData: {
      name: '',
      organization: [],
      state: 0,
      time: [],
    },
    visible1: false,
    visible2: false,
    selectKeys: [],
    // disabled: true,
    addVisible: false,
    routeData: {},
    isEnable: true,
    isAgain: false,
    editId: '',
    step2Arr: [],
    fileList: [],
    step1Data: {},
    step2Data: [],
    uploadIndexArr: [],
  };

  componentDidMount() {
    const {
      informationResource: { step1Data, step2Data },
      dispatch,
      location: { state: { editId, fileList = [] } = {} },
    } = this.props;
    if (isEmpty(step1Data)) {
      router.push({
        pathname: '/informationResource/newMenu/one',
      });
    }
    if (editId && isEmpty(step2Data)) {
      dispatch({
        type: 'informationResource/reWriteItemList',
        payload: { id: editId },
      });
    }
    this.setState({
      fileList,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.informationResource.itemList) {
      const nextItemList = nextProps.informationResource.itemList;
      const { tableData, routeData } = this.state;
      nextItemList.forEach(item => {
        item.key = keyId++;
      });
      this.setState({
        tableData: nextItemList,
        routeData: { ...routeData, infoAddDtoList: nextItemList },
      });
    }
    // if (rewriteItem) {
    //   const { tableData, routeData } = this.state;
    //   rewriteItem.forEach(item => {
    //     item.key = keyId++;
    //   });
    //   this.setState({
    //     tableData: rewriteItem,
    //     routeData: { ...routeData, infoAddDtoList: rewriteItem },
    //   });
    // }
  }

  handleReset = () => {
    const {
      dispatch,
      location: { state: { editId } = {}, pathname },
    } = this.props;
    this.setState({
      fileList: [],
    });
    if (pathname === '/informationResource/editMenu/two') {
      dispatch({
        type: 'informationResource/reWriteItemList',
        payload: { id: editId },
      });
    } else {
      dispatch({
        type: 'informationResource/saveStep2Data',
        payload: [],
      });
    }
  };

  onChange = val => {
    const { dispatch } = this.props;
    const step1Data = cloneDeep(val);
    step1Data.forEach(item => delete item.editable);
    dispatch({
      type: 'informationResource/saveStep2Data',
      payload: val,
    });
  };

  handleAddItem = () => {
    if (sessionStorage.getItem('itemData')) {
      const { routeData } = this.state;
      this.setState({
        tableData: [],
        routeData: { ...routeData, infoAddDtoList: '' },
      });
      sessionStorage.setItem('itemData', '');
    }
    this.setState({
      addVisible: true,
    });
  };

  goBack = () => {
    const {
      location: { pathname, state: { editId = '' } = {} },
    } = this.props;
    const { fileList } = this.state;
    router.push({
      pathname: pathname.replace(/two$/, 'one'),
      state: {
        editId,
        back: true,
        fileList,
      },
    });
  };

  goForward = () => {
    const {
      dispatch,
      location: { state: { editId } = {} },
    } = this.props;
    const {
      informationResource: { step1Data, step2Data, classfiyList },
    } = this.props;
    getTreeId(classfiyList, step1Data.typeName.split('-'));
    step1Data.typeId = [...typeId].join('-');
    typeId = [];
    if (editId) {
      step2Data.id = editId;
      dispatch({
        type: 'informationResource/editResources',
        payload: {
          body: {
            ...step1Data,
            infoEditDtoList: {
              ...step2Data,
            },
          },
          id: editId,
        },
      });
    } else {
      dispatch({
        type: 'informationResource/addResources',
        payload: { ...step1Data, infoAddDtoList: step2Data },
      });
    }
  };

  handleModalOk = () => {
    const {
      form: { validateFields, resetFields },
      informationResource: { step2Data },
    } = this.props;
    // eslint-disable-next-line
    validateFields((errors, values) => {
      if (!errors) {
        if (step2Data.some(item => item.name === values.name)) {
          return message.error('信息项名称不能重复,请检查!');
        }
        // eslint-disable-next-line
        values.index = step2Data.length;
        values.key = step2Data.length;
        step2Data.push(values);
        this.setState({
          addVisible: false,
        });
      }
    });
  };

  handleDataChange = val => {
    const { routeData } = this.state;
    this.setState({
      routeData: { ...routeData, infoAddDtoList: val || [] },
    });
  };

  handleOpenConditionChange = e => {
    this.isDisbaled();
    // this.checkLength(e.target.value, 500);
  };

  handleShareChange = () => {
    this.isDisbaled();
    // this.checkLength(e.target.value, 50);
  };

  handleLengthChange = () => {
    this.isDisbaled();
    // this.checkLength(val + '', 50);
  };

  handleNameChange = () => {
    this.isDisbaled();
    // this.checkLength(e.target.value, 50)
  };

  handleFileChange = info => {
    const { fileList } = info;
    // fileList = fileList.slice(-1);
    if (info.file.status === 'done') {
      if (info.file.response) {
        if (+info.file.response.code === 200) {
          console.log(fileList);
          message.success(`${info.file.name} 导入成功`);
          const {
            informationResource: { step2Data },
            dispatch,
          } = this.props;
          const { uploadIndexArr } = this.state;
          const uploadData = Array.isArray(info.file.response.result.datas)
            ? info.file.response.result.datas
            : [];
          if (intersectionBy(step2Data, uploadData, 'name').length > 0) {
            message.destroy();
            const result = [...fileList];
            result.pop();
            this.setState({
              fileList: result,
            });
            return message.error('上传的数据和已有数据的信息项名称重复,请检查后重新上传');
          }
          // const uid = [...fileList].pop().uid
          // console.log(uploadData)
          uploadData.forEach((item, i) => {
            const index = step2Data.length + i;
            uploadIndexArr.push(index);
            item.index = index; // eslint-disable-line
            item.uid = [...fileList].pop().uid; // eslint-disable-line
          });
          dispatch({
            type: 'informationResource/saveStep2Data',
            payload: [...step2Data, ...uploadData],
          });
          // sessionStorage.setItem('uploadData', JSON.stringify(info.file.response.result.datas));
        } else {
          message.error(`${info.file.response.message}`);
        }
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.response.message}`);
    }
    this.setState({ fileList });
  };

  handleRemoveChange = file => {
    const {
      informationResource: { step2Data },
      dispatch,
    } = this.props;
    dispatch({
      type: 'informationResource/saveStep2Data',
      payload: step2Data.filter(item => item.uid !== file.uid),
    });
  };

  @Bind()
  @Debounce(300)
  isDisbaled() {
    const {
      form: { getFieldsError, isFieldTouched, getFieldValue },
    } = this.props;
    // console.log(Object.values(getFieldsError()));
    // console.log(isFieldTouched('dataType'))
    this.setState({
      isEnable:
        Object.values(getFieldsError()).some(item => item) ||
        !isFieldTouched('name') ||
        !isFieldTouched('dataType') ||
        !isFieldTouched('dataLength') ||
        !isFieldTouched('shareType') ||
        (getFieldValue('shareType') === '有条件共享' && !isFieldTouched('shareCondition')) ||
        !isFieldTouched('shareMode') ||
        !isFieldTouched('openType') ||
        (getFieldValue('openType') === '是' && !isFieldTouched('openCondition')),
    });
  }

  @Bind()
  @Throttle(300)
  handleSearch(queryData) {
    const {
      informationResource: { step2Data },
      dispatch,
    } = this.props;
    dispatch({
      type: 'informationResource/saveStep2Data',
      payload: step2Data.filter(item => item.name.includes(queryData.infoSourceName)),
    });
  }

  render() {
    // const { form: { getFieldDecorator, validateFields }, dispatch } = this.props
    const {
      form: { getFieldDecorator, getFieldValue },
      informationResource: { step2Data },
      loading,
    } = this.props;
    // rewriteItem = itemList;
    const {
      data,
      tableData,
      modalData: { name, organization, state, time },
      visible1,
      addVisible,
      visible2,
      selectKeys,
      // disabled,
      isEnable,
      isAgain,
      fileList,
      // step2Arr,
    } = this.state;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    const formItemLayout1 = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    const formItemLayout2 = {
      labelCol: {
        span: 2,
        // offset:2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    const options = [
      {
        value: '0',
        label: '电子文件',
        children: [
          {
            value: '0-0',
            label: 'OFD',
          },
          {
            value: '0-1',
            label: 'wps',
          },
          {
            value: '0-2',
            label: 'xml',
          },
          {
            value: '0-3',
            label: 'txt',
          },
          {
            value: '0-4',
            label: 'doc',
          },
          {
            value: '0-5',
            label: 'docx',
          },
          {
            value: '0-6',
            label: 'html',
          },
          {
            value: '0-7',
            label: 'pdf',
          },
          {
            value: '0-8',
            label: 'ppt',
          },
        ],
      },
      {
        value: '1',
        label: '电子表格',
        children: [
          {
            value: '1-0',
            label: 'et',
          },
          {
            value: '1-1',
            label: 'xls',
          },
          {
            value: '1-2',
            label: 'xlsx',
          },
        ],
      },
    ];

    const dataType = [
      { id: 1, label: '字符型C', value: 'C' },
      { id: 2, label: '数值型N', value: 'N' },
      { id: 3, label: '货币型Y', value: 'Y' },
      { id: 4, label: '日期型D', value: 'D' },
      { id: 5, label: '日期时间型T', value: 'T' },
      { id: 6, label: '逻辑型L', value: 'L' },
      { id: 7, label: '备注型M', value: 'M' },
      { id: 8, label: '通用型G', value: 'G' },
      { id: 9, label: '双精度型B', value: 'B' },
      { id: 10, label: '整型I', value: 'I' },
      { id: 11, label: '浮点型F', value: 'F' },
      { id: 12, label: '自定义' },
    ];
    const dataTypeOption = dataType.map(item => (
      <Option value={item.label} key={item.id}>
        {item.label}
      </Option>
    ));

    const shareType = [
      { id: 1, label: '共享平台' },
      { id: 2, label: '邮件' },
      { id: 3, label: '拷盘' },
      { id: 4, label: '介质交换（纸质报表）' },
      { id: 5, label: '介质交换（电子文档）' },
      { id: 6, label: '自定义' },
    ];
    const shareTypeOption = shareType.map(item => (
      <Option value={item.label} key={item.id}>
        {item.label}
      </Option>
    ));

    const uploadProps = {
      name: 'file',
      action: '/api/api/v2/zhengwu/swap/resource/info/import',
      // headers: {
      //   authorization: 'authorization-text',
      // },
      data: {
        method: 'post',
      },
      onChange: info => this.handleFileChange(info),
      onRemove: info => this.handleRemoveChange(info),
      fileList,
    };

    const paginationProps = false;

    return (
      <PageHeaderLayout buttonList={this.buttonList}>
        <Card>
          <Steps current={1} className={styles.steps}>
            <Step title="填写信息资源内容" />
            <Step title="编辑信息项" />
            <Step title="完成" />
          </Steps>
          {/* 这里写 按钮 */}
          <div className="mb16">
            <Button className="mr16" onClick={this.handleAddItem}>
              添加
            </Button>
            <Button className="mr16" onClick={this.handleReset}>
              重置
            </Button>
            <Upload className={styles.infos} {...uploadProps}>
              <Button>导入</Button>
            </Upload>
            <a
              className={styles.aBtn}
              href="/api/api/v2/zhengwu/swap/resource/downTemplate?template=info"
              download="/api/api/v2/zhengwu/swap/resource/downTemplate?template=info"
            >
              {' '}
              下载模板{' '}
            </a>
            {/* <SearchForm formOptions={this.formOptions} /> */}
          </div>

          <TableForm
            loading={loading}
            value={step2Data}
            onChange={val => this.onChange(val)}
            // disabled={disabled}
            handleChange={this.handleDataChange}
            pagination={paginationProps}
            rowKey="index"
            className="mb16"
          />

          <div
            style={{
              textAlign: 'center',
              display: +data.method === 2 ? (isAgain ? 'block' : 'none') : 'block',
            }}
          >
            <Button className="mr64" onClick={this.goBack} style={{ marginRight: 20 }}>
              上一步
            </Button>
            <Button type="primary" onClick={this.goForward}>
              提交
            </Button>
          </div>
          <Modal
            title="添加信息项"
            visible={addVisible}
            onOk={this.handleModalOk}
            okButtonProps={{ disabled: isEnable }}
            onCancel={() => this.setState({ addVisible: false })}
          >
            <Form className={styles.stepForm}>
              <Item label="信息项名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: data.menuName,
                  rules: [
                    { required: true, message: '请输入信息项名称' },
                    {
                      max: 50,
                      message: '输入不超过50个字符',
                    },
                  ],
                })(
                  <Input
                    placeholder="信息项名称"
                    // disabled={disabled}
                    onChange={this.handleNameChange}
                  />
                )}
              </Item>
              <Item label="数据类型" {...formItemLayout}>
                {getFieldDecorator('dataType', {
                  initialValue: data.formName,
                  rules: [{ required: true, message: '请选择数据类型' }],
                })(<Select>{dataTypeOption}</Select>)}
              </Item>
              <Item label="数据长度" {...formItemLayout}>
                {getFieldDecorator('dataLength', {
                  initialValue: data.desc,
                  rules: [{ required: true, message: '请输入数据长度' }],
                })(<InputNumber min={1} onChange={this.handleLengthChange} />)}
              </Item>
              <Item label="共享类型" {...formItemLayout}>
                {getFieldDecorator('shareType', {
                  initialValue: data.classify,
                  rules: [{ required: true, message: '请选择共享类型' }],
                })(
                  <Select onChange={this.isDisbaled}>
                    <Option value="有条件共享">有条件共享</Option>
                    <Option value="无条件共享">无条件共享</Option>
                    <Option value="不予共享">不予共享</Option>
                  </Select>
                )}
              </Item>
              {getFieldValue('shareType') === '有条件共享' && (
                <Item label="共享条件" {...formItemLayout}>
                  {getFieldDecorator('shareCondition', {
                    initialValue: data.desc,
                    rules: [
                      {
                        required: true,
                        message: '请输入共享条件',
                      },
                      {
                        max: 50,
                        message: '输入不超过50个字符',
                      },
                    ],
                  })(
                    <Input.TextArea
                      placeholder="请输入共享条件"
                      rows={4}
                      // readOnly={disabled}
                      onChange={this.handleShareChange}
                    />
                  )}
                </Item>
              )}
              <Item label="共享方式" {...formItemLayout}>
                {getFieldDecorator('shareMode', {
                  initialValue: data.formName,
                  rules: [{ required: true, message: '请选择共享方式' }],
                })(
                  <Select>
                    {/* <Option value="classify1">分类1</Option>
                      <Option value="classify2">分类2</Option>
                      <Option value="classify21">分类21</Option> */}
                    {shareTypeOption}
                  </Select>
                )}
              </Item>
              <Item label="是否向社会开放" {...formItemLayout}>
                {getFieldDecorator('openType', {
                  initialValue: data.classify,
                  rules: [{ required: true, message: '请选择开放类型' }],
                })(
                  <Select onChange={this.isDisbaled}>
                    <Option value="是">是</Option>
                    <Option value="否">否</Option>
                    {/* <Option value="classify21">不予共享</Option> */}
                  </Select>
                )}
              </Item>
              {getFieldValue('openType') === '是' && (
                <Item label="开放条件" {...formItemLayout}>
                  {getFieldDecorator('openCondition', {
                    initialValue: data.desc,
                    rules: [
                      {
                        required: true,
                        message: '请输入开放条件',
                      },
                      {
                        max: 500,
                        message: '输入不超过50个字符',
                      },
                    ],
                  })(
                    <Input.TextArea
                      placeholder="请输入开放条件"
                      rows={4}
                      // readOnly={disabled}
                      onChange={this.handleOpenConditionChange}
                    />
                  )}
                </Item>
              )}
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
