/*
 * @Author: ChouEric
 * @Date: 2018-12-25 11:29:02
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-25 15:03:56
 * @Description: 描述 登录审计
 */
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
import StandardTable from '@/components/StandardTable';

const { Option } = Select;

@connect(({ audit, loading }) => ({ audit, loading: loading.effects['audit/getLoginDataList'] }))
export default class LoginAudit extends PureComponent {
  formOptions = {
    formData: [
      {
        name: 'userName',
        typeOptions: {
          placeholder: '用户名',
        },
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
      {
        name: 'result',
        type: 'Select',
        typeOptions: {
          placeholder: '登录结果',
        },
        children: [
          { value: 'all', label: '全部' },
          { value: 1, label: '成功' },
          { value: 0, label: '失败' },
        ].map(item => (
          <Option value={item.value} key={item.value}>
            {item.label}
          </Option>
        )),
      },
    ],
    searchHandler: this.handleSearch,
    resetHandler: this.handleSearch,
  };

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
      dataIndex: 'loginTime',
      title: '登录时间',
    },
    {
      dataIndex: 'loginIpAddress',
      title: ' 登录IP',
    },
    {
      dataIndex: 'result',
      title: '登录结果',
      render(text) {
        return (
          <span className={text === 1 ? 'green' : 'red'}>
            {text === 1 ? '登录成功' : '登录失败'}
          </span>
        );
      },
    },
  ];

  state = {
    queryData: {},
    pagination: {},
  };

  componentDidMount() {
    // TODO: 这里用 查询方法
    // this.handleSearch()
    const { dispatch } = this.props;
    dispatch({
      type: 'audit/getLoginDataList',
    });
  }

  tableChange = ({ pageSize, current: pageNum }) => {
    this.setState(
      {
        pagination: {
          pageSize,
          pageNum,
        },
      },
      () => {
        const { queryData } = this.state;
        this.handleSearch(queryData);
      }
    );
  };

  @Bind()
  @Throttle(800, { trailing: false })
  handleSearch(queryData = {}, pageReste = false) {
    const pagination = pageReste ? { pageSize: 10, pageNum: 1 } : this.state.pagination; // eslint-disable-line
    this.setState({
      queryData,
    });
    console.log(queryData, pagination); // eslint-disable-line
    // TODO: 这里触发model中的 getLoginDataList, 在这之前需要 处理参数
    // const { dispatch } = this.props
    // dispatch({
    //   type: 'audit/getLoginDataList',
    //   payload: {
    //     ...queryData,
    //     ...pagination
    //   }
    // })
  }

  render() {
    const {
      audit: { loginDataList = [], pagination: { total, pageNum, pageSize: current } = {} },
      loading,
    } = this.props; // eslint-disable-line
    // TODO: 这里需要 接收返回的pagination
    // const paginationProps = {
    //   total,
    //   pageNum,
    //   current
    // }
    return (
      <PageHeaderWrapper>
        <div className="content_layout">
          <SearchForm formOptions={this.formOptions} />
          <StandardTable
            columns={this.columns}
            loading={loading}
            onChange={this.tableChange}
            dataSource={loginDataList}
            bordered
            rowKey="index"
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
