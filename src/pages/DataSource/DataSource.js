import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  tag,
} from 'antd';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './DataSource.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const resetParamsPage = { pageNum: 1, pageSize: 10 };
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ dataSource, loading }) => ({
  dataSource,
  loading: loading.effects['dataSource/fetch'],
}))
@Form.create()
class TableList extends PureComponent {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型1',
      dataIndex: 'type',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => router.push(`${this.props.match.url}/update/${record.id}`)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record.id)}>删除</a>
          <Divider type="vertical" />
          <a
            onClick={() =>
              router.push(`${this.props.match.url}/access/${record.id}/${record.type}`)
            }
          >
            接入数据
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch, form } = this.props;
    if (formTime !== undefined && formValues !== undefined) {
      if (formTime.beginTime) {
        formValues.date = [
          moment(formTime.beginTime, 'YYYY-MM-DD'),
          moment(formTime.endTime, 'YYYY-MM-DD'),
        ];
        form.setFieldsValue(formValues);
        delete formValues.date;
      }
    }
    form.setFieldsValue(formValues);
    dispatch({
      type: 'dataSource/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    formValues = {};
    formTime = {};
    paramsPage = { pageNum: 1, pageSize: 10 };
    dispatch({
      type: 'dataSource/fetch',
      payload: resetParamsPage,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    paramsPage = { pageNum: 1, pageSize: 10 };
    this.getFormValues();
  };

  getFormValues = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let paramsTime = {};
      if (fieldsValue.date) {
        paramsTime = {
          beginTime: moment(fieldsValue.date[0]).format('YYYY-MM-DD'),
          endTime: moment(fieldsValue.date[1]).format('YYYY-MM-DD'),
        };
        formTime = paramsTime;
        delete fieldsValue.date;
      }

      formValues = fieldsValue;

      const values = {
        ...fieldsValue,
        ...paramsPage,
        ...paramsTime,
      };

      dispatch({
        type: 'dataSource/fetch',
        payload: values,
      });
    });
  };

  handleDelete = id => {
    const { dispatch, form } = this.props;
    Modal.confirm({
      title: '警告',
      content: '是否删除数据源？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          let paramsTime = {};
          if (fieldsValue.date) {
            paramsTime = {
              beginTime: moment(fieldsValue.date[0]).format('YYYY-MM-DD'),
              endTime: moment(fieldsValue.date[1]).format('YYYY-MM-DD'),
            };
            delete fieldsValue.date;
          }

          const values = {
            ...fieldsValue,
            ...resetParamsPage,
            ...paramsTime,
          };

          dispatch({
            type: 'dataSource/deleteItem',
            payload: {
              values: values,
              item: {
                id: id,
              },
            },
          });
        });
      },
    });
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据源名称">
              {getFieldDecorator('name')(<Input maxLength="50" placeholder="请输入数据源名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="数据类型">
              {getFieldDecorator('type')(
                <Select style={{ width: '100%' }} placeholder="请选择数据类型">
                  <OptGroup label="数据库类型">
                    <Option value="mysql">mysql</Option>
                    <Option value="sqlserver">sqlserver</Option>
                    <Option value="oracle">oracle</Option>
                    <Option value="dm">dm</Option>
                    <Option value="kingbase">kingbase</Option>
                  </OptGroup>
                  <OptGroup label="半结构文件类型">
                    <Option value="ftp">ftp</Option>
                    <Option value="sftp">sftp</Option>
                    <Option value="本地文件上传">文件</Option>
                  </OptGroup>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.renderAdvancedForm();
  }

  changePage = (current, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: current, pageSize: pageSize };
    dispatch({
      type: 'dataSource/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  render() {
    const {
      dataSource: { data, page },
      loading,
    } = this.props;
    let paginationProps = {
      showQuickJumper: true,
      total: data.totalCounts,
      current: page,
      onChange: this.changePage,
      pageSize: 10,
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的数据源',
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => router.push(`${this.props.match.url}/add`)}
              >
                新建
              </Button>
            </div>
            <Table
              rowKey="id"
              bordered
              columns={this.columns}
              dataSource={data.datas}
              pagination={paginationProps}
              locale={locale}
              loading={loading}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
