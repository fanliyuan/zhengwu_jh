/*
 * @Author: ChouEric
 * @Date: 2018-11-01 15:49:34
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-11-05 16:17:10
 * @Description: 描述
 */
import React, { Component } from 'react';
import { Tabs, Form, Input, Select, DatePicker, Button, Table, Modal, Popconfirm } from 'antd';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeader from '@/components/PageHeaderWrapper';

export default class SubManagement extends Component {
  state = {};

  render() {
    const selectOption = [{ value: 1, label: '运行' }, { value: 0, label: '停止' }].map(item => (
      <Select.Option value={item.value} key={item.value}>
        {item.label}
      </Select.Option>
    ));
    const selectOption1 = [
      { value: 0, label: '上级待审核' },
      { value: 1, label: '发布方待审核' },
    ].map(item => (
      <Select.Option value={item.value} key={item.value}>
        {item.label}
      </Select.Option>
    ));
    const selectOption2 = [{ value: 0, label: '上级拒绝' }, { value: 1, label: '发布方拒绝' }].map(
      item => (
        <Select.Option value={item.value} key={item.value}>
          {item.label}
        </Select.Option>
      )
    );
    const columns = [
      {
        dataIndex: 'index',
        title: '序号',
      },
      {
        dataIndex: 'subTitle',
        title: '订阅名称',
      },
      {
        title: '订阅申请人',
      },
      {
        title: '订阅时间',
      },
      {
        title: '订阅机构',
      },
      {
        title: '目录名称',
      },
      {
        title: '发布机构',
      },
      {
        title: '运行状态',
      },
      {
        title: '操作',
      },
    ];
    const column1 = [
      {
        dataIndex: 'id',
        title: '序号',
      },
      {
        title: '订阅名称',
      },
      {
        title: '订阅申请人',
      },
      {
        title: '订阅时间',
      },
      {
        title: '订阅节点',
      },
      {
        title: '信息资源名称',
      },
      {
        title: '发布节点',
      },
      {
        title: '审核状态',
      },
      {
        title: '操作',
        render: (text, row) => {
          return (
            <div>
              <a className="mr16">取消订阅</a>
              <a>审核日志</a>
            </div>
          );
        },
      },
    ];
    const column2 = [
      {
        dataIndex: 'id',
        title: '序号',
      },
      {
        title: '订阅名称',
      },
      {
        title: '订阅申请人',
      },
      {
        title: '订阅时间',
      },
      {
        title: '订阅节点',
      },
      {
        title: '信息资源名称',
      },
      {
        title: '发布节点',
      },
      {
        title: '审批失败',
      },
      {
        title: '操作',
        render: (text, row) => {
          return (
            <div>
              <a className="mr16">重新订阅</a>
              <a>审核日志</a>
            </div>
          );
        },
      },
    ];
    columns.forEach(item => (item.align = 'center'));
    column1.forEach(item => (item.align = 'center'));
    column2.forEach(item => (item.align = 'center'));
    const pagination = {
      showQuickJumper: true,
      hideOnSinglePage: true,
      showTotal(total) {
        return `共 ${total / 10}页 / $total}条 数据`;
      },
    };
    const dataSource = [
      {
        id: 0,
        index: 0,
        subTitle: '订阅1',
      },
      {
        di: 1,
        index: 1,
        subTitle: '订阅2',
      },
    ];
    return (
      <PageHeader>
        <div className="content_layout">
          <Tabs>
            <Tabs.TabPane tab="已订阅" key="has">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称" />
                <Input className="mr16 w150" placeholder="信息资源名称" />
                <Input className="mr16 w150" placeholder="发布节点" />
                <Select className="mr16 w120" placeholder="运行状态" allowClear>
                  {selectOption}
                </Select>
                <DatePicker.RangePicker className="mr16 w220" />
                <Button type="primary" icon="search">
                  搜索
                </Button>
              </Form>
              <div className="mb16">
                <Popconfirm title="将启动所选">
                  <Button className="mr16">启动</Button>
                </Popconfirm>
                <Popconfirm title="将停止所选">
                  <Button type="danger">停止</Button>
                </Popconfirm>
              </div>
              <Table
                pagination={pagination}
                columns={columns}
                dataSource={dataSource}
                bordered
                rowKey="index"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="待审核" key="will">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称" />
                <Input className="mr16 w150" placeholder="信息资源名称" />
                <Input className="mr16 w150" placeholder="发布机构" />
                <Select placeholder="审核状态" allowClear className="mr16 w120">
                  {selectOption1}
                </Select>
                <DatePicker.RangePicker className="mr16 w220" />
                <Button type="primary" icon="search">
                  搜索
                </Button>
              </Form>
              <Table pagination={pagination} columns={column1} bordered rowKey="id" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="订阅失败" key="fail">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称" />
                <Input className="mr16 w150" placeholder="信息资源名称" />
                <Input className="mr16 w150" placeholder="发布节点" />
                <Select className="mr16 w120" placeholder="审批状态">
                  {selectOption2}
                </Select>
                <DatePicker.RangePicker className="mr16 w220" />
                <Button type="primary" icon="search">
                  搜索
                </Button>
              </Form>
              <Table pagination={pagination} columns={column2} bordered rowKey="id" />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
