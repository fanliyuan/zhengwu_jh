import React, { Component } from 'react';
import { Tabs, Form, Input, Select, DatePicker, Cascader, Button, Table } from 'antd';
import router from 'umi/router';

import { getTableFakeData } from '@/utils/utils';
import PageHeader from '@/components/PageHeaderWrapper';
import styles from './DataManagement.less';

export default class DataManagement extends Component {
  state = {};

  goToInfoSrcItem = row => {
    alert(row);
  };

  goToSubDetail = row => {
    router.push('subDetailFile', {
      payload: row,
    });
  };

  render() {
    const seletctData = [{ value: 0, label: '选择1' }, { value: 1, label: '选择2' }];
    const SelectOption = seletctData.map(item => (
      <Select.Option value={item.value} key={item.value}>
        {item.label}
      </Select.Option>
    ));
    const columns = [
      {
        dataIndex: 'id',
        title: '序号',
      },
      {
        dataIndex: 'subTitle',
        title: '订阅名称',
      },
      {
        title: '信息资源名称',
      },
      {
        title: '数据条数',
      },
      {
        title: '资源属性分类',
      },
      {
        title: '发布节点',
      },
      {
        title: '更新时间',
      },
      {
        title: '操作',
        render: (val, row) => {
          return (
            <div>
              <a className="mr16" onClick={this.goToInfoSrcItem.bind(null, row)}>
                信息资源项
              </a>
              <a onClick={this.goToSubDetail.bind(null, row)}>数据</a>
            </div>
          );
        },
      },
    ];
    columns.forEach(item => (item.align = 'center'));
    const dataSource = getTableFakeData(columns);
    return (
      <PageHeader>
        <div className="content_layout">
          <Tabs defaultActiveKey="db">
            <Tabs.TabPane tab="数据库" key="db">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称" />
                <Input className="mr16 w150" placeholder="信息资源名称" />
                <Cascader className="mr16 w150" placeholder="资源属性分类" />
                <Select className="mr16 w150" placeholder="发布节点">
                  {SelectOption}
                </Select>
                <DatePicker.RangePicker className="mr16 w220" />
                <Button type="primary" icon="search">
                  搜索
                </Button>
              </Form>
              <Table columns={columns} dataSource={dataSource} bordered rowKey="id" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="文件" key="file">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称" />
                <Input className="mr16 w150" placeholder="信息资源名称" />
                <Cascader className="mr16 w150" placeholder="资源属性分类" />
                <Select className="mr16 w150" placeholder="发布节点">
                  {SelectOption}
                </Select>
                <DatePicker.RangePicker className="mr16 w220" />
                <Button type="primary" icon="search">
                  搜索
                </Button>
              </Form>
              <Table columns={columns} dataSource={dataSource} bordered rowKey="id" />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
