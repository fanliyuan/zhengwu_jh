import React, { PureComponent, Fragment } from 'react';
import { Modal, Input, Radio, Form, message } from 'antd';

import styles from './index.less';

const { Item } = Form;
const { Group } = Radio;
const { TextArea } = Input;

@Form.create()
export default class ModalRadio extends PureComponent {
  state = {
    value: 1,
    disabled: false,
  };

  handleChange = e => {
    const {
      form: { setFieldsValue, getFieldsValue },
      reason = 'reason',
    } = this.props;
    this.setState(
      {
        value: e.target.value,
      },
      () => {
        setFieldsValue({ reason: undefined });
      }
    );
  };

  handleOk = () => {
    const {
      form: { validateFields },
      onOk = () => {},
      onCancel = () => {},
      name = 'name',
      reason = 'reason',
    } = this.props;
    validateFields((err, value) => {
      if (!err) {
        console.log(value);
        onOk(value);
        onCancel();
      }
    });
  };

  handleCancle = () => {
    const { onCancel = () => {} } = this.props;
    onCancel();
  };

  handleFocus = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ reason: undefined });
  };

  render() {
    const { value, disabled = false } = this.state;
    const {
      title = '操作',
      form: { getFieldDecorator },
      label = '请确认',
      name = 'name',
      reason = 'reason',
      visible = false,
    } = this.props;
    return (
      <Modal
        visible={visible}
        title={title}
        okText="确定"
        cancelText="取消"
        onOk={this.handleOk}
        maskClosable={true}
        onCancel={this.handleCancle}
      >
        <Form>
          <Item label={label} className={styles.dib}>
            {getFieldDecorator(name, {
              initialValue: 1,
            })(
              <Group onChange={this.handleChange}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Group>
            )}
          </Item>
          {value === 0 && (
            <Item label="拒绝理由">
              {getFieldDecorator(reason, {
                rules: [
                  {
                    required: true,
                    message: '请输入拒绝理由!',
                  },
                ],
              })(<TextArea onFocus={this.handleFocus} />)}
            </Item>
          )}
        </Form>
      </Modal>
    );
  }
}
