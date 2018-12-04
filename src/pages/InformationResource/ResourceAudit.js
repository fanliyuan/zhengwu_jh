import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Form, Divider, Card } from 'antd';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './ResourceAudit.less';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues = { mount: false };
let formTime;

@connect(({ resourceAudit, loading }) => ({
  resourceAudit,
  loading: loading.effects['resourceAudit/fetch'],
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
              <a onClick={() => this.handleAudit()}>审核</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.status !== -1 && (
            <Fragment>
              <a onClick={() => router.push(`/informationResource/auditLogs/${record.id}`)}>
                审核日志
              </a>
              <Divider type="vertical" />
            </Fragment>
          )}
          <a onClick={() => router.push(`/viewDirectory/${record.id}`)}>查看</a>
        </Fragment>
      ),
    },
  ];

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

  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    formValues = { ...fieldsForm };
    const fields = fieldsForm;
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
      type: 'resourceAudit/fetch',
      payload: values,
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

  renderForm() {
    const {
      resourceAudit: { sourceClassfiyList },
    } = this.props;
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
              prop: 'typeName',
              label: '资源属性分类',
              typeOptions: {
                placeholder: '请选择资源属性分类',
                fieldLabel: 'name',
                fieldValue: 'id',
              },
              options: sourceClassfiyList,
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
              label: '数据已关联',
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default ResourceAudit;
