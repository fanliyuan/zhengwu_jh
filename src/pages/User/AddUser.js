import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Modal, Form, Input, Checkbox, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './User.less';

const FormItem = Form.Item;

@connect(({ addUser, loading }) => ({
  addUser,
  submitting: loading.effects['addUser/submit'],
}))
@Form.create()
class AddUser extends PureComponent {
  state = {
    checked: true,
    hasSetChecked: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { route, match } = this.props;
    dispatch({
      type: 'addUser/detail',
      payload: {
        userId: match.params.id,
        routeName: route.name,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      addUser: { params },
    } = nextProps;
    const { hasSetChecked } = this.state;
    if (!hasSetChecked) {
      if (params.status && params.status === 2) {
        this.setState({
          checked: true,
          hasSetChecked: true,
        });
      } else if (params.status && params.status === 1) {
        this.setState({
          checked: false,
          hasSetChecked: true,
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addUser/reset',
      payload: {
        current: 0,
        dataType: '',
      },
    });
  }

  onChange = e => {
    this.setState({
      checked: e.target.checked,
    });
  };

  random = () => {
    const { form } = this.props;
    const len = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWWXYZabcdefghijklmnopqrstuvwwxyz0123456789';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i += 1) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    form.setFieldsValue({
      password: pwd,
    });
  };

  copy = () => {
    const input = document.getElementById('password');
    input.setAttribute('type', 'text');
    input.select();
    document.execCommand('copy');
    input.setAttribute('type', 'password');
    message.destroy();
    message.success('复制成功！');
  };

  submit = () => {
    const {
      dispatch,
      route,
      form,
      addUser: { params },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.status) {
          Object.defineProperty(values, 'status', {
            value: 2,
          });
        } else {
          Object.defineProperty(values, 'status', {
            value: 1,
          });
        }
        dispatch({
          type: 'addUser/submit',
          payload: {
            params: { ...params, ...values },
            routeName: route.name,
          },
        });
      }
    });
  };

  back() {
    const { history } = this.props;
    Modal.confirm({
      title: '警告',
      content: '返回用户管理页面，当前信息将不会被保存，是否返回？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        history.goBack();
      },
    });
  }

  renderForm() {
    const {
      addUser: { params },
      route,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
    const { checked } = this.state;
    return (
      <Form onSubmit={this.submit} style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.addUser.account.label" />}>
          {getFieldDecorator('account', {
            initialValue: params.account,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.addUser.account.required' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'validation.addUser.account.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        {route.name === 'usersAdd' && (
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.addUser.password.label" />}
          >
            {getFieldDecorator('password', {
              initialValue: params.password,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.addUser.password.required' }),
                },
                {
                  pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,24}$/,
                  message: formatMessage({ id: 'validation.addUser.password.pattern' }),
                },
                {
                  min: 6,
                  message: formatMessage({ id: 'validation.addUser.password.min' }),
                },
                {
                  max: 24,
                  message: formatMessage({ id: 'validation.addUser.password.max' }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" maxLength="24" />)}
            <a style={{ marginRight: 10 }} onClick={() => this.random()}>
              随机生成
            </a>
            <a onClick={() => this.copy()}>复制</a>
          </FormItem>
        )}
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.addUser.name.label" />}>
          {getFieldDecorator('name', {
            initialValue: params.name,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.addUser.name.required' }),
              },
              {
                pattern: /^((?![0-9]).)*$/,
                message: formatMessage({ id: 'validation.addUser.name.pattern' }),
              },
              {
                max: 20,
                message: formatMessage({ id: 'validation.addUser.name.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.addUser.phone.label" />}>
          {getFieldDecorator('phone', {
            initialValue: params.phone,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.addUser.phone.required' }),
              },
              {
                pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
                message: formatMessage({ id: 'validation.addUser.phone.pattern' }),
              },
              {
                max: 11,
                message: formatMessage({ id: 'validation.addUser.phone.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.addUser.email.label" />}>
          {getFieldDecorator('email', {
            initialValue: params.email,
            rules: [
              {
                type: 'email',
                message: formatMessage({ id: 'validation.addUser.email.type' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form.addUser.status.label" />}>
          {getFieldDecorator('status', {
            initialValue: params.status,
          })(
            <Checkbox checked={checked} onChange={this.onChange}>
              停用
            </Checkbox>
          )}
        </FormItem>
      </Form>
    );
  }

  render() {
    const { location, submitting } = this.props;
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper tabActiveKey={location.pathname} action={buttonList}>
        <Card bordered={false}>
          <Fragment>
            <div className="steps-content">{this.renderForm()}</div>
            <div className={styles.stepsAction}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                onClick={() => this.submit()}
              >
                提交
              </Button>
            </div>
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AddUser;
