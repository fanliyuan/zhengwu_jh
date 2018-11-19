/*
 * @Author: ChouEric
 * @Date: 2018-07-05 16:45:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-11-17 17:33:58
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
} from 'antd';

import TableForm from './TableForm';
import styles from './index.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

const { Item } = Form;
const { Step } = Steps;
const { Option } = Select;
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

@connect()
@Form.create()
export default class Step2 extends PureComponent {
  state = {
    data: {
      method: 3,
    },
    tableData: [
      {
        key: '2',
        dataLength: '7',
        dataType: 'N|数值型',
        name: '22',
        openCondition: '999',
        openType: 'classify2',
        shareCondition: '88',
        shareMode: '2|邮件',
        shareType: '2|无条件共享',
      },
    ],
    modalData: {
      name: '',
      organization: [],
      state: 0,
      time: [],
    },
    visible1: false,
    visible2: false,
    selectKeys: [],
    disabled: true,
    addVisible: false,
  };

  componentDidMount() {
    // if (this.props.location.pathname === '/dataSourceManagement/newMenu/two') {
    this.setState({
      disabled: false,
    });
    // }
  }

  onChange = val => {
    this.setState({
      tableData: val,
    });
  };

  handleAddItem = () => {
    this.setState({
      addVisible: true,
    });
  };

  methodChange = e => {
    this.setState({
      data: {
        method: e.target.value,
      },
      visible1: e.target.value === 1,
      visible2: e.target.value === 2,
    });
  };

  goBack = () => {
    if (!this.state.disabled) {
      this.props.dispatch(routerRedux.push('/dataSourceManagement/newMenu/one'));
    } else {
      this.props.dispatch(routerRedux.push('/dataSourceManagement/checkMenu/one'));
    }
  };

  goForward = () => {
    const {
      data: { method },
    } = this.state;
    this.props.dispatch(
      routerRedux.push('/dataSourceManagement/newMenu/three', { show: method === 1 })
    );
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
      form: { validateFields },
    } = this.props;
    validateFields((errors, values) => {
      // console.log(values)
      const { tableData } = this.state;
      let arr = tableData;
      arr.push(values);
      console.log('4', arr);
      this.setState({
        tableData: arr,
        addVisible: false,
      });
    });
  };

  render() {
    // const { form: { getFieldDecorator, validateFields }, dispatch } = this.props
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      data,
      tableData,
      modalData: { name, organization, state, time },
      visible1,
      addVisible,
      visible2,
      selectKeys,
      disabled,
    } = this.state;
    console.log('erer', tableData);
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
      { id: 1, label: '字符型', value: 'C' },
      { id: 2, label: '数值型', value: 'N' },
      { id: 3, label: '货币型', value: 'Y' },
      { id: 4, label: '日期型', value: 'D' },
      { id: 5, label: '日期时间型', value: 'T' },
      { id: 6, label: '逻辑型', value: 'L' },
      { id: 7, label: '备注型', value: 'M' },
      { id: 8, label: '通用型', value: 'G' },
      { id: 9, label: '双精度型', value: 'B' },
      { id: 10, label: '整型', value: 'I' },
      { id: 11, label: '浮点型', value: 'F' },
      { id: 12, label: '自定义' },
    ];
    const dataTypeOption = dataType.map(item => {
      return (
        <Option value={`${item.value}|${item.label}`} key={item.id}>
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
        <Option value={`${item.id}|${item.label}`} key={item.id}>
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
              <Radio.Group value={data.method} onChange={this.methodChange} disabled={disabled}>
                <Radio value={3}>手工建立</Radio>
                <Radio value={2}>模板导入</Radio>
              </Radio.Group>
            </Item>
            <Item label="信息项">
              <TableForm
                value={tableData}
                onChange={val => this.onChange(val)}
                disabled={disabled}
              />
            </Item>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button className="mr64" onClick={this.goBack}>
              上一步
            </Button>
            {!disabled && (
              <Button type="primary" onClick={this.goForward}>
                提交
              </Button>
            )}
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
            onCancel={() => this.setState({ addVisible: false })}
          >
            <Form className={styles.stepForm}>
              <Item label="信息项名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: data.menuName,
                  rules: [{ required: true, message: '请输入信息项名称' }],
                })(<Input placeholder="信息项名称" disabled={disabled} />)}
              </Item>
              <Item label="数据类型" {...formItemLayout}>
                {getFieldDecorator('dataType', {
                  initialValue: data.formName,
                  rules: [{ required: true, message: '请选择数据类型' }],
                })(<Select disabled={disabled}>{dataTypeOption}</Select>)}
              </Item>
              <Item label="数据长度" {...formItemLayout}>
                {getFieldDecorator('dataLength', {
                  initialValue: data.desc,
                  rules: [{ required: true, message: '请输入数据长度' }],
                })(<Input placeholder="请输入数据长度" disabled={disabled} />)}
              </Item>
              <Item label="共享类型" {...formItemLayout}>
                {getFieldDecorator('shareType', {
                  initialValue: data.classify,
                  rules: [{ required: true, message: '请选择共享类型' }],
                })(
                  <Select disabled={disabled}>
                    <Option value="1|有条件共享">有条件共享</Option>
                    <Option value="2|无条件共享">无条件共享</Option>
                    <Option value="3|不予共享">不予共享</Option>
                  </Select>
                )}
              </Item>
              <Item label="共享条件" {...formItemLayout}>
                {getFieldDecorator('shareCondition', {
                  initialValue: data.desc,
                  rules: [{ required: true, message: '请输入共享条件' }],
                })(<Input.TextArea placeholder="请输入共享条件" rows={4} readOnly={disabled} />)}
              </Item>
              <Item label="共享方式" {...formItemLayout}>
                {getFieldDecorator('shareMode', {
                  initialValue: data.formName,
                  rules: [{ required: true, message: '请选择共享方式' }],
                })(
                  <Select disabled={disabled}>
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
                  <Select disabled={disabled}>
                    <Option value="classify1">是</Option>
                    <Option value="classify2">否</Option>
                    {/* <Option value="classify21">不予共享</Option> */}
                  </Select>
                )}
              </Item>
              <Item label="开放条件" {...formItemLayout}>
                {getFieldDecorator('openCondition', {
                  initialValue: data.desc,
                  rules: [{ required: true, message: '请输入开放条件' }],
                })(<Input.TextArea placeholder="请输入开放条件" rows={4} readOnly={disabled} />)}
              </Item>
            </Form>
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
