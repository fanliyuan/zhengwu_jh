import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Table, Divider, Tabs, Input } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './SourceCatalog.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ sourceCatalog, loading }) => ({
  sourceCatalog,
  loading: loading.effects['sourceCatalog/fetch'],
  confirmLoading: loading.effects['sourceCatalog/subscribe'],
}))
@Form.create()
class SourceCatalog extends Component {
  columns = [
    {
      title: '信息资源代码',
      align: 'center',
      dataIndex: 'resourceCode',
    },
    {
      title: '信息资源名称',
      align: 'center',
      dataIndex: 'resourceName',
    },
    {
      title: '资源属性分类',
      align: 'center',
      dataIndex: 'resourceProjectCatalogType',
    },
    {
      title: '发布节点',
      align: 'center',
      dataIndex: 'nodeName',
    },
    {
      title: '关联数据名称',
      align: 'center',
      dataIndex: 'mountResourceName',
    },
    {
      title: '关联数据类型',
      align: 'center',
      dataIndex: 'mountResourceId',
      render: text => {
        let dataType;
        if (text.indexOf('db') !== -1) {
          dataType = `数据库`;
        } else if (text.indexOf('ftp') !== -1) {
          dataType = `文件`;
        } else if (text.indexOf('file') !== -1) {
          dataType = `文件`;
        } else {
          dataType = `数据类型错误`;
        }
        return dataType;
      },
    },
    {
      title: '共享时间',
      align: 'center',
      dataIndex: 'shareTime',
    },
    {
      title: '订阅是否需发布方授权',
      align: 'center',
      dataIndex: 'subscriptionAuth',
      render: text => {
        switch (text) {
          case '0':
            return <span style={{ color: '#5cadff' }}>否</span>;
          case '1':
            return <span style={{ color: '#ed4014' }}>是</span>;
          default:
            return <span>授权码错误</span>;
        }
      },
    },
    {
      title: '订阅状态',
      align: 'center',
      dataIndex: 'orderStatus',
      render: text => {
        switch (text) {
          case '待审核':
            return <span style={{ color: '#5cadff' }}>待审核</span>;
          case '未订阅':
            return <span style={{ color: '#999999' }}>未订阅</span>;
          case '已订阅':
            return <span style={{ color: '#19be6b' }}>已订阅</span>;
          case '已拒绝':
            return <span style={{ color: '#ed4014' }}>已拒绝</span>;
          default:
            return <span>状态错误</span>;
        }
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.orderStatus === '未订阅' && (
            <Fragment>
              <a onClick={() => this.handleOrder(record)}>订阅</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.orderStatus === '已拒绝' && (
            <Fragment>
              <a onClick={() => this.handleOrder(record)}>重新订阅</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          <a
            onClick={() =>
              router.push(
                `/subscribe/sourceCatalog/infoResource/${record.resourceId}/${
                  record.mountResourceId
                }`
              )
            }
          >
            信息资源
          </a>
        </Fragment>
      ),
    },
  ];

  columns1 = [
    {
      title: '信息资源代码',
      align: 'center',
      dataIndex: 'resourceCode',
    },
    {
      title: '信息资源名称',
      align: 'center',
      dataIndex: 'resourceName',
    },
    {
      title: '资源属性分类',
      align: 'center',
      dataIndex: 'resourceProjectCatalogType',
    },
    {
      title: '发布节点',
      align: 'center',
      dataIndex: 'nodeName',
    },
    {
      title: '关联数据名称',
      align: 'center',
      dataIndex: 'mountResourceName',
    },
    {
      title: '关联数据类型',
      align: 'center',
      dataIndex: 'mountResourceId',
      render: text => {
        let dataType;
        if (text.indexOf('db') !== -1) {
          dataType = `数据库`;
        } else if (text.indexOf('ftp') !== -1) {
          dataType = `文件`;
        } else if (text.indexOf('file') !== -1) {
          dataType = `文件`;
        } else {
          dataType = `数据类型错误`;
        }
        return dataType;
      },
    },
    {
      title: '共享时间',
      align: 'center',
      dataIndex: 'shareTime',
    },
    {
      title: '申请是否需发布方授权',
      align: 'center',
      dataIndex: 'subscriptionAuth',
      render: text => {
        switch (text) {
          case '0':
            return <span style={{ color: '#5cadff' }}>否</span>;
          case '1':
            return <span style={{ color: '#ed4014' }}>是</span>;
          default:
            return <span>授权码错误</span>;
        }
      },
    },
    {
      title: '申请状态',
      align: 'center',
      dataIndex: 'orderStatus',
      render: text => {
        switch (text) {
          case '待审核':
            return <span style={{ color: '#5cadff' }}>待审核</span>;
          case '未订阅':
            return <span style={{ color: '#999999' }}>未订阅</span>;
          case '已订阅':
            return <span style={{ color: '#19be6b' }}>已订阅</span>;
          case '已拒绝':
            return <span style={{ color: '#ed4014' }}>已拒绝</span>;
          default:
            return <span>状态错误</span>;
        }
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => router.push(`/subscribe/portDetail/${record.resourceId}`)}>接口详情</a>
          <Divider type="vertical" />
          <a
            onClick={() =>
              router.push(
                `/subscribe/sourceCatalog/infoResource/${record.resourceId}/${
                  record.mountResourceId
                }`
              )
            }
          >
            信息资源
          </a>
        </Fragment>
      ),
    },
  ];

  state = {
    visible: false,
    record: {},
  };

  componentDidMount() {
    let fields;
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = {};
      formTime = {};
      fields = { ...formValues };
    } else {
      fields = { ...formValues };
      Object.defineProperty(fields, 'date', {
        value: ``,
      });
    }
    dispatch({
      type: 'sourceCatalog/getNodes',
    });
    dispatch({
      type: 'sourceCatalog/fetch',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
    dispatch({
      type: 'sourceCatalog/getSourceClassfiyList',
    });
  }

  componentWillUnmount() {
    const { route } = this.props;
    sessionStorage.setItem('currentList', route.name);
  }

  handleOrder = record => {
    this.setState({
      visible: true,
      record,
    });
  };

  handleOk = e => {
    e.preventDefault();
    let dataType;
    const { dispatch, form } = this.props;
    const { record } = this.state;
    const values = {
      ...paramsPage,
      ...formValues,
      ...formTime,
    };
    if (record.mountResourceId.indexOf('db') !== -1) {
      dataType = `db`;
    } else if (record.mountResourceId.indexOf('ftp') !== -1) {
      dataType = `ftp`;
    } else if (record.mountResourceId.indexOf('file') !== -1) {
      dataType = `file`;
    } else {
      dataType = '';
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        catalogId: record.typeId,
        dataType,
        directoryName: record.resourceProjectCatalogType,
        dsID: record.resourceId,
        dsName: record.resourceName,
        kafkaTopic: record.kafkaTopic,
        mountResourceId: record.mountResourceId,
        mountResourceName: record.mountResourceName,
        publishInstitution: record.nodeName,
        publisherID: record.nodeId,
        subscribeName: fieldsValue.subscribeName,
        subscriptionAuth: record.subscriptionAuth,
        synchronizationType: record.synchronizationType,
      };
      dispatch({
        type: 'sourceCatalog/subscribe',
        payload: {
          values,
          item: {
            ...params,
          },
        },
        callback: res => {
          if (res.code < 300 && res.code >= 0) {
            setTimeout(() => {
              this.setState({
                visible: false,
                record: {},
              });
            }, 20);
          }
        },
      });
    });
  };

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      visible: false,
      record: {},
    });
  };

  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    const fields = fieldsForm;
    formValues = { ...fieldsForm };
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.typeIds) {
      const typeArr = ['classId', 'projectId', 'catalogId', 'typeId'];
      fields.typeIds.map((item, index) =>
        Object.defineProperty(fields, typeArr[index], {
          value: JSON.stringify(item),
          enumerable: true,
        })
      );
      Object.defineProperty(fields, 'typeIds', {
        value: ``,
      });
    }
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
    };
    dispatch({
      type: 'sourceCatalog/fetch',
      payload: values,
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'sourceCatalog/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  renderOrderForm(record) {
    const {
      form: { getFieldDecorator },
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
      <Form onSubmit={this.handleOk} style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label="订阅名称">
          {getFieldDecorator('subscribeName', {
            initialValue: `${record.resourceProviderName}：${record.resourceName}`,
            rules: [
              {
                max: 50,
                message: '订阅名称不能超过50个字符！',
              },
              {
                required: true,
                message: '请填写订阅名称！',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="同步模式">
          {getFieldDecorator('synchronizationType', {
            initialValue: record.synchronizationType,
          })(<span>{record.synchronizationType}</span>)}
        </FormItem>
      </Form>
    );
  }

  renderForm(type) {
    let name;
    const {
      sourceCatalog: { sourceClassfiyList, pubNodes },
    } = this.props;
    const nodes = [
      {
        key: '全部',
        value: '',
      },
    ];
    if (type === 1) {
      name = '订阅';
    } else {
      name = '申请';
    }
    pubNodes.map(item =>
      nodes.push({
        key: item.nodeName,
        value: item.nodeName,
      })
    );
    const formData = {
      md: 8,
      lg: 24,
      xl: 48,
      data: [
        {
          key: 1,
          data: [
            {
              prop: 'resourceCode',
              label: '信息资源代码',
              typeOptions: {
                placeholder: '请输入信息资源代码',
                maxLength: 50,
              },
            },
            {
              prop: 'resourceName',
              label: '信息资源名称',
              typeOptions: {
                placeholder: '请输入信息资源名称',
                maxLength: 50,
              },
            },
            {
              type: 'Cascader',
              prop: 'typeIds',
              label: '资源属性分类',
              typeOptions: {
                options: sourceClassfiyList,
                fieldNames: { label: 'name', value: 'id' },
                placeholder: '请选择资源属性分类',
              },
            },
          ],
        },
        {
          key: 2,
          data: [
            {
              type: 'Select',
              prop: 'switchNodeName',
              label: '发布节点',
              typeOptions: {
                placeholder: '请选择发布节点',
              },
              options: nodes,
            },
            {
              type: 'Select',
              prop: 'status',
              label: `${name}状态`,
              typeOptions: {
                placeholder: `请选择${name}状态`,
              },
              options: [
                {
                  key: '全部',
                  value: '',
                },
                {
                  key: '待审核',
                  value: '待审核',
                },
                {
                  key: `未${name}`,
                  value: `未${name}`,
                },
                {
                  key: `已${name}`,
                  value: `已${name}`,
                },
                {
                  key: '已拒绝',
                  value: '已拒绝',
                },
              ],
            },
            {
              type: 'RangePicker',
              prop: 'date',
              label: '共享时间',
            },
          ],
        },
      ],
    };
    const actions = {
      handleSearch: this.handleSearch,
    };
    const data = {
      ...formValues,
    };
    return <FilterRowForm formData={formData} actions={actions} data={data} />;
  }

  render() {
    const {
      sourceCatalog: { dataList, page },
      loading,
      confirmLoading,
    } = this.props;
    const { visible, record } = this.state;
    const keyArr = Object.keys(record);
    const paginationProps = {
      showQuickJumper: true,
      total: dataList.total,
      current: page,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的文件',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="共享资源" key="1">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm(1)}</div>
                <Table
                  rowKey="resourceId"
                  bordered
                  pagination={paginationProps}
                  dataSource={dataList.rows}
                  columns={this.columns}
                  loading={loading}
                  locale={locale}
                />
              </div>
              <Modal
                title="信息资源订阅"
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width={520}
                maskClosable={false}
                confirmLoading={confirmLoading}
              >
                {keyArr.length > 0 && this.renderOrderForm(record)}
              </Modal>
            </TabPane>
            <TabPane tab="API资源" key="2">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm(2)}</div>
                <Table
                  rowKey="resourceId"
                  bordered
                  pagination={paginationProps}
                  dataSource={dataList.rows}
                  columns={this.columns1}
                  loading={loading}
                  locale={locale}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SourceCatalog;
