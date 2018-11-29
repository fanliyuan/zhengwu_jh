import React, { Component } from 'react';
import { Input, Card, Form, Button, Cascader, Radio, Checkbox, Select, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '@/components/PageHeaderWrapper';
// import styles from './OpenShare.less';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
@Form.create()
@connect(({ informationResource }) => ({
  informationResource,
}))
export default class OpenShare extends Component {
  state = {
    id: -1,
  };

  componentDidMount() {
    // if(this.props.location.state){

    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/openShare',
      payload: this.props.location.state && this.props.location.state.openId,
    });
    this.setState({
      id: this.props.location.state && this.props.location.state.openId,
    });
  }

  setInputs = () => {
    const { setFieldValue } = this.props.form;
    const { minutes, hours, day, month, week } = this.state;
    const timeInfo = [minutes, hours, day, month, week];
    setFieldValue('setTime', timeInfo);
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const { id } = this.state;
        dispatch({
          type: 'informationResource/submitOpenShare',
          payload: {
            publishMode: '',
            publishRate: '',
            switchAreaId: [],
            timeSet: '',
            open: +values.open === 1 ? true : false,
            share: +values.share === 1 ? true : false,
            id,
            subscribeLicense: +values.subscribeLicense === 1 ? true : false,
          },
        });
      }
    });
  };

  handleSave = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/dataSourceManagement/catalogManagement'));
  };

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/informationResource/sourceManagement'));
  };

  render() {
    const {
      form: { getFieldDecorator },
      informationResource: { openData },
    } = this.props;
    const plainOptions = ['交换域1', '交换域2', '交换域3'];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const submitLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const optionData = [
      { label: '定时', value: '0', id: 0 },
      { label: '实时', value: '1', id: 1 },
      { label: '手动', value: '2', id: 2 },
    ];
    const optionSelect = optionData.map(item => {
      return (
        <Option value={item.value} key={item.id} label={item.label}>
          {item.label}
        </Option>
      );
    });
    const options = [
      {
        value: '0',
        label: '增量',
        children: [
          {
            value: '0-0',
            label: '日志',
          },
          {
            value: '0-1',
            label: '标志位',
          },
          {
            value: '0-2',
            label: '时间戳',
          },
        ],
      },
      {
        value: '1',
        label: '全量',
        children: [
          {
            value: '1-0',
            label: '日志',
          },
          {
            value: '1-1',
            label: '标志位',
          },
          {
            value: '1-2',
            label: '时间戳',
          },
        ],
      },
    ];
    const updateTime = [
      { id: 1, label: '实时' },
      { id: 2, label: '每日' },
      { id: 3, label: '每周' },
      { id: 4, label: '每月' },
      { id: 5, label: '每季度' },
      { id: 6, label: '每年' },
    ];
    const updateTimeOption = updateTime.map(item => {
      return (
        <Option value={item.label} key={item.id}>
          {item.label}
        </Option>
      );
    });
    return (
      <PageHeaderLayout>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="是否开放" {...formItemLayout}>
              {getFieldDecorator('open', {
                initialValue: openData && openData.open ? 1 : 0,
                rules: [{ required: true, message: '请选择是否开放' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
              {/* {getFieldDecorator('openType',{
                initialValue:''
              })(
                <Select style={{width:150}} placeholder="请选择类型">
                  {updateTimeOption}
                </Select>
              )} */}
            </FormItem>
            <FormItem label="是否共享" {...formItemLayout}>
              {getFieldDecorator('share', {
                initialValue: openData && openData.share ? 1 : 0,
                rules: [{ required: true, message: '请选择是否共享' }],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {/* <FormItem label="交换域" {...formItemLayout}>
              <InputGroup compact>
                {getFieldDecorator('switchArea')(<CheckboxGroup options={plainOptions} />)}
              </InputGroup>
            </FormItem> */}
            <FormItem label="订阅授权" {...formItemLayout}>
              {getFieldDecorator('subscribeLicense', {
                initialValue: openData && openData.subscribeLicense ? 1 : 0,
                rules: [{ required: true, message: '请选择是否需要订阅授权' }],
              })(
                <RadioGroup>
                  <Radio value={1}>需要</Radio>
                  <Radio value={0}>不需要</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {/* <FormItem label="发布模式" {...formItemLayout}>
              {getFieldDecorator('types')(<Cascader options={options} />)}
            </FormItem>
            <FormItem label="发布频率" {...formItemLayout}>
              {getFieldDecorator('rate')(<Select>{optionSelect}</Select>)}
            </FormItem>
            <FormItem label="定时设置" {...formItemLayout}>
              <InputGroup compact>
                {getFieldDecorator('setTime')(
                  <Input style={{ width: '20%' }} placeholder="分钟" />
                )}
                {getFieldDecorator('setTime1')(
                  <Input style={{ width: '20%' }} placeholder="小时" />
                )}
                {getFieldDecorator('setTime2')(<Input style={{ width: '20%' }} placeholder="天" />)}
                {getFieldDecorator('setTime3')(<Input style={{ width: '20%' }} placeholder="月" />)}
                {getFieldDecorator('setTime4')(
                  <Input style={{ width: '20%' }} placeholder="星期" />
                )}
              </InputGroup>
            </FormItem> */}
            <FormItem {...submitLayout}>
              <div className="btnclsb">
                <Button
                  type="primary"
                  className="mr64"
                  htmlType="submit"
                  style={{ marginRight: 20 }}
                >
                  保存
                </Button>
                <Button onClick={this.handleBack}>返回</Button>
              </div>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
