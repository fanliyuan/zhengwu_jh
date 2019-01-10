import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Table, Modal, Radio, Input, Popconfirm } from 'antd';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './ResourceAudit.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues = { mount: false };
let formTime;

@connect(({ subAuth, sourceCatalog, loading }) => ({
  subAuth,
  sourceCatalog,
  loading: loading.effects['subAuth/getSubAuthList'],
  confirmLoading: loading.effects['subAuth/setSubAuth'],
}))
@Form.create()
export default class SubAuth extends Component {
  columns = [
    {
      dataIndex: 'index',
      align: 'center',
      title: '序号',
      render: (text, record, index) => {
        const { subAuth } = this.props;
        return `${index + 1 + (subAuth.page - 1) * 10}`;
      },
    },
    {
      dataIndex: 'dsName',
      align: 'center',
      title: '信息资源名称',
    },
    {
      dataIndex: 'mountResourceName',
      align: 'center',
      title: '关联数据名称',
    },
    {
      dataIndex: 'dataType',
      align: 'center',
      title: '数据类型',
    },
    {
      dataIndex: 'subscriberName',
      align: 'center',
      title: '订阅节点',
    },
    {
      dataIndex: 'subTime',
      align: 'center',
      title: '订阅时间',
    },
    {
      dataIndex: 'status',
      align: 'center',
      title: '授权状态',
      render: text => {
        switch (text) {
          case -1:
            return <span style={{ color: '#5cadff' }}>待授权</span>;
          case 0:
            return <span style={{ color: '#ed4014' }}>已拒绝</span>;
          case 1:
            return <span style={{ color: '#19be6b' }}>已授权</span>;
          default:
            return <span>无状态</span>;
        }
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (_, row) => (
        <Fragment>
          <a className="mr16" onClick={this.handleGoView.bind(this, row)}>
            查看
          </a>
          {row.status === -1 ? (
            <a onClick={this.handleAuthModalShow.bind(this, row)}>授权</a>
          ) : row.subscriptionAuth === 9999 ? (
            <Popconfirm title="请确认取消授权" onConfirm={() => this.cancelAuth(row)}>
              <a>取消授权</a>
            </Popconfirm>
          ) : (
            ''
          )}
        </Fragment>
      ),
    },
  ];

  state = {
    row: {},
    modalVisible: false,
    status: 1,
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
      type: 'subAuth/getSubAuthList',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
  }

  handleGoView = row => {
    // 信息资源id 关联数据id 订阅id  subscriberID
    router.push(
      `viewAuth/${row.dsId || 0}/${row.mountId || 0}/${row.subId || 0}/${row.subscriberId || 0}`
    );
  };

  handleAuthModalShow = row => {
    this.setState({
      modalVisible: true,
      row: { ...row },
    });
  };

  handleAuthModalHide = e => {
    e.preventDefault();
    const { form } = this.props;
    this.setState({
      modalVisible: false,
      row: {},
    });
    setTimeout(() => {
      this.setState({
        status: 1,
      });
      form.setFieldsValue({
        status: 1,
      });
    }, 20);
  };

  handleOk = e => {
    e.preventDefault();
    const {
      row: { dsId: dsID, subId: subID, subscriberId: subscriberID },
    } = this.state;
    const { dispatch, form } = this.props;
    const values = {
      ...paramsPage,
      ...formValues,
      ...formTime,
    };
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'subAuth/setSubAuth',
        payload: {
          values,
          item: {
            codeReply: fieldsValue.status,
            reason: fieldsValue.reason,
            dsID,
            subID,
            subscriberID,
          },
        },
        callback: res => {
          if (res.code < 300) {
            this.setState({
              modalVisible: false,
              row: {},
            });
            setTimeout(() => {
              this.setState({
                status: 1,
              });
              form.setFieldsValue({
                status: 1,
              });
            }, 20);
          }
        },
      });
    });
  };

  cancelAuth = row => {
    console.log('取消授权', row); // eslint-disable-line
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'subAuth/getSubAuthList',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  onChangeStatus = e => {
    e.preventDefault();
    this.setState({
      status: e.target.value,
    });
  };

  @Bind()
  @Throttle(300, { trailing: false })
  handleSearch(fieldsForm, paramsTime) {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    const fields = fieldsForm;
    formValues = { ...fieldsForm };
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
    };
    dispatch({
      type: 'subAuth/getSubAuthList',
      payload: values,
    });
  }

  renderAuditForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { status } = this.state;
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
    const formTailLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24, offset: 24 },
        sm: { span: 12, offset: 7 },
        md: { span: 10, offset: 7 },
      },
    };
    return (
      <Form onSubmit={this.handleOk} style={{ marginTop: 8 }}>
        <FormItem {...formTailLayout}>
          {getFieldDecorator('status', {
            initialValue: status,
          })(
            <RadioGroup onChange={this.onChangeStatus}>
              <Radio value={1}>通过</Radio>
              <Radio value={0}>拒绝</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {status === 1 && (
          <FormItem {...formTailLayout}>
            <span style={{ fontSize: 16 }}>你是否确定通过此次授权？</span>
          </FormItem>
        )}
        {status === 0 && (
          <FormItem {...formItemLayout} label="请输入拒绝理由">
            {getFieldDecorator('reason', {
              rules: [
                {
                  max: 500,
                  message: '拒绝理由不能超过500个字符！',
                },
                {
                  required: true,
                  message: '请填写拒绝理由！',
                },
              ],
            })(<TextArea rows={4} />)}
          </FormItem>
        )}
      </Form>
    );
  }

  renderForm() {
    const {
      sourceCatalog: { pubNodes },
    } = this.props;
    const nodes = [
      {
        key: '全部',
        value: '',
      },
    ];
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
              prop: 'dsName',
              label: '信息资源名称',
              typeOptions: {
                placeholder: '请输入信息资源名称',
                maxLength: 50,
              },
            },
            {
              prop: 'mountResourceName',
              label: '关联数据名称',
              typeOptions: {
                placeholder: '请输入关联数据名称',
                maxLength: 50,
              },
            },
            {
              type: 'RangePicker',
              prop: 'date',
              label: '订阅时间',
            },
          ],
        },
        {
          key: 2,
          data: [
            {
              type: 'Select',
              prop: 'dataType',
              label: '数据类型',
              typeOptions: {
                placeholder: '请选择数据类型',
              },
              options: [
                {
                  key: '全部',
                  value: '',
                },
                {
                  key: 'mysql',
                  value: 'mysql',
                },
                {
                  key: 'sqlserver',
                  value: 'sqlserver',
                },
                {
                  key: 'oracle',
                  value: 'oracle',
                },
                {
                  key: 'dm',
                  value: 'dm',
                },
                {
                  key: 'kingbase',
                  value: 'kingbase',
                },
                {
                  key: 'ftp',
                  value: 'ftp',
                },
                {
                  key: 'sftp',
                  value: 'sftp',
                },
                {
                  key: 'file',
                  value: '文件',
                },
              ],
            },
            {
              type: 'Select',
              prop: 'subscriberName',
              label: '订阅节点',
              typeOptions: {
                placeholder: '请选择订阅节点',
              },
              options: nodes,
            },
            {
              type: 'Select',
              prop: 'subscribeStatus',
              label: '审核状态',
              typeOptions: {
                placeholder: '请选择审核状态',
              },
              options: [
                {
                  key: '全部',
                  value: '',
                },
                {
                  key: '待审核',
                  value: -1,
                },
                {
                  key: '已拒绝',
                  value: 0,
                },
                {
                  key: '已通过',
                  value: 1,
                },
              ],
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
    const { modalVisible } = this.state;
    const {
      subAuth: { dataList, page },
      loading,
      confirmLoading,
    } = this.props;
    const paginationProps = {
      showQuickJumper: true,
      total: dataList.totalCounts,
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
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey="id"
              bordered
              pagination={paginationProps}
              dataSource={dataList.datas}
              columns={this.columns}
              loading={loading}
              locale={locale}
            />
          </div>
          <Modal
            title="审核"
            visible={modalVisible}
            onOk={this.handleOk}
            onCancel={this.handleAuthModalHide}
            width={520}
            maskClosable={false}
            confirmLoading={confirmLoading}
          >
            {this.renderAuditForm()}
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
