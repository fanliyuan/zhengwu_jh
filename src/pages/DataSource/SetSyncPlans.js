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

const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ accessData, loading }) => ({
  accessData,
  loadingTable: loading.effects['accessData/setTableList'],
}))
@Form.create()
class SetSyncPlan extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { submit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.syncAddDto.timeSet = `${values.timeNum}-${values.timeRate}`;
        delete values.timeNum;
        delete values.timeRate;
        dispatch({
          type: 'accessData/updateParams',
          payload: values,
        });
        setTimeout(function() {
          submit();
        }, 500);
      }
    });
  };

  render() {
    const { params } = this.props;
    const timeArr = params.syncAddDto.timeSet.split('-');
    const { syncModeList, syncRateList, timeList } = this.props.accessData;
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
    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.syncAddDto.syncMode.label" />}
          >
            {getFieldDecorator('syncAddDto.syncMode', {
              initialValue: params.syncAddDto.syncMode,
            })(
              <Select>
                {syncModeList.map(d => (
                  <Option key={d.value}>{d.key}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.syncAddDto.syncRate.label" />}
          >
            {getFieldDecorator('syncAddDto.syncRate', {
              initialValue: params.syncAddDto.syncRate,
            })(
              <Select>
                {syncRateList.map(d => (
                  <Option key={d.value}>{d.key}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.syncAddDto.timeNum.label" />}
          >
            {getFieldDecorator('timeNum', {
              initialValue: timeArr[0],
              rules: [
                {
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if (!/^[0-9]+$/.test(value) && value !== '') {
                      callback(
                        formatMessage({ id: 'validation.accessDataSource.syncAddDto.timeNum.type' })
                      );
                    }
                    callback(errors);
                  },
                },
                {
                  max: 3,
                  message: formatMessage({
                    id: 'validation.accessDataSource.syncAddDto.timeNum.max',
                  }),
                },
              ],
            })(
              <Input
                maxLength="3"
                disabled={getFieldValue('syncAddDto.syncRate') === '实时'}
                style={{ width: 80, marginLeft: 5, marginRight: 5 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="tips">
            {getFieldDecorator('timeRate', {
              initialValue: timeArr[1],
            })(
              <Select
                disabled={getFieldValue('syncAddDto.syncRate') === '实时'}
                style={{ width: 80 }}
              >
                {timeList.map(d => (
                  <Option key={d.value}>{d.key}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.syncAddDto.stopNum.label" />}
          >
            {getFieldDecorator('syncAddDto.stopNum', {
              initialValue: params.syncAddDto.stopNum,
              rules: [
                {
                  validator(rule, value, callback, source, options) {
                    var errors = [];
                    if (!/^[0-9]+$/.test(value) && value !== '') {
                      callback(
                        formatMessage({ id: 'validation.accessDataSource.syncAddDto.stopNum.type' })
                      );
                    }
                    callback(errors);
                  },
                },
                {
                  max: 3,
                  message: formatMessage({
                    id: 'validation.accessDataSource.syncAddDto.stopNum.max',
                  }),
                },
              ],
            })(<Input maxLength="3" style={{ width: 80, marginLeft: 5, marginRight: 5 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="tips">
            <h4>0次代表永不停止</h4>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default SetSyncPlan;
