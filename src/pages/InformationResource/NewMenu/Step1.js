/*
 * @Author: ChouEric
 * @Date: 2018-07-06 17:49:30
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-11-17 14:56:17
*/
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Card, Steps, Cascader, DatePicker } from 'antd';

import styles from './index.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import { isMoment } from 'moment';

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

@connect(({ informationResource }) => ({
  informationResource,
}))
@Form.create()
export default class Step1 extends PureComponent {
  state = {
    data: {
      menuName: '',
      desc: '',
      classify: '',
      providerName: '',
      innerDepartmentName: '',
      providerCode: '',
      resourceCode: '',
      formName: '',
    },
    disabled: true,
  };

  componentDidMount() {
    // if (this.props.location.pathname !== '/dataSourceManagement/checkMenu/one') {
    this.setState({
      disabled: false,
    });
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/getClassfiyList',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log(values)
      // let pTime
      // if (!err) {
      //   if(isMoment(values.updateCycle)){
      //     pTime = values.updateCycle.format('YYYY-MM-DD')
      //   }
      //   else {
      //     pTime=''
      //   }
      //   const { dispatch } = this.props
      //   dispatch({
      //     type:'informationResource/getDBInfo',
      //     payload:{...values,updateCycle:pTime},
      //   })
      // }
    });
  };

  handleBack = () => {
    const { dispatch } = this.props;
    // dispatch(routerRedux.push('/dataSourceManagement/catalog'))
    // dispatch(routerRedux.push('/dataSourceManagement/catalogManagement'))
  };

  handleNext = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/dataSourceManagement/checkMenu/two'));
  };

  handleClassfiy = val => {
    console.log(val);
  };

  TimeChange = val => {
    const { setFieldsValue } = this.props.form;
    if (isMoment(val.updateCycle)) {
      setFieldsValue({
        updateCycle: val.updateCycle.format('YYYY-MM-DD'),
      });
    } else {
      setFieldsValue({
        updateCycle: '',
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator, validateFields },
      dispatch,
      informationResource: { classfiyList },
    } = this.props;
    // console.log(classfiyList)
    const { data, disabled } = this.state;

    const onValidateForm = () => {
      validateFields(err => {
        if (!err) {
          dispatch(routerRedux.push('/dataSourceManagement/newMenu/two'));
        }
      });
    };

    const options = [
      {
        value: '0',
        label: '电子文件',
        children: [
          {
            value: '0-0',
            label: 'OFD',
          },
          {
            value: '0-1',
            label: 'wps',
          },
          {
            value: '0-2',
            label: 'xml',
          },
          {
            value: '0-3',
            label: 'txt',
          },
          {
            value: '0-4',
            label: 'doc',
          },
          {
            value: '0-5',
            label: 'docx',
          },
          {
            value: '0-6',
            label: 'html',
          },
          {
            value: '0-7',
            label: 'pdf',
          },
          {
            value: '0-8',
            label: 'ppt',
          },
        ],
      },
      {
        value: '1',
        label: '电子表格',
        children: [
          {
            value: '1-0',
            label: 'et',
          },
          {
            value: '1-1',
            label: 'xls',
          },
          {
            value: '1-2',
            label: 'xlsx',
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
        <Option value={item.id} key={item.id}>
          {item.label}
        </Option>
      );
    });
    return (
      <PageHeaderLayout>
        {/* <div className="clearfix btncls">
          <Link to="/informationResource/management" className="fr mr40">
            <Button>返回</Button>
          </Link>
        </div> */}
        <Card>
          <Steps current={0} className={styles.steps}>
            <Step title="填写信息资源内容" />
            <Step title="编辑信息项" />
            <Step title="完成" />
          </Steps>
          <Form className={styles.stepForm} onSubmit={this.handleSubmit}>
            <Item label="信息资源名称" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: data.menuName,
                rules: [{ required: true, message: '请输入名称' }],
              })(<Input placeholder="请输入名称" disabled={disabled} />)}
            </Item>
            <Item label="信息资源摘要" {...formItemLayout}>
              {getFieldDecorator('summary', {
                initialValue: data.desc,
                rules: [{ required: true, message: '请输入描述' }],
              })(<Input.TextArea placeholder="请输入描述" rows={4} readOnly={disabled} />)}
            </Item>
            <Item label="信息资源分类" {...formItemLayout}>
              {getFieldDecorator('classify', {
                initialValue: data.classify,
                rules: [{ required: true, message: '请输入选择分类' }],
              })(
                // <Select disabled={disabled}>
                //   <Option value="classify1">分类1</Option>
                //   <Option value="classify2">分类2</Option>
                //   <Option value="classify21">分类21</Option>
                // </Select>
                <Cascader
                  options={classfiyList}
                  fieldNames={{ label: 'name', value: 'id' }}
                  onChange={this.handleClassfiy}
                />
              )}
            </Item>
            <Item label="信息资源提供方" {...formItemLayout}>
              {getFieldDecorator('providerName', {
                initialValue: data.providerName,
                rules: [{ required: true, message: '请输入提供方名称' }],
              })(<Input placeholder="请输入提供方名称" disabled={disabled} />)}
            </Item>
            <Item label="提供方代码" {...formItemLayout}>
              {getFieldDecorator('providerNo', {
                initialValue: data.innerDepartmentName,
                rules: [{ required: true, message: '请输入提供方内部部门' }],
              })(<Input placeholder="请输入提供方内部部门" disabled={disabled} />)}
            </Item>
            <Item label="提供方内部部门" {...formItemLayout}>
              {getFieldDecorator('providerDept', {
                initialValue: data.providerCode,
                rules: [{ required: true, message: '请输入名称' }],
              })(<Input placeholder="请输入部门" disabled={disabled} />)}
            </Item>
            <Item label="信息资源格式" {...formItemLayout}>
              {getFieldDecorator('format', {
                initialValue: data.resourceCode,
                rules: [{ required: true, message: '请输入信息资源编码' }],
              })(<Cascader options={options} />)}
              {/* <a>编码规则说明</a> */}
            </Item>
            <Item label="更新周期" {...formItemLayout}>
              {getFieldDecorator('updateCycle', {
                initialValue: data.formName,
                rules: [{ required: true, message: '请输入名称' }],
              })(
                <Select disabled={disabled}>
                  {/* <Option value="classify1">分类1</Option>
                  <Option value="classify2">分类2</Option>
                  <Option value="classify21">分类21</Option> */}
                  {updateTimeOption}
                </Select>
              )}
            </Item>
            <Item label="发布日期" {...formItemLayout}>
              {getFieldDecorator('publishTime', {
                initialValue: data.providerCode,
                rules: [{ required: true, message: '请输入名称' }],
              })(<DatePicker onChange={this.TimeChange} />)}
            </Item>
            <Item label="关联资源代码" {...formItemLayout}>
              {getFieldDecorator('relateCode', {
                initialValue: data.providerCode,
                rules: [{ required: true, message: '请输入名称' }],
              })(<Input placeholder="请输入名称" disabled={disabled} />)}
            </Item>
            <div className="btnclsb">
              {/* {!disabled ? (
                <Button type="primary" onClick={onValidateForm}>
                  下一步
                </Button>
              ) : (
                <Button type="primary" onClick={this.handleNext}>
                  下一步
                </Button>
              )} */}
              <Link to="/informationResource/newMenu/two" style={{ color: 'white' }}>
                <Button
                  type="primary"
                  //  onClick={this.handleNext}
                >
                  下一步
                </Button>
              </Link>
            </div>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
