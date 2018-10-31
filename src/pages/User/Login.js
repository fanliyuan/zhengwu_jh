import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    //type: 'account',
    //autoLogin: false,
    isEmpty: false,
    isError: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  //onGetCaptcha = () =>
  //  new Promise((resolve, reject) => {
  //    this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //      if (err) {
  //        reject(err);
  //      } else {
  //        const { dispatch } = this.props;
  //        dispatch({
  //          type: 'login/getCaptcha',
  //          payload: values.mobile,
  //        })
  //          .then(resolve)
  //          .catch(reject);
  //      }
  //    });
  //  });

  handleSubmit = (err, values) => {
    if (!values.userName || !values.password) {
      this.setState({
        isEmpty: true,
        isError: false,
      });
      return;
    }
    this.setState({
      isEmpty: false,
      isError: true,
    });
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { isEmpty, isError } = this.state;
    return (
      <div className={styles.main}>
        <Login
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div
            key="account"
            tab={formatMessage({ id: 'app.login.tab-login-credentials' })}
            className={styles.form_content}
          >
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              isError &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            {isEmpty &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-empty' }))}
            <UserName name="userName" placeholder="请输入用户名" />
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
