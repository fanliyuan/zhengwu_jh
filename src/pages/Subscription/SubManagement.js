/*
 * @Author: ChouEric
 * @Date: 2018-11-01 15:49:34
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-06 17:53:17
 * @Description: 描述
 */
import React, { Component, Fragment } from 'react';
import { Tabs, Form, Input, Select, DatePicker, Button, Table, Modal, Popconfirm } from 'antd';
import { Bind, Throttle, Debounce } from 'lodash-decorators';

import PageHeader from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';

export default class SubManagement extends Component {
  formOptions = {
    formData: [
      {
        name: 'subName',
        typeOptions: {
          maxLength: 50,
          placeholder: '订阅名称',
        },
      },
      {
        name: 'infoSrcName',
        typeOptions: {
          maxLength: 50,
          placeholder: '信息资源名称',
        },
      },
      {
        name: 'pubNode',
        type: 'Cascader',
        typeOptions: {
          placeholder: '发布节点',
          options: [
            {
              key: 1,
              label: '全部节点',
              value: 1,
              children: [
                {
                  key: 2,
                  label: '所有节点',
                  value: 2,
                },
              ],
            },
          ],
          displayRender(value) {
            return [...value].pop();
          },
        },
      },
      {
        name: 'status',
        type: 'Select',
        typeOptions: {
          placeholder: '运行状态',
        },
        children: [
          { value: -999, label: '全部状态' },
          { value: 1, label: '运行中' },
          { value: 0, label: '已停止' },
        ].map(item => (
          <Select.Option value={item.value} key={item.value}>
            {item.label}
          </Select.Option>
        )),
      },
      {
        name: 'time',
        type: 'RangePicker',
      },
    ],
    searchHandler: this.handleSearch,
  };
  hasColumn = [
    {
      dataIndex: 'index',
      title: '序号',
    },
    {
      dataIndex: 'subName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subProposer',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'infoSrcName',
      title: '信息资源名称',
    },
    {
      dataIndex: 'pubNode',
      title: '发布节点',
    },
    {
      dataIndex: 'status',
      title: '运行状态',
    },
    {
      title: '操作',
      render: (_, row) => {
        return (
          <Fragment>
            {row.status === 1 ? (
              <Popconfirm title="请确认是否停止订阅?" onConfirm={this.handleStop.bind(this, row)}>
                <a className="mr16">停止</a>
              </Popconfirm>
            ) : (
              <Popconfirm title="请确认是否启动订阅" onConfirm={this.handleStart.bind(this, row)}>
                <a className="mr16">启动</a>{' '}
              </Popconfirm>
            )}
            <Popconfirm title="请确认取消订阅?" onConfirm={this.handleCancelSub.bind(this, row)}>
              <a className="mr16">取消订阅</a>
            </Popconfirm>
            <a>审核日志</a>
          </Fragment>
        );
      },
    },
  ];
  willColumn = [
    {
      dataIndex: 'index',
      title: '序号',
    },
    {
      dataIndex: 'subName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subProposer',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'infoSrcName',
      title: '信息资源名称',
    },
    {
      dataIndex: 'pubNode',
      title: '发布节点',
    },
    {
      title: '操作',
      render(_, row) {
        return <a>取消订阅</a>;
      },
    },
  ];
  failColumn = [
    {
      dataIndex: 'index',
      title: '序号',
    },
    {
      dataIndex: 'subName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subProposer',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'infoSrcName',
      title: '信息资源名称',
    },
    {
      dataIndex: 'pubNode',
      title: '发布节点',
    },
    {
      title: '操作',
      render(_, row) {
        return (
          <Fragment>
            <a className="mr16">重新订阅</a>
            <a>审核日志</a>
          </Fragment>
        );
      },
    },
  ];

  state = {
    key: 'has',
    queryData: {},
    pagination: { pageSize: 10, pageNum: 1 },
    selectedRowKeys: [],
  };

  handleTableChange = ({ current: pageNum, pageSize }) => {
    this.setState(
      {
        pagination: {
          pageNum,
          pageSize,
        },
      },
      this.handleSearch
    );
  };

  handleStop = row => {
    console.log(row);
  };

  handleStart = row => {
    console.log(row);
  };

  handleCancelSub = row => {
    console.log(row);
  };

  selectKeysChange = keys => {
    this.setState({
      selectedRowKeys: [...keys],
    });
  };

  @Bind()
  @Debounce(500)
  handleTab(key) {
    this.setState(
      {
        key,
      },
      this.handleSearch
    );
  }

  @Bind()
  @Throttle(1000)
  handleSearch(queryData = {}, pageReset = false) {
    const pagination = pageReset ? { pageSize: 10, pageNum: 1 } : this.state.pagination;
    if (queryData.status === -999) {
      queryData.status = undefined;
    }
    this.setState({
      queryData: { ...queryData },
    });
  }

  render() {
    const { selectedRowKeys } = this.state;
    const paginationProps = {
      showQuickJumper: true,
      hideOnSinglePage: true,
      showTotal(total) {
        return `共 $total/10}页 / ${total} 条数据`;
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.selectKeysChange,
    };
    const dataSource = [
      {
        index: 1,
        subName: '订阅名称1',
      },
      {
        index: 2,
        subName: '订阅2',
      },
    ];
    return (
      <PageHeader>
        <div className="content_layout">
          <Tabs defaultActiveKey="has" onChange={this.handleTab}>
            <Tabs.TabPane tab="已订阅" key="has">
              <SearchForm formOptions={this.formOptions} />
              <div className="mb16">
                {selectedRowKeys.length > 0 ? (
                  <Fragment>
                    <Popconfirm title="将启动所选">
                      <Button className="mr16">启动</Button>
                    </Popconfirm>
                    <Popconfirm title="将停止所选">
                      <Button type="danger">停止</Button>
                    </Popconfirm>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Button disabled className="mr16">
                      启动
                    </Button>
                    <Button disabled>停止</Button>
                  </Fragment>
                )}
              </div>
              <Table
                pagination={paginationProps}
                columns={this.hasColumn}
                dataSource={dataSource}
                rowSelection={rowSelection}
                bordered
                onChange={this.handleTableChange}
                rowKey="index"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="待审核" key="will">
              <SearchForm formOptions={this.formOptions} />
              <Table
                pagination={paginationProps}
                columns={this.willColumn}
                bordered
                rowKey="index"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="订阅失败" key="fail">
              <SearchForm formOptions={this.formOptions} />
              <Table
                pagination={paginationProps}
                columns={this.failColumn}
                bordered
                rowKey="index"
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
