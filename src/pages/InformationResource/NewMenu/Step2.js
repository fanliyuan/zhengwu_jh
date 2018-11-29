/*
 * @Author: ChouEric
 * @Date: 2018-07-05 16:45:01
 * @Last Modified by: fly
 * @Last Modified time: 2018-11-29 14:29:53
 * @描述: 这个页面的上传应该是 上传完数据,然后后台处理,返回给前台,前台再核对,确认
*/
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Modal,
  Form,
  Button,
  Radio,
  Input,
  Select,
  Table,
  Cascader,
  DatePicker,
  Upload,
  Icon,
  Card,
  Steps,
  message,
  InputNumber,
} from 'antd';

import TableForm from './TableForm';
import styles from './index.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

const { Item } = Form;
const { Step } = Steps;
const { Option } = Select;
let keyId = 1;
const modalList = [
  {
    id: 3,
    name: '城市低保标准表',
    type: 'MySQL',
    applicationName: '统计系统',
  },
  {
    id: 2,
    name: '人口统计表',
    type: 'MySQL',
    applicationName: '统计系统',
  },
  {
    id: 1,
    name: '农村低保标准表',
    type: 'MySQL',
    applicationName: '统计系统',
  },
];

@connect(({ informationResource }) => ({
  informationResource,
}))
@Form.create()
export default class Step2 extends PureComponent {
  state = {
    data: {
      method: 3,
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
    isEnable: false,
  };

  componentDidMount() {
    // if (this.props.location.pathname === '/dataSourceManagement/newMenu/two') {
    // console.log("ceshi",this.props.location.state)
    const sessionData =
      sessionStorage.getItem('routeData') && JSON.parse(sessionStorage.getItem('routeData'));
    if ((!this.props.location.state || !this.props.location.state.routeData) && !sessionData) {
      this.props.dispatch(routerRedux.push('/informationResource/newMenu/one'));
      return;
    }
    if (sessionData) {
      if (sessionStorage.getItem('itemData')) {
        // const { tableData } = this.state
        const newTableData = JSON.parse(sessionStorage.getItem('itemData'));
        this.setState({
          // disabled: false,
          tableData: JSON.parse(sessionStorage.getItem('itemData')),
          routeData: {
            ...sessionData,
            infoAddDtoList: JSON.parse(sessionStorage.getItem('itemData')),
          },
        });
      }
    } else {
      this.setState({
        // disabled: false,
        routeData: this.props.location.state ? this.props.location.state.routeData : '',
      });
      sessionStorage.setItem('routeData', JSON.stringify(this.props.location.state.routeData));
    }
  }

  onChange = val => {
    this.setState({
      tableData: val,
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

  methodChange = e => {
    if (e.target.value === 2) {
      this.props.dispatch(routerRedux.push('/informationResource/inputDirectoryitem'));
    }
  };

  goBack = () => {
    // if (!this.state.disabled) {
    //   this.props.dispatch(routerRedux.push('/dataSourceManagement/newMenu/one'));
    // } else {
    //   this.props.dispatch(routerRedux.push('/dataSourceManagement/checkMenu/one'));
    // }
    this.props.dispatch(routerRedux.push('/informationResource/newMenu/one'));
  };

  goForward = () => {
    const { dispatch } = this.props;
    const { routeData, tableData } = this.state;
    if (!routeData.infoAddDtoList || tableData.length <= 0) {
      message.error('信息项必填');
    } else {
      dispatch({
        type: 'informationResource/addResources',
        payload: { ...routeData, infoAddDtoList: tableData },
      });
    }
  };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if(!err){
  //       console.log(values)
  //       this.setState({
  //         tableData:values,
  //       })
  //     }
  //   });
  // }

  handleModalOk = () => {
    const {
      form: { validateFields, resetFields },
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const { tableData, routeData } = this.state;
        values.key = keyId;
        let arr = tableData;
        arr.push(values);
        this.setState({
          tableData: arr,
          addVisible: false,
          routeData: { ...routeData, infoAddDtoList: arr },
        });
        resetFields();
        keyId++;
      }
      // console.log(values.values())
      // if(values.values()){
      //   message.error("输入框不能为空")
      //   return
      // }
    });
  };

  handleDataChange = val => {
    const { routeData } = this.state;
    this.setState({
      routeData: { ...routeData, infoAddDtoList: val ? val : [] },
    });
  };

  checkLength = (value, i) => {
    // const { form:{ getFieldValue, setFieldsValue } } = this.props
    if (value.length > i) {
      // setFieldsValue({
      //   name:getFieldValue('name').slice(0,i-1), //value.slice(0,i-1)
      // })
      message.error(`输入长度不能超过${i}个字符`);
      this.setState({
        isEnable: true,
      });
    } else {
      this.setState({
        isEnable: false,
      });
    }
  };

  handleOpenConditionChange = e => {
    this.checkLength(e.target.value, 500);
  };

  handleShareChange = e => {
    this.checkLength(e.target.value, 50);
  };

  handleLengthChange = val => {
    this.checkLength(val + '', 50);
  };

  handleNameChange = e => {
    this.checkLength(e.target.value, 50);
  };

  render() {
    // const { form: { getFieldDecorator, validateFields }, dispatch } = this.props
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
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
    } = this.state;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
      },
      {
        title: '资源名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '数据类型',
        dataIndex: 'type',
        align: 'center',
      },
      {
        title: '应用系统名称',
        dataIndex: 'applicationName',
        align: 'center',
      },
    ];
    const rowSelection = {
      selectKeys,
      onChange: keys => {
        this.setState({
          selectKeys: keys,
        });
      },
    };

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
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
    const dataTypeOption = dataType.map(item => {
      return (
        <Option value={item.label} key={item.id}>
          {item.label}
        </Option>
      );
    });

    const shareType = [
      { id: 1, label: '共享平台' },
      { id: 2, label: '邮件' },
      { id: 3, label: '拷盘' },
      { id: 4, label: '介质交换（纸质报表）' },
      { id: 5, label: '介质交换（电子文档）' },
      { id: 6, label: '自定义' },
    ];
    const shareTypeOption = shareType.map(item => {
      return (
        <Option value={item.label} key={item.id}>
          {item.label}
        </Option>
      );
    });

    return (
      <PageHeaderLayout>
        <Card>
          <Steps current={1} className={styles.steps}>
            <Step title="填写信息资源内容" />
            <Step title="编辑信息项" />
            <Step title="完成" />
          </Steps>
          <Form>
            <Item lable="名称">
              <Radio.Group value={data.method} onChange={this.methodChange}>
                <Radio value={3}>手工添加</Radio>
                <Radio value={2}>信息项模板导入</Radio>
              </Radio.Group>
            </Item>
            <Item label="信息项">
              <TableForm
                value={tableData}
                onChange={val => this.onChange(val)}
                // disabled={disabled}
                handleChange={this.handleDataChange}
              />
            </Item>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button className="mr64" onClick={this.goBack} style={{ marginRight: 20 }}>
              上一步
            </Button>
            {/* {!disabled && ( */}
            <Button type="primary" onClick={this.goForward}>
              提交
            </Button>
            {/* )}*/}
          </div>
          <Button
            type="primary"
            style={{ background: 'transparent', color: '#1890FF' }}
            onClick={this.handleAddItem}
          >
            添加信息项
          </Button>
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
                  rules: [{ required: true, message: '请输入信息项名称' }],
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
                  <Select>
                    <Option value="有条件共享">有条件共享</Option>
                    <Option value="无条件共享">无条件共享</Option>
                    <Option value="不予共享">不予共享</Option>
                  </Select>
                )}
              </Item>
              <Item
                label="共享条件"
                {...formItemLayout}
                style={{ display: getFieldValue('shareType') === '有条件共享' ? 'block' : 'none' }}
              >
                {getFieldDecorator('shareCondition', {
                  initialValue: data.desc,
                  rules: [
                    {
                      required: getFieldValue('shareType') === '有条件共享' ? true : false,
                      message: '请输入共享条件',
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
                  rules: [{ required: true, message: '请选择共享类型' }],
                })(
                  <Select>
                    <Option value="是">是</Option>
                    <Option value="否">否</Option>
                    {/* <Option value="classify21">不予共享</Option> */}
                  </Select>
                )}
              </Item>
              <Item label="开放条件" {...formItemLayout}>
                {getFieldDecorator('openCondition', {
                  initialValue: data.desc,
                  rules: [{ required: true, message: '请输入开放条件' }],
                })(
                  <Input.TextArea
                    placeholder="请输入开放条件"
                    rows={4}
                    // readOnly={disabled}
                    onChange={this.handleOpenConditionChange}
                  />
                )}
              </Item>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
