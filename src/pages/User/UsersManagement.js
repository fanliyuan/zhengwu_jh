import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Modal, Divider, Table } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './User.less';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ usersManagement, loading }) => ({
  usersManagement,
  loading: loading.effects['usersManagement/fetch'],
}))
@Form.create()
class UsersManagement extends PureComponent {
  columns = [
    {
      title: '用户名',
      align: 'center',
      dataIndex: 'account',
    },
    {
      title: '姓名',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '电话',
      align: 'center',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      align: 'center',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: text => {
        switch (text) {
          case 1:
            return <span style={{ color: '#5cadff' }}>启用</span>;
          case 2:
            return <span style={{ color: '#ed4014' }}>停用</span>;
          default:
            return <span>无状态</span>;
        }
      },
    },
    {
      title: '建立时间',
      align: 'center',
      dataIndex: 'createtime',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.system !== 1 && (
            <Fragment>
              {record.status === 2 && <a onClick={() => this.handleEnable(record.id)}>启用</a>}
              {record.status === 1 && <a onClick={() => this.handleDisabled(record.id)}>停用</a>}
              <Divider type="vertical" />
              <a onClick={() => router.push(`/users/usersManagement/update/${record.id}`)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleResetPassword(record.id)}>重置密码</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record.id)}>删除</a>
            </Fragment>
          )}
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
      type: 'usersManagement/fetch',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
    dispatch({
      type: 'usersManagement/getRoles',
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
      type: 'usersManagement/fetch',
      payload: values,
    });
  };

  handleEnable = id => {
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '启用后当前用户可登录系统，您是否确认启用当前用户？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise((resolve, reject) => {
          const values = {
            ...paramsPage,
            ...formValues,
            ...formTime,
          };

          dispatch({
            type: 'usersManagement/enable',
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
        }),
    });
  };

  handleDisabled = id => {
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '停用后当前用户不可登录，您是否确认停用当前用户？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise((resolve, reject) => {
          const values = {
            ...paramsPage,
            ...formValues,
            ...formTime,
          };

          dispatch({
            type: 'usersManagement/disabled',
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
        }),
    });
  };

  handleResetPassword = id => {
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '是否重置密码，重置后密码为"111111"？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise((resolve, reject) => {
          const values = {
            ...paramsPage,
            ...formValues,
            ...formTime,
          };

          dispatch({
            type: 'usersManagement/resetPassword',
            payload: {
              values,
              item: {
                userId: id,
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
        }),
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '是否删除当前用户？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        new Promise((resolve, reject) => {
          const values = {
            ...paramsPage,
            ...formValues,
            ...formTime,
          };

          dispatch({
            type: 'usersManagement/deleteItem',
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
        }),
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'usersManagement/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  renderForm() {
    const {
      usersManagement: { roleList },
    } = this.props;
    const roles = [
      {
        key: '全部',
        value: '',
      },
    ];
    roleList.map(item =>
      roles.push({
        key: item.name,
        value: item.id,
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
              prop: 'account',
              label: '用户名',
              typeOptions: {
                placeholder: '请输入用户名',
                maxLength: 50,
              },
            },
            {
              prop: 'name',
              label: '姓名',
              typeOptions: {
                placeholder: '请输入姓名',
                maxLength: 50,
              },
            },
            {
              prop: 'phone',
              label: '电话',
              typeOptions: {
                placeholder: '请输入电话',
                maxLength: 11,
              },
            },
          ],
        },
        {
          key: 2,
          data: [
            {
              type: 'Select',
              prop: 'role',
              label: '角色',
              typeOptions: {
                placeholder: '请选择角色',
              },
              options: roles,
            },
            {
              type: 'Select',
              prop: 'status',
              label: '状态',
              typeOptions: {
                placeholder: '请选择状态',
              },
              options: [
                {
                  key: '全部',
                  value: '',
                },
                {
                  key: '启用',
                  value: 1,
                },
                {
                  key: '停用',
                  value: 2,
                },
              ],
            },
            {
              type: 'RangePicker',
              prop: 'date',
              label: '创建时间',
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
      usersManagement: { data, page },
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

export default UsersManagement;
