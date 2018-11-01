import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message,
} from 'antd';
import styles from './AddDataSource.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  connecting: loading.effects['opreateDataSource/connection'],
}))
@Form.create()
class ConfigDataSource extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      connectName: '测试',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleSubmit = sub => {
    const { form } = this.props;
    //e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.connectTest(values, sub);
      }
    });
  };

  connectTest = () => {
    const connectName = '重新测试';
    const iconLoading = true;
    const { form } = this.props;
    const connectParams = form.getFieldsValue();
    this.props.connectTest(connectParams);
    this.setState({ connectName });
    this.setState({ iconLoading });
  };

  render() {
    const { dataType, params } = this.props;
    const { connecting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.dataType.label" />}
          >
            <h4>{params.type}</h4>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.name.label" />}
          >
            {getFieldDecorator('name', {
              initialValue: params.name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.dataSource.name.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.dataSource.name.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.desc.label" />}
          >
            {getFieldDecorator('describe', {
              initialValue: params.describe,
              rules: [
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.dataSource.desc.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FormattedMessage id="form.dataSource.ip.label" />}>
            {getFieldDecorator('ip', {
              initialValue: params.ip,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.dataSource.ip.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.dataSource.ip.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.port.label" />}
          >
            {getFieldDecorator('port', {
              initialValue: params.port,
              rules: [
                {
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if (!/^[0-9]+$/.test(value) && value !== '') {
                      callback(formatMessage({ id: 'validation.dataSource.port.type' }));
                    }
                    callback(errors);
                  },
                },
                {
                  required: true,
                  message: formatMessage({ id: 'validation.dataSource.port.required' }),
                },
                {
                  max: 4,
                  message: formatMessage({ id: 'validation.dataSource.port.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.username.label" />}
          >
            {getFieldDecorator('username', {
              initialValue: params.username,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.dataSource.username.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.dataSource.username.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.password.label" />}
          >
            {getFieldDecorator('password', {
              initialValue: params.password,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.dataSource.password.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.dataSource.password.max' }),
                },
              ],
            })(<Input type="password" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.dataSource.connect.label" />}
          >
            <Button
              type="primary"
              size="small"
              icon="link"
              loading={connecting}
              onClick={() => this.connectTest()}
            >
              {this.state.connectName}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default ConfigDataSource;
