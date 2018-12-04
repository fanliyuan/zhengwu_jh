import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Modal, Table } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './User.less';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

@connect(({ roleManagement, loading }) => ({
  roleManagement,
  loading: loading.effects['roleManagement/fetch'],
  roleLoading: loading.effects['roleManagement/getRoles'],
  confirmLoading: loading.effects['roleManagement/assignRole'],
}))
@Form.create()
class UsersManagement extends PureComponent {
  columns = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      render: (text, record, index) => {
        const { roleManagement } = this.props;
        return `${index + 1 + (roleManagement.page - 1) * 10}`;
      },
    },
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
      title: '操作时间',
      align: 'center',
      dataIndex: 'createtime',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => <a onClick={() => this.handleAssignRole(record.id)}>分配角色</a>,
    },
  ];

  roleColumns = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
      render: text => {
        const { page } = this.state;
        return `${text + (page - 1) * 10}`;
      },
    },
    {
      title: '角色名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '角色说明',
      align: 'center',
      dataIndex: 'tips',
    },
  ];

  state = {
    visible: false,
    pageRole: 1,
    selectedTableRowKeys: [],
  };

  componentDidMount() {
    let fields;
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = {};
      formTime = {};
    } else {
      fields = { ...formValues };
      Object.defineProperty(fields, 'date', {
        value: ``,
      });
    }
    dispatch({
      type: 'roleManagement/fetch',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
    dispatch({
      type: 'roleManagement/getRoles',
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
      type: 'roleManagement/fetch',
      payload: values,
    });
  };

  handleAssignRole = id => {
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
            type: 'roleManagement/assignRole',
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
      type: 'roleManagement/fetch',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  changePageRole = current => {
    this.setState({
      pageRole: current,
    });
  };

  renderForm() {
    const {
      roleManagement: { roleList },
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
              label: '操作时间',
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
      roleManagement: { data, page, roleList },
      loading,
      roleLoading,
      confirmLoading,
    } = this.props;
    const { visible, pageRole, selectedTableRowKeys } = this.state;
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
    const paginationRoleProps = {
      current: pageRole,
      onChange: this.changePageRole,
      pageSize: 10,
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的数据源',
    };
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selectedTableRowKeys,
      onChange: this.handleSelectTable,
    };
    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
          <Modal
            title="分配角色"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={900}
            maskClosable={false}
            confirmLoading={confirmLoading}
          >
            <Table
              rowKey="id"
              bordered
              onRow={this.setRowNum}
              columns={this.roleColumns}
              dataSource={roleList}
              size="small"
              loading={roleLoading}
              rowSelection={rowSelection}
              pagination={paginationRoleProps}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UsersManagement;
