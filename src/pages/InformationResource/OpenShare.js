import React, { Component } from 'react';
import {
  // Input,
  Card,
  Form,
  Button,
  Radio,
  Checkbox,
  // Select,
  // message,
  Divider,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Bind, Debounce } from 'lodash-decorators';

import PageHeaderLayout from '@/components/PageHeaderWrapper';
import styles from './OpenShare.less';

const FormItem = Form.Item;
// const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
// const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
@Form.create()
@connect(({ informationResource }) => ({
  informationResource,
}))
export default class OpenShare extends Component {
  state = {
    id: -1,
    isExpandOrFolder: true,
    isDisable: false,
  };

  componentDidMount() {
    // if(this.props.location.state){

    // }
    const { dispatch, location } = this.props;
    dispatch({
      type: 'informationResource/openShare',
      payload: location.state && location.state.openId,
    });
    this.setState({
      id: location.state && +location.state.openId,
    });
    dispatch({
      type: 'informationResource/getResourcesEdit',
      payload: { id: location.state && +location.state.openId },
    });
  }

  setInputs = () => {
    const {
      form: { setFieldValue },
    } = this.props;
    const { minutes, hours, day, month, week } = this.state;
    const timeInfo = [minutes, hours, day, month, week];
    setFieldValue('setTime', timeInfo);
  };

  isFolderOrExpand = () => {
    const { isExpandOrFolder } = this.state;
    this.setState({
      isExpandOrFolder: !isExpandOrFolder,
    });
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
        const params = {
          publishMode: '',
          publishRate: '',
          switchAreaId: [],
          timeSet: '',
          open: +values.open === 1,
          openContent: values.openContent || [],
          share: +values.share === 1,
          shareContent: values.shareContent || [],
          // opendoorType: values.openType === '开放门户分类' ? '' : values.openType,
          subscribeLicense: +values.subscribeLicense === 1,
        };
        // TODO: 临时删除这两个字段,后端接口没有接收这两个字段
        // delete params.openContent;
        // delete params.shareContent;
        dispatch({
          type: 'informationResource/submitOpenShare',
          payload: {
            id,
            shareopenEditDto: params,
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

  @Bind()
  @Debounce(10)
  formChange() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields(error => {
      this.setState({
        isDisable: error,
      });
    });
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      informationResource: { openData, resourceDetail },
    } = this.props;
    const { isExpandOrFolder, isDisable } = this.state;
    const isOpen = getFieldValue('open');
    const isShare = getFieldValue('share');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const submitLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.form}>
            <h3>
              信息资源代码:
              <span> {resourceDetail && resourceDetail.code}</span>
              信息资源名称:
              <span> {resourceDetail && resourceDetail.name}</span>
              信息资源提供方:
              <span> {resourceDetail && resourceDetail.providerDept}</span>
              发布时间:
              <span> {resourceDetail && resourceDetail.shareTime}</span>
            </h3>
            <h3 style={{ display: isExpandOrFolder ? 'none' : 'block' }}>
              提供方代码:
              <span> {resourceDetail && resourceDetail.providerNo}</span>
              信息属性分类:
              <span> {resourceDetail && resourceDetail.typeName}</span>
              信息资源格式:
              <span> {resourceDetail && resourceDetail.format}</span>
              信息资源摘要:
              <span> {resourceDetail && resourceDetail.summary}</span>
            </h3>
            <Button style={{ marginLeft: 10 }} onClick={this.isFolderOrExpand}>
              {isExpandOrFolder ? '展开' : '收起'}
            </Button>
            <Divider />
          </div>
          <Form onSubmit={this.handleSubmit} /* onChange={this.formChange} */>
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
            </FormItem>
            {/* {isOpen === 1 && (
              <FormItem label="开放内容" {...formItemLayout}>
                {getFieldDecorator('openContent', {
                  initialValue: [],
                  rules: [{ required: true, message: '至少选择一项!' }],
                })(
                  <CheckboxGroup>
                    <Checkbox value="data">数据</Checkbox>
                    <Checkbox value="api">api</Checkbox>
                  </CheckboxGroup>
                )}
              </FormItem>
            )} */}
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
            {/* {isShare === 1 && (
              <FormItem label="共享内容" {...formItemLayout}>
                {getFieldDecorator('shareContent', {
                  initialValue: [],
                  rules: [{ required: true, message: '至少选择一项!' }],
                })(
                  <CheckboxGroup>
                    <Checkbox value="data">数据</Checkbox>
                    <Checkbox value="api">api</Checkbox>
                  </CheckboxGroup>
                )}
              </FormItem>
            )} */}
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
            <FormItem {...submitLayout}>
              <div style={{ textAlign: 'center' }}>
                <Button
                  disabled={isDisable}
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
