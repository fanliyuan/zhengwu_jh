import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Table, Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './SourceCatalog.less';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ sourceCatalog, loading }) => ({
  sourceCatalog,
  loading: loading.effects['sourceCatalog/fetch'],
}))
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
      title: '关联数据名称',
      align: 'center',
      dataIndex: 'roleName',
    },
    {
      title: '关联数据类型',
      align: 'center',
      dataIndex: 'roleName',
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
            return <span style={{ color: '#5cadff' }}>不需要</span>;
          case '1':
            return <span style={{ color: '#ed4014' }}>需要</span>;
          default:
            return <span>授权码错误</span>;
        }
      },
    },
    {
      title: '订阅状态',
      align: 'center',
      dataIndex: 'orderStatus',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.orderStatus === '未订阅' && (
            <Fragment>
              <a onClick={() => this.handleOrder(record.resourceId)}>订阅</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          {record.orderStatus === '已拒绝' && (
            <Fragment>
              <a onClick={() => this.handleOrder(record.resourceId)}>重新订阅</a>
              <Divider type="vertical" />
            </Fragment>
          )}
          <a onClick={() => this.handleResource(record.resourceId)}>信息资源</a>
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

  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    const fields = fieldsForm;
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.typeIds) {
      const typeArr = ['classId', 'projectId', 'catalogId', 'typeId'];
      fields.typeIds.map((item, index) =>
        Object.defineProperty(fields, typeArr[index], {
          value: item,
        })
      );
    }
    formValues = { ...fieldsForm };
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

  renderForm() {
    const {
      sourceCatalog: { sourceClassfiyList },
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
              prop: 'status',
              label: '订阅状态',
              typeOptions: {
                placeholder: '请选择订阅状态',
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
                  key: '未订阅',
                  value: '未订阅',
                },
                {
                  key: '已订阅',
                  value: '已订阅',
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
              label: '发布日期',
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
    } = this.props;
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
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SourceCatalog;
