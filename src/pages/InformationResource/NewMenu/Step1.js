/*
 * @Author: ChouEric
 * @Date: 2018-07-06 17:49:30
 * @Last Modified by: fly
 * @Last Modified time: 2018-12-24 11:54:01
*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import { Form, Input, Button, Select, Card, Steps, Cascader, DatePicker, message } from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import styles from './index.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

const { Item } = Form;
const { Option } = Select;
const { Step } = Steps;
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};

const typeId = [];
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
  loading: loading.effects['informationResource/getResourcesEdit'],
}))
@Form.create()
export default class Step1 extends PureComponent {
  buttonList = [
    {
      text: '取消',
      fn() {
        router.push('/informationResource/sourceManagement');
      },
    },
  ];

  state = {
    resourceRouteId: '',
    nextDisable: false,
    startValue: null,
    endValue: new Date(),
  };

  componentDidMount() {
    const {
      dispatch,
      location: { pathname, state: { editId, back } = {} },
    } = this.props;
    // const isEdit = route.pathname === 'informationResource/editMenu/one'
    dispatch({
      type: 'informationResource/getClassfiyList',
    });
    if (editId && pathname === '/informationResource/editMenu/one' && !back) {
      dispatch({
        type: 'informationResource/getResourcesEdit',
        payload: { id: editId },
      });
    } else if (pathname === '/informationResource/editMenu/one' && !editId) {
      router.push('/informationResource/sourceManagement');
    } else if (pathname === '/informationResource/newMenu/one' && !back) {
      const {
        name,
        format,
        providerDept,
        providerName,
        providerNo,
        publishTime,
        relateCode,
        summary,
        typeName,
        updateCycle,
      } = {};
      dispatch({
        type: 'informationResource/saveStep1Data',
        payload: {
          name,
          format,
          providerDept,
          providerName,
          providerNo,
          publishTime,
          relateCode,
          summary,
          typeName,
          updateCycle,
        },
      });
      dispatch({
        type: 'informationResource/saveStep2Data',
        payload: [],
      });
    }
  }

  handleCancel = () => {};

  handleCheckName = async () => {
    const {
      form: { getFieldValue },
      dispatch,
      informationResource: { sameMsg },
    } = this.props;
    await dispatch({
      type: 'informationResource/isNameSame',
      payload: { typeId: -1, name: getFieldValue('name') },
    });
    if (sameMsg) {
      message.error('资源名称重名，请重新填写');
      this.setState({
        nextDisable: true,
      });
    } else {
      this.setState({
        nextDisable: false,
      });
    }
  };

  handleNext = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      dispatch,
      location: { pathname, state: { editId, fileList = [] } = {} },
    } = this.props;
    // eslint-disable-next-line
    validateFields((errors, values) => {
      if (errors) {
        message.error('请检查输入');
      } else {
        values.typeName = values.typeName.join('-');
        values.format = values.format.join('-');
        values.publishTime = values.publishTime.format('YYYY-MM-DD');
        dispatch({
          type: 'informationResource/saveStep1Data',
          payload: values,
        });
        router.push({
          pathname: pathname.replace(/one$/, 'two'),
          state: {
            editId,
            fileList,
          },
        });
      }
    });
  };

  onStartChange = value => {};

  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  };

  formChange = () => {
    // const { form: { getFieldsError } } = this.props
    // console.log(getFieldsError())
    // this.setState({
    //   nextDisable: Object.values(getFieldsError()).some(item => item)
    // })
  };

  render() {
    const {
      form: { getFieldDecorator },
      informationResource: { classfiyList, step1Data = {} },
      loading,
    } = this.props;
    // resouceDetailById = resourceDetail;
    const { nextDisable } = this.state;

    const options = [
      {
        value: '0',
        label: '电子文件',
        children: [
          { value: '0-0', label: 'OFD' },
          { value: '0-1', label: 'wps' },
          { value: '0-2', label: 'xml' },
          { value: '0-3', label: 'txt' },
          { value: '0-4', label: 'doc' },
          { value: '0-5', label: 'docx' },
          { value: '0-6', label: 'html' },
          { value: '0-7', label: 'pdf' },
          { value: '0-8', label: 'ppt' },
        ],
      },
      {
        value: '1',
        label: '电子表格',
        children: [
          { value: '1-0', label: 'et' },
          { value: '1-1', label: 'xls' },
          { value: '1-2', label: 'xlsx' },
        ],
      },
      {
        value: '2',
        label: '数据库',
        children: [
          { value: '2-0', label: 'Dm' },
          { value: '2-1', label: 'KingbaseES' },
          { value: '2-2', label: 'access' },
          { value: '2-3', label: 'dbf' },
          { value: '2-4', label: 'dbase' },
          { value: '2-5', label: 'sysbase' },
          { value: '2-6', label: 'oracle' },
          { value: '2-7', label: 'sql server' },
          { value: '2-8', label: 'db2' },
          { value: '2-9', label: 'mysql' },
        ],
      },
      {
        value: '3',
        label: '图形图表',
        children: [
          { value: '3-0', label: 'jpg' },
          { value: '3-1', label: 'gif' },
          { value: '3-2', label: 'bmp' },
        ],
      },
      {
        value: '4',
        label: '媒体',
        children: [
          { value: '4-0', label: 'swf' },
          { value: '4-1', label: 'rm' },
          { value: '4-2', label: 'mpg' },
        ],
      },
      { value: '5', label: '自定义' },
    ];

    const updateTime = [
      { id: 1, label: '实时' },
      { id: 2, label: '每日' },
      { id: 3, label: '每周' },
      { id: 4, label: '每月' },
      { id: 5, label: '每季度' },
      { id: 6, label: '每年' },
    ];
    const updateTimeOption = updateTime.map(item => (
      <Option value={item.label} key={item.id}>
        {item.label}
      </Option>
    ));
    return (
      <PageHeaderLayout buttonList={this.buttonList}>
        <Card bordered={false} loading={loading}>
          <Steps current={0} className={styles.steps}>
            <Step title="填写信息资源内容" />
            <Step title="编辑信息项" />
            <Step title="完成" />
          </Steps>
          <Form className={styles.stepForm} onSubmit={this.handleNext} onChange={this.formChange}>
            <Item label="信息资源名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: step1Data.name,
                rules: [{ required: true, message: '请输入名称' }],
              })(
                <Input
                  placeholder="请输入名称"
                  // disabled={disabled}
                  onBlur={this.handleCheckName}
                />
              )}
            </Item>
            <Item label="信息资源摘要" {...formItemLayout}>
              {getFieldDecorator('summary', {
                initialValue: step1Data.summary,
                rules: [{ required: true, message: '请输入描述' }],
              })(
                <Input.TextArea
                  placeholder="请输入描述"
                  rows={4}
                  // readOnly={disabled}
                />
              )}
            </Item>
            <Item label="信息资源分类" {...formItemLayout}>
              {getFieldDecorator('typeName', {
                initialValue: step1Data.typeName && step1Data.typeName.split('-'),
                rules: [{ required: true, message: '请输入选择分类' }],
              })(
                // <Select disabled={disabled}>
                //   <Option value="classify1">分类1</Option>
                //   <Option value="classify2">分类2</Option>
                //   <Option value="classify21">分类21</Option>
                // </Select>
                <Cascader
                  options={classfiyList}
                  fieldNames={{ label: 'name', value: 'name' }}
                  placeholder="请选择信息资源分类"
                />
              )}
            </Item>
            <Item label="信息资源提供方" {...formItemLayout}>
              {getFieldDecorator('providerName', {
                initialValue: step1Data.providerName,
                rules: [{ required: true, message: '请输入提供方名称' }],
              })(<Input placeholder="请输入提供方名称" />)}
            </Item>
            <Item label="提供方代码" {...formItemLayout}>
              {getFieldDecorator('providerNo', {
                initialValue: step1Data.providerNo,
                rules: [{ required: true, message: '请输入提供方代码' }],
              })(<Input />)}
            </Item>
            <Item label="提供方内部部门" {...formItemLayout}>
              {getFieldDecorator('providerDept', {
                initialValue: step1Data.providerDept,
                rules: [{ required: true, message: '请输入提供方内部部门' }],
              })(<Input placeholder="请输入部门" />)}
            </Item>
            <Item label="信息资源格式" {...formItemLayout}>
              {getFieldDecorator('format', {
                initialValue: step1Data.format && step1Data.format.split('-'),
                rules: [{ required: true, message: '请输入信息资源格式' }],
              })(
                <Cascader
                  options={options}
                  fieldNames={{ label: 'label', value: 'label' }}
                  placeholder="请选择信息资源格式"
                />
              )}
              {/* <a>编码规则说明</a> */}
            </Item>
            <Item label="更新周期" {...formItemLayout}>
              {getFieldDecorator('updateCycle', {
                initialValue: step1Data.updateCycle,
                rules: [{ required: true, message: '请输入更新周期' }],
              })(
                <Select>
                  {/* <Option value="classify1">分类1</Option>
                  <Option value="classify2">分类2</Option>
                  <Option value="classify21">分类21</Option> */}
                  {updateTimeOption}
                </Select>
              )}
            </Item>
            <Item label="发布日期" {...formItemLayout}>
              {getFieldDecorator('publishTime', {
                initialValue: moment(
                  step1Data.publishTime ? new Date(step1Data.publishTime) : Date.now()
                ), // startValue,
                rules: [{ required: true, message: '请输入发布日期' }],
              })(<DatePicker disabledDate={this.disabledStartDate} />)}
            </Item>
            <Item label="关联资源代码" {...formItemLayout}>
              {getFieldDecorator('relateCode', {
                // initialValue: step1Data.relateCode,
                // rules: [{ required: true, message: '请输入名称' }],
              })(<Input />)}
            </Item>
            <div className="btnclsb" style={{ textAlign: 'center' }}>
              {/* {!disabled ? (
                <Button type="primary" onClick={onValidateForm}>
                  下一步
                </Button>
              ) : (
                <Button type="primary" onClick={this.handleNext}>
                  下一步
                </Button>
              )} */}
              {/* <Link to="/informationResource/newMenu/two" style={{ color: 'white' }}> */}
              <Button type="primary" htmlType="submit" disabled={nextDisable}>
                下一步
              </Button>
              {/* <Link to="/informationResource/sourceManagement">
                <Button
                  // type="primary"
                  style={{ marginLeft: 20 }}
                >
                  取消
                </Button>
              </Link> */}
            </div>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
