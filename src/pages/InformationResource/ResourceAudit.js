import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Divider, Card, Modal, Radio, Input } from 'antd';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './ResourceAudit.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues = { mount: false };
let formTime;

@connect(({ resourceAudit, loading }) => ({
  resourceAudit,
  loading: loading.effects['resourceAudit/fetch'],
  confirmLoading: loading.effects['resourceAudit/audit'],
}))
@Form.create()
class ResourceAudit extends Component {
  columns = [
    {
      title: '信息资源代码',
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: '信息资源名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '资源属性分类',
      align: 'center',
      dataIndex: 'typeName',
    },
    {
      title: '发布日期',
      align: 'center',
      dataIndex: 'publishTime',
    },
    {
      title: '数据已关联',
      align: 'center',
      dataIndex: 'mount',
      render: text => {
        if (text) {
          return '是';
        }
        return '否';
      },
    },
    {
      title: '信息项',
      align: 'center',
      dataIndex: 'infoCount',
    },
    {
      title: '审核状态',
      align: 'center',
      dataIndex: 'status',
      render: text => {
        switch (text) {
          case -1:
            return <span style={{ color: '#5cadff' }}>待审核</span>;
          case 0:
            return <span style={{ color: '#ed4014' }}>已拒绝</span>;
          case 1:
            return <span style={{ color: '#19be6b' }}>已通过</span>;
          default:
            return <span>无状态</span>;
        }
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.status === -1 && (
            <Fragment>
              <a onClick={() => this.handleAudit(record.id)}>审核</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.status !== -1 && (
            <Fragment>
              <a onClick={() => router.push(`/informationResource/audit/auditLog/${record.id}`)}>
                审核日志
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          <a onClick={() => router.push(`/informationResource/viewDirectory/${record.id}`)}>查看</a>
        </Fragment>
      ),
    },
  ];

  state = {
    mount: false,
    visible: false,
    status: 1,
    id: '',
  };

  componentDidMount() {
    let fields;
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = { mount: false };
      formTime = {};
      fields = { ...formValues };
    } else {
      fields = { ...formValues };
      Object.defineProperty(fields, 'date', {
        value: ``,
      });
    }
    dispatch({
      type: 'resourceAudit/fetch',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
    dispatch({
      type: 'resourceAudit/getSourceClassfiyList',
    });
  }

  componentWillUnmount() {
    const { route } = this.props;
    sessionStorage.setItem('currentList', route.name);
  }

  handleIsRelated = e => {
    this.setState({
      mount: e.target.checked,
    });
  };

  handleAudit = id => {
    this.setState({
      visible: true,
      id,
    });
  };

  handleOk = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { id } = this.state;
    const values = {
      ...paramsPage,
      ...formValues,
      ...formTime,
    };
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'resourceAudit/audit',
        payload: {
          values,
          item: {
            id,
            reviewAddDto: fieldsValue,
          },
        },
        callback: res => {
          if (res.code < 300) {
            this.setState({
              visible: false,
              id: '',
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

  handleCancel = e => {
    e.preventDefault();
    const { form } = this.props;
    this.setState({
      visible: false,
      id: '',
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

  handleSearch = (fieldsForm, paramsTime) => {
    let fields;
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    const keyArr = Object.keys(fieldsForm);
    if (keyArr.length > 0) {
      formValues = { ...fieldsForm };
      fields = fieldsForm;
    } else {
      formValues = { ...fieldsForm, mount: false };
      fields = { ...fieldsForm, mount: false };
      this.setState({
        mount: false,
      });
    }
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.typeId) {
      Object.defineProperty(fields, 'typeId', {
        value: fields.typeId.join('-'),
      });
    }
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
    };
    dispatch({
      type: 'resourceAudit/fetch',
      payload: values,
    });
  };

  onChangeStatus = e => {
    e.preventDefault();
    this.setState({
      status: e.target.value,
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'resourceAudit/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

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
            <span style={{ fontSize: 16 }}>你是否确定通过此次审核？</span>
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
      resourceAudit: { sourceClassfiyList },
    } = this.props;
    const { mount } = this.state;
    const formData = {
      md: 8,
      lg: 24,
      xl: 48,
      data: [
        {
          key: 1,
          data: [
            {
              prop: 'code',
              label: '信息资源代码',
              typeOptions: {
                placeholder: '请输入信息资源代码',
                maxLength: 50,
              },
            },
            {
              prop: 'name',
              label: '信息资源名称',
              typeOptions: {
                placeholder: '请输入信息资源名称',
                maxLength: 50,
              },
            },
            {
              type: 'Cascader',
              prop: 'typeId',
              label: '资源属性分类',
              typeOptions: {
                options: sourceClassfiyList,
                fieldNames: { label: 'name', value: 'id' },
                placeholder: '请选择资源属性分类',
                changeOnSelect: true,
              },
            },
          ],
        },
        {
          key: 2,
          data: [
            {
              type: 'Select',
              prop: 'status',
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
            {
              type: 'RangePicker',
              prop: 'date',
              label: '发布日期',
            },
            {
              type: 'Checkbox',
              prop: 'mount',
              label: '是否已关联',
              checkLabel: '数据已关联',
              typeOptions: {
                onChange: this.handleIsRelated,
                checked: mount,
                style: { marginRight: 5, marginLeft: 12 },
              },
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
      resourceAudit: { dataList, page },
      loading,
      confirmLoading,
    } = this.props;
    const { visible } = this.state;
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
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
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
export default ResourceAudit;
