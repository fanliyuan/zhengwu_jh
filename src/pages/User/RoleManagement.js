import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Table } from 'antd';
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
      dataIndex: 'updatetime',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          {record.system !== 1 && (
            <a onClick={() => this.handleAssignRole(record.id, record.roleid)}>分配角色</a>
          )}
        </Fragment>
      ),
    },
  ];

  roleColumns = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'index',
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
    selectedRowKeys: [],
    userId: '',
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

  handleAssignRole = (id, roleId) => {
    let roleIds;
    if (roleId) {
      roleIds = parseInt(roleId, 10);
    } else {
      roleIds = 5;
    }
    this.setState({
      visible: true,
      userId: id,
      selectedRowKeys: [roleIds],
    });
  };

  setRowNum = (record, index) => {
    Object.defineProperty(record, 'index', { value: index + 1 });
    return record;
  };

  handleSelectTable = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { userId, selectedRowKeys } = this.state;
    const values = {
      ...paramsPage,
      ...formValues,
      ...formTime,
    };
    const roleIds = JSON.stringify(selectedRowKeys[0]);
    dispatch({
      type: 'roleManagement/assignRole',
      payload: {
        values,
        item: {
          userId,
          roleIds,
        },
      },
    });
    this.setState({
      visible: false,
      pageRole: 1,
      selectedRowKeys: [],
      userId: '',
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      pageRole: 1,
      selectedRowKeys: [],
      userId: '',
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
    const { visible, pageRole, selectedRowKeys } = this.state;
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
      selectedRowKeys,
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
            width={600}
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
