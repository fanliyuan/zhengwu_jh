import React, { Component, Fragment } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataBaseInfo';

const authority = localStorage.getItem('antd-pro-authority');

@connect(({ dbView }) => ({ dbView }))
export default class DBView extends Component {
  tableColumn = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
    },
    {
      title: '表名称',
      dataIndex: 'tableName',
      align: 'center',
    },
    {
      title: '中文标注',
      dataIndex: 'chineseDesc',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render(text, row) {
        return authority === '["user"]' ? (
          <Fragment>
            <a className="mr16">浏览</a>
            <a className="mr16">结构</a>
            <a className="mr16">导出</a>
          </Fragment>
        ) : (
          <Fragment>
            <a className="mr16">浏览</a>
            <a className="mr16">结构</a>
          </Fragment>
        );
      },
    },
  ];

  dataColumn = [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: 'blog_id',
      dataIndex: 'blog_id',
    },
  ];

  pagination = {
    hideOnSinglePage: true,
    showQuickJumper: true,
    showTotal: (total, range) => {
      return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dbView/getDBTableStruct',
      payload: {
        path: 7,
        query: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
  }

  render() {
    const dataBaseInfo = {
      dataBaseName: 'Youedata_dig',
      dataBaseType: 'MySQL',
      dataName: '城市低保标准表城市低保标准表城市低保标准表城市低保标准表',
      pubNodeName: '石家庄民政局',
      updateTime: '2018-01-01 15:12:13',
    };

    const tableList = [{ index: 1, tableName: 'dig_user', chineseDesc: '用户表' }];
    const dataList = [{ index: 1, blog_id: 1 }];
    const buttonList = [
      {
        type: 'primary',
        text: '返回',
        fn() {
          window.history.back();
        },
      },
    ];
    return (
      <PageHeaderWrapper buttonList={buttonList}>
        <div className="content_layout">
          <DataBaseInfo dataBaseInfo={dataBaseInfo} />
          <Table
            bordered
            pagination={this.pagination}
            dataSource={tableList}
            className="mt16"
            columns={this.tableColumn}
            rowKey="index"
          />
          <Table
            bordered
            pagination={this.pagination}
            dataSource={dataList}
            columns={this.dataColumn}
            className="mt16"
            rowKey="index"
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
