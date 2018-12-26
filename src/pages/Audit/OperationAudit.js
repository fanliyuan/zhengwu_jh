/*
 * @Author: ChouEric
 * @Date: 2018-12-25 11:29:13
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-25 14:49:24
 * @Description: 描述 操作审计
 */
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
import StandardTable from '@/components/StandardTable';

const { Option } = Select;

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getOperationDataList'],
}))
export default class OperationAudit extends PureComponent {
  columns = [
    {
      dataIndex: 'userName',
      title: '用户名',
    },
    {
      dataIndex: 'realName',
      title: '姓名',
    },
    {
      dataIndex: 'module',
      title: '所属模块',
    },
    {
      dataIndex: 'operationType',
      title: '操作类型',
    },
    {
      dataIndex: 'time',
      title: '操作时间',
    },
    {
      dataIndex: 'ipAddress',
      title: '操作IP',
    },
    {
      dataIndex: 'detail',
      title: '行为记录',
      // TODO: 这里可能需要截取字符串,甚至拼接后端的操作详情, 可是 尝试是用 tag 标签 标记 不同操作类型
    },
  ];

  state = {
    queryData: {},
    pagination: {},
  };

  componentDidMount() {
    // eslint-disable-next-line
    this.props.dispatch({
      type: 'audit/getOperationDataList',
    });
  }

  tableChange = ({ current: pageNum, pageSize }) => {
    this.setState(
      {
        pagination: {
          pageNum,
          pageSize,
        },
      },
      () => {
        const { queryData } = this.state;
        this.handleSearch(queryData);
      }
    );
  };

  @Bind()
  @Throttle(800, { trailing: true })
  handleSearch(queryData = {}, resetPage = false) {
    const pagination = resetPage ? { pageSize: 10, pageNum: 1 } : this.state.pagination; // eslint-disable-line
    this.setState({
      queryData,
    });
  }

  render() {
    const {
      audit: { moduleDataList = [], operationDataList = [], operationPagination },
      loading,
    } = this.props; // eslint-disable-line

    const formOptions = {
      formData: [
        {
          name: 'userName',
          typeOptions: {
            placeholder: '用户名',
          },
        },
        {
          name: 'module',
          type: 'Select',
          typeOptions: {
            placeholder: '所属模块',
          },
          // TODO: 应该用后端返回的 moduleDataList 作为下拉选择
          children: [
            { value: 'user', label: '用户模块' },
            { value: 'node', label: '节点管理' },
          ].map(item => (
            <Option value={item.value} key={item.value}>
              {item.label}
            </Option>
          )),
        },
        {
          name: 'operationType',
          type: 'Select',
          typeOptions: {
            placeholder: '操作类型',
          },
          children: [
            { value: 'add', label: '新增' },
            { value: 'delete', label: '删除' },
            { value: 'edit', label: '修改' },
          ].map(item => (
            <Option value={item.value} key={item.value}>
              {item.label}
            </Option>
          )),
        },
        {
          name: 'IpAddress',
          typeOptions: {
            placeholder: 'IP地址',
            maxLength: 16,
          },
        },
        {
          name: 'time',
          type: 'RangePicker',
        },
      ],
      searchHandler: this.handleSearch,
      resetHandler: this.handleSearch,
    };

    const paginationProps = { ...operationPagination };

    return (
      <PageHeaderWrapper>
        <div className="content_layout">
          <SearchForm formOptions={formOptions} />
          <StandardTable
            loading={loading}
            columns={this.columns}
            pagination={paginationProps}
            dataSource={operationDataList}
            onChange={this.tableChange}
            bordered
            rowKey="index"
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
