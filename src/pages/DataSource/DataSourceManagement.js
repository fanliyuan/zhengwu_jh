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

import styles from './DataSourceManagement.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option, OptGroup } = Select;
const resetParamsPage = { pageNum: 1, pageSize: 10 };
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ dataSourceManagement, loading }) => ({
  dataSourceManagement,
  loading: loading.effects['dataSourceManagement/fetch'],
  loadingDelete: loading.effects['dataSourceManagement/deleteItem'],
  loadingCancel: loading.effects['dataSourceManagement/cancel'],
}))
@Form.create()
class TableList extends PureComponent {
  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        const { dataSourceManagement } = this.props;
        return `${index + 1 + (dataSourceManagement.page - 1) * 10}`;
      },
    },
    {
      title: '数据名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      render: text => {
        if (text === 'file') {
          return '文件';
        }
        return text;
      },
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作人',
      dataIndex: 'createUserName',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      render: text => {
        switch (text) {
          case -1:
            return <span style={{ color: '#5cadff' }}>待审核</span>;
          case -11:
            return <span style={{ color: '#5cadff' }}>修改待审核</span>;
          case -21:
            return <span style={{ color: '#5cadff' }}>删除待审核</span>;
          case 0:
            return <span style={{ color: '#ed4014' }}>已拒绝</span>;
          case 10:
            return <span style={{ color: '#ed4014' }}>修改已拒绝</span>;
          case 20:
            return <span style={{ color: '#ed4014' }}>删除已拒绝</span>;
          case 1:
            return <span style={{ color: '#19be6b' }}>已通过</span>;
          default:
            return <span>无状态</span>;
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {record.zy &&
            record.resourceId !== '' && (
              <Fragment>
                <a
                  onClick={() =>
                    router.push(
                      `/data/management/infoSource${record.type}/${record.id}/${record.resourceId}`
                    )
                  }
                >
                  信息资源
                </a>
                <Divider type="vertical" />
              </Fragment>
            )}
          {record.sj && (
            <Fragment>
              <a
                onClick={() => {
                  const { match } = this.props;
                  switch (record.type) {
                    case 'db':
                      return router.push(`${match.url}/dbview/${record.id}`);
                    case 'ftp':
                      return router.push(`${match.url}/ftpview/${record.id}`);
                    case 'file':
                      return router.push(`${match.url}/fileview/${record.id}`);
                    default:
                      message.destroy();
                      return message.error('无法查看数据，缺少数据类型！');
                  }
                }}
              >
                数据
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.rw && (
            <Fragment>
              <a
                onClick={() => {
                  const { match } = this.props;
                  return router.push(`${match.url}/update/${record.id}`);
                }}
              >
                任务
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.xg && (
            <Fragment>
              <a
                onClick={() => {
                  const { match } = this.props;
                  if (record.resourceId !== '') {
                    message.destroy();
                    return message.error('已关联数据，禁止修改！');
                  }
                  return router.push(`${match.url}/update/${record.type}/${record.id}`);
                }}
              >
                修改
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.cxxg && (
            <Fragment>
              <a
                onClick={() => {
                  const { match } = this.props;
                  if (record.resourceId !== '') {
                    message.destroy();
                    return message.error('已关联数据，禁止修改！');
                  }
                  return router.push(`${match.url}/update/${record.type}/${record.id}`);
                }}
              >
                重新修改
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.cxjr && (
            <Fragment>
              <a
                onClick={() => {
                  const { match } = this.props;
                  if (record.resourceId !== '') {
                    message.destroy();
                    return message.error('已关联数据，禁止修改！');
                  }
                  return router.push(`${match.url}/update/${record.type}/${record.id}`);
                }}
              >
                重新接入
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.sc && (
            <Fragment>
              <a onClick={() => this.handleDelete(record.id, record.type)}>删除</a>
            </Fragment>
          )}
          {record.cxsc && (
            <Fragment>
              <a onClick={() => this.handleDelete(record.id, record.type)}>重新删除</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.qx && (
            <Fragment>
              <a onClick={() => this.handleCancel(record.id, record.type, record.status)}>取消</a>
            </Fragment>
          )}
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
      type: 'dataSourceManagement/fetch',
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
      type: 'dataSourceManagement/fetch',
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
        type: 'dataSourceManagement/fetch',
        payload: values,
      });
    });
  };

  handleDelete = (id, type) => {
    const { dispatch, form, loadingDelete } = this.props;
    const item = {
      id,
      type,
    };
    return Modal.confirm({
      title: '警告',
      content: '是否删除数据？',
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
              type: 'dataSourceManagement/deleteItem',
              payload: {
                values: {
                  ...values,
                },
                item,
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

  handleCancel = (id, type, status) => {
    let content;
    const { dispatch, form, loadingCancel } = this.props;
    const item = {
      id,
      type,
    };

    if (status === 10) {
      content = '是否取消修改？';
    } else {
      content = '是否取消删除？';
    }

    return Modal.confirm({
      title: '警告',
      content,
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
              ...paramsPage,
              ...paramsTime,
            };

            dispatch({
              type: 'dataSourceManagement/cancel',
              payload: {
                values: {
                  ...values,
                },
                item,
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
      type: 'dataSourceManagement/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const selectedIds = [];
    selectedRows.map(item => {
      selectedIds.push({
        id: item.id,
        type: item.type,
      });
      return selectedIds;
    });
    this.setState({
      selectedIds,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据名称">
              {getFieldDecorator('name')(<Input maxLength="50" placeholder="请输入数据源名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作人">
              {getFieldDecorator('createUserName')(
                <Input maxLength="50" placeholder="请输入操作人" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="更新时间">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据类型">
              {getFieldDecorator('dataType')(
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
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} placeholder="请选择审核状态">
                  <Option value="">全部</Option>
                  <Option value="-1">待审核</Option>
                  <Option value="-11">修改待审核</Option>
                  <Option value="-21">删除待审核</Option>
                  <Option value="0">已拒绝</Option>
                  <Option value="10">修改已拒绝</Option>
                  <Option value="20">删除已拒绝</Option>
                  <Option value="1">已通过</Option>
                </Select>
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
      dataSourceManagement: { data, page },
      loading,
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
      emptyText: '很遗憾，没有搜索到匹配的数据',
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey={record => record.id + record.dataType}
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
