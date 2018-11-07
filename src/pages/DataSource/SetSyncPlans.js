import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Card, message } from 'antd';
import styles from './AddDataSource.less';

const Option = Select.Option;
const FormItem = Form.Item;

@connect(({ accessData, loading }) => ({
  accessData,
}))
@Form.create()
class SetSyncPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timeRate: '分钟',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { submit } = this.props;
    const { timeRate } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.syncAddDto.timeSet = `${values.timeNum}-${timeRate}`;
        delete values.timeNum;
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

  changeTimeRate = value => {
    this.setState({
      timeRate: value,
    });
  };

  render() {
    const { params } = this.props;
    const timeArr = params.syncAddDto.timeSet.split('-');
    const { syncModeList, syncRateList, timeList } = this.props.accessData;
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
            每
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
                addonAfter={
                  <Select
                    onChange={this.changeTimeRate}
                    defaultValue={timeArr[1]}
                    disabled={getFieldValue('syncAddDto.syncRate') === '实时'}
                    style={{ width: 80 }}
                  >
                    {timeList.map(d => (
                      <Option key={d.value}>{d.key}</Option>
                    ))}
                  </Select>
                }
                style={{ width: 150, marginLeft: 5, marginRight: 5 }}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.syncAddDto.stopNum.label" />}
          >
            报错
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
            次后自动停止服务
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
