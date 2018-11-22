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
  Button,
  DatePicker,
  Modal,
  Divider,
  Table,
  message,
} from 'antd';
import router from 'umi/router';
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
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        const { dataSource } = this.props;
        return `${index + 1 + (dataSource.page - 1) * 10}`;
      },
    },
    {
      title: '数据源名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      render: text => {
        if (text === 'file') {
          return '文件';
        }
        return text;
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              if (!record.xg) {
                return message.error('已接入数据，禁止修改！');
              }
              const { match } = this.props;
              return router.push(`${match.url}/update/${record.id}`);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record.id, record.sc)}>删除</a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              const { match } = this.props;
              router.push(`${match.url}/access/${record.id}`);
            }}
          >
            接入数据
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, form, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = {};
      formTime = {};
    } else {
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
    }
    dispatch({
      type: 'dataSource/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  }

  componentWillUnmount() {
    const { route } = this.props;
    sessionStorage.setItem('currentList', route.name);
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
      const fieldsForm = fieldsValue;
      let paramsTime = {};
      if (fieldsForm.date) {
        paramsTime = {
          beginTime: moment(fieldsForm.date[0]).format('YYYY-MM-DD'),
          endTime: moment(fieldsForm.date[1]).format('YYYY-MM-DD'),
        };
        formTime = paramsTime;
        delete fieldsForm.date;
      }

      formValues = fieldsForm;

      const values = {
        ...fieldsForm,
        ...paramsPage,
        ...paramsTime,
      };

      dispatch({
        type: 'dataSource/fetch',
        payload: values,
      });
    });
  };

  handleDelete = (id, sc) => {
    if (!sc) {
      return message.error('已接入数据，禁止删除！');
    }
    const { dispatch, form } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '是否删除数据源？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise((resolve, reject) => {
          form.validateFields((err, fieldsValue) => {
            if (err) return;
            const fieldsForm = fieldsValue;
            let paramsTime = {};
            if (fieldsForm.date) {
              paramsTime = {
                beginTime: moment(fieldsForm.date[0]).format('YYYY-MM-DD'),
                endTime: moment(fieldsForm.date[1]).format('YYYY-MM-DD'),
              };
              delete fieldsForm.date;
            }

            const values = {
              ...fieldsForm,
              ...resetParamsPage,
              ...paramsTime,
            };

            dispatch({
              type: 'dataSource/deleteItem',
              payload: {
                values,
                item: {
                  id,
                },
              },
              callback: res => {
                if (res.code < 300) {
                  resolve();
                } else {
                  reject();
                }
              },
            });
          });
        }),
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'dataSource/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="数据源名称">
              {getFieldDecorator('name')(<Input maxLength="50" placeholder="请输入数据源名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('createUserName')(
                <Input maxLength="50" placeholder="请输入创建人" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="数据类型">
              {getFieldDecorator('type')(
                <Select style={{ width: '100%' }} placeholder="请选择数据类型">
                  <Option value="">全部</Option>
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
                    <Option value="file">文件</Option>
                  </OptGroup>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

  render() {
    const {
      dataSource: { data, page },
      loading,
      match,
    } = this.props;
    const paginationProps = {
      showQuickJumper: true,
      total: data.totalCounts,
      current: page,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
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
              <Button icon="plus" type="primary" onClick={() => router.push(`${match.url}/add`)}>
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
