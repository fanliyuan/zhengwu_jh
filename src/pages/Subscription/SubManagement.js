/*
 * @Author: ChouEric
 * @Date: 2018-11-01 15:49:34
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-07 21:17:17
 * @Description: 使用了公共表格组件
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Tabs, Select, Button, Popconfirm } from 'antd';
import { Bind, Throttle, Debounce } from 'lodash-decorators';

import PageHeader from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
import StandardTable from '@/components/StandardTable';

@connect(({ subManagement, loading }) => ({ subManagement, loading: loading.models.subManagement }))
export default class SubManagement extends Component {
  formOptions = {
    formData: [
      {
        name: 'subscribeName',
        typeOptions: {
          maxLength: 50,
          placeholder: '订阅名称',
        },
      },
      {
        name: 'dsName',
        typeOptions: {
          maxLength: 50,
          placeholder: '信息资源名称',
        },
      },
      // {
      //   name: 'pubNode',
      //   type: 'Cascader',
      //   typeOptions: {
      //     placeholder: '发布节点',
      //     options: [
      //       {
      //         key: 1,
      //         label: '全部节点',
      //         value: 1,
      //         children: [
      //           {
      //             key: 2,
      //             label: '所有节点',
      //             value: 2,
      //           },
      //         ],
      //       },
      //     ],
      //     displayRender(value) {
      //       return [...value].pop();
      //     },
      //   },
      // },
      {
        name: 'runStatus',
        type: 'Select',
        typeOptions: {
          placeholder: '运行状态',
        },
        children: [
          { value: -999, label: '全部状态' },
          { value: 1, label: '运行' },
          { value: 0, label: '停止' },
          { value: 2, label: '已连接' },
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
      dataIndex: 'id',
      title: '序号',
    },
    {
      dataIndex: 'subscribeName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subscriber',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subscribeTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'dsName',
      title: '信息资源名称',
    },
    // {
    //   dataIndex: 'pubNode',
    //   title: '发布节点',
    // },
    {
      dataIndex: 'runStatus',
      title: '运行状态',
      render(text) {
        switch (text) {
          case 0:
            return <span className="red">停止</span>;
          case 1:
            return <span className="blue">运行</span>;
          default:
            return <span className="green">已连接</span>;
        }
      },
    },
    {
      title: '操作',
      render: (_, row) => {
        return (
          <Fragment>
            {row.runStatus === 1 ? (
              <Popconfirm title="请确认是否停止订阅?" onConfirm={this.handleStop.bind(this, [row])}>
                <a className="mr16">停止</a>
              </Popconfirm>
            ) : (
              <Popconfirm title="请确认是否启动订阅" onConfirm={this.handleStart.bind(this, [row])}>
                <a className="mr16">启动</a>{' '}
              </Popconfirm>
            )}
            {/* <Popconfirm title="请确认取消订阅?" onConfirm={this.handleCancelSub.bind(this, row)}>
              <a className="mr16">取消订阅</a>
            </Popconfirm> */}
            <a onClick={this.goAssessLogs.bind(this, row)}>审核日志</a>
          </Fragment>
        );
      },
    },
  ];
  willColumn = [
    {
      dataIndex: 'id',
      title: '序号',
    },
    {
      dataIndex: 'subscribeName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subscriber',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subscribeTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'dsName',
      title: '信息资源名称',
    },
    // {
    //   dataIndex: 'pubNode',
    //   title: '发布节点',
    // },
    {
      title: '操作',
      // render(_, row) {
      //   return <a>取消订阅</a>;
      // },
    },
  ];
  failColumn = [
    {
      dataIndex: 'id',
      title: '序号',
    },
    {
      dataIndex: 'subscribeName',
      title: '订阅名称',
    },
    {
      dataIndex: 'subscriber',
      title: '订阅申请人',
    },
    {
      dataIndex: 'subscribeTime',
      title: '订阅时间',
    },
    {
      dataIndex: 'dsName',
      title: '信息资源名称',
    },
    // {
    //   dataIndex: 'pubNode',
    //   title: '发布节点',
    // },
    {
      title: '操作',
      render: (_, row) => {
        return (
          <Fragment>
            {/* <a className="mr16">重新订阅</a> */}
            <a onClick={this.goAssessLogs.bind(this, row)}>审核日志</a>
          </Fragment>
        );
      },
    },
  ];

  state = {
    key: 'has',
    queryData: {},
    pagination: { pageSize: 10, pageNum: 1 },
    selectedRows: [],
  };

  componentDidMount() {
    this.handleSearch();
  }

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

  handleSelectRows = selectedRows => {
    console.log(selectedRows);
    this.setState({
      selectedRows,
    });
  };

  handleStop = rows => {
    const payload = rows.map(item => ({
      dataType: item.dataType,
      dsID: item.dsId,
      mountResourceId: item.mountResourceId,
      subscriberID: item.subscriberId,
    }));
    this.props.dispatch({
      type: 'subManagement/stopSubTask',
      payload,
    });
  };

  handleStart = rows => {
    const payload = rows.map(item => ({
      dataType: item.dataType,
      dsID: item.dsId,
      mountResourceId: item.mountResourceId,
      subscriberID: item.subscriberId,
    }));
    this.props.dispatch({
      type: 'subManagement/stopSubTask',
      payload,
    });
  };

  handleCancelSub = row => {
    console.log(row);
  };

  goAssessLogs = row => {
    router.push(`/subscribe/assessLogs/${row.id}`);
  };

  // @Bind()
  // @Debounce(500)
  handleTab = key => {
    this.setState(
      {
        key,
      },
      this.handleSearch
    );
  };

  @Bind()
  @Throttle(1000)
  handleSearch(queryData = {}, pageReset = false) {
    const { key } = this.state;
    const pagination = pageReset ? { pageSize: 10, pageNum: 1 } : this.state.pagination;
    if (queryData.runStatus === -999) {
      queryData.runStatus = undefined;
    }
    queryData.status = key === 'has' ? 1 : key === 'fail' ? 0 : -1;
    this.setState({
      queryData: { ...queryData },
    });
    this.props.dispatch({
      type: 'subManagement/getSubList',
      payload: {
        ...queryData,
        ...pagination,
      },
    });
  }

  render() {
    const { selectedRows } = this.state;
    const {
      subManagement: { dataList, pagination },
      loading,
    } = this.props;
    return (
      <PageHeader>
        <div className="content_layout">
          <Tabs defaultActiveKey="has" onChange={this.handleTab}>
            <Tabs.TabPane tab="已订阅" key="has">
              <SearchForm formOptions={this.formOptions} />
              <div className="mb16">
                {selectedRows.length > 0 ? (
                  <Fragment>
                    <Popconfirm
                      title="将启动所选"
                      onConfirm={this.handleStart.bind(this, selectedRows)}
                    >
                      <Button className="mr16">启动</Button>
                    </Popconfirm>
                    <Popconfirm
                      title="将停止所选"
                      onConfirm={this.handleStop.bind(this, selectedRows)}
                    >
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
              <StandardTable
                loading={loading}
                pagination={pagination}
                columns={this.hasColumn}
                dataSource={dataList}
                bordered
                showSelect
                onChange={this.handleTableChange}
                onSelectRow={this.handleSelectRows}
                rowKey="id"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="待审核" key="will">
              <SearchForm formOptions={this.formOptions} />
              <StandardTable
                loading={loading}
                dataSource={dataList}
                pagination={pagination}
                columns={this.willColumn}
                rowKey="id"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="订阅失败" key="fail">
              <SearchForm formOptions={this.formOptions} />
              <StandardTable
                loading={loading}
                dataSource={dataList}
                pagination={pagination}
                columns={this.failColumn}
                rowKey="id"
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
