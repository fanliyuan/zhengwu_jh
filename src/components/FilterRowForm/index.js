import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, DatePicker, Row, Col, Cascader, Checkbox } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

@Form.create()
class FilterRowForm extends PureComponent {
  handleSearch = () => {
    const { actions, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const fieldsForm = fieldsValue;
      let paramsTime = {};
      if (fieldsForm.date) {
        paramsTime = {
          beginTime: moment(fieldsForm.date[0]).format('YYYY-MM-DD'),
          endTime: moment(fieldsForm.date[1]).format('YYYY-MM-DD'),
        };
      }
      actions.handleSearch(fieldsForm, paramsTime);
    });
  };

  handleFormReset = () => {
    const { actions, form } = this.props;
    const fieldsForm = {};
    const paramsTime = {};
    form.resetFields();
    actions.handleSearch(fieldsForm, paramsTime);
  };

  render() {
    const {
      form: { getFieldDecorator },
      formData,
      data,
    } = this.props;
    const RowForm = [];
    formData.data.map(item =>
      RowForm.push(
        <Row gutter={{ md: formData.md, lg: formData.lg, xl: formData.xl }} key={item.key}>
          {item.data.map(compent => {
            switch (compent.type) {
              case 'Select':
                return (
                  <Col md={formData.md} sm={formData.lg} key={compent.prop}>
                    <FormItem label={compent.label} key={compent.prop}>
                      {getFieldDecorator(compent.prop, {
                        initialValue: data[compent.prop],
                      })(
                        <Select style={{ width: '100%' }} {...compent.typeOptions}>
                          {compent.options.map(option => {
                            if (option.OptGroup) {
                              return (
                                <OptGroup label={option.label} key={option.label}>
                                  {option.options.map(op => (
                                    <Option value={op.value} key={op.value}>
                                      {op.key}
                                    </Option>
                                  ))}
                                </OptGroup>
                              );
                            }
                            return (
                              <Option value={option.value} key={option.value}>
                                {option.key}
                              </Option>
                            );
                          })}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                );
              case 'RangePicker':
                return (
                  <Col md={formData.md} sm={formData.lg} key={compent.prop}>
                    <FormItem label={compent.label}>
                      {getFieldDecorator(compent.prop, {
                        initialValue: data[compent.prop],
                      })(
                        <RangePicker
                          style={{ width: '100%' }}
                          placeholder={['开始时间', '结束时间']}
                        />
                      )}
                    </FormItem>
                  </Col>
                );
              case 'Cascader':
                return (
                  <Col md={formData.md} sm={formData.lg} key={compent.prop}>
                    <FormItem label={compent.label}>
                      {getFieldDecorator(compent.prop, {
                        initialValue: data[compent.prop],
                      })(<Cascader {...compent.typeOptions} />)}
                    </FormItem>
                  </Col>
                );
              case 'Checkbox':
                return (
                  <Col md={formData.md} sm={formData.lg} key={compent.prop}>
                    <FormItem label={compent.label}>
                      {getFieldDecorator(compent.prop, {
                        initialValue: data[compent.prop],
                      })(<Checkbox {...compent.typeOptions} />)}
                      {compent.checkLabel}
                    </FormItem>
                  </Col>
                );
              default:
                return (
                  <Col md={formData.md} sm={formData.lg} key={compent.prop}>
                    <FormItem label={compent.label}>
                      {getFieldDecorator(compent.prop, {
                        initialValue: data[compent.prop],
                        rules: (() => {
                          if (compent.typeOptions.rules) {
                            return compent.typeOptions.rules;
                          }
                          return [];
                        })(),
                      })(<Input {...compent.typeOptions} />)}
                    </FormItem>
                  </Col>
                );
            }
          })}
        </Row>
      )
    );
    return (
      <Form layout="inline">
        {RowForm}
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
              搜索
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}
export default FilterRowForm;
