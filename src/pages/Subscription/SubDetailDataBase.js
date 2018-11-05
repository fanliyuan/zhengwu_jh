import React, { Component, PureComponent } from 'react';
import { Button, Table, Modal, Form, Select, Input, Divider } from 'antd';

import PageHeader from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataBaseInfo';

export default class SubDetailDataBase extends Component {
  state = {};

  render() {
    // { dataBaseName = '', dataBaseType = '', dataName = '', pubNodeName = '', updateTime = '' }
    const dataBaseInfo = {
      dataBaseName: 'Youedata_dig',
      dataBaseType: 'MySQL',
      dataName: '城市低保标准表城市低保标准表城市低保标准表城市低保标准表',
      pubNodeName: '石家庄民政局',
      updateTime: '2018-01-01 15:12:13',
    };
    const buttonList = [
      {
        text: '返回',
        fn() {
          window.history.back();
        },
      },
    ];
    const pagination = {
      hideOnSinglePage: true,
      showQuickJumper: true,
      showTotal: (total, range) => {
        return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
      },
    };
    const columns1 = [
      {
        dataIndex: 'index',
        title: '序号',
      },
      {
        title: '表名称',
      },
      {
        title: '中文标注',
      },
      {
        title: '操作',
        render: (text, row) => {
          return (
            <div>
              <a className="mr16">浏览</a>
              <a className="mr16">结构</a>
              <a>导出</a>
            </div>
          );
        },
      },
    ];
    columns1.forEach(item => (item.align = 'center'));
    const columns2 = [
      {
        dataIndex: 'index',
        title: '序号',
      },
      {
        title: 'blog_id',
      },
    ];
    const dataSource1 = [{ index: 1 }];
    const dataSource2 = [{ index: 1 }];
    return (
      <PageHeader buttonList={buttonList}>
        <div className="content_layout">
          <DataBaseInfo dataBaseInfo={dataBaseInfo} />
          <Divider style={{ marginTop: 10, marginBottom: 10 }} />
          <Table
            className="mb16"
            columns={columns1}
            dataSource={dataSource1}
            bordered
            rowKey="index"
            pagination={pagination}
          />
          <Table
            className="mb16"
            columns={columns2}
            dataSource={dataSource2}
            bordered
            rowKey=""
            idnex
          />
        </div>
      </PageHeader>
    );
  }
}
