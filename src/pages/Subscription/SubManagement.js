/*
 * @Author: ChouEric
 * @Date: 2018-11-01 15:49:34
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-11-02 11:52:39
 * @Description: 描述
 */
import React, { Component } from 'react';
import { Tabs, Form, Input, Select, DatePicker, Button, Table, Modal } from 'antd';

import PageHeader from '@/components/PageHeaderWrapper';

export default class SubManagement extends Component {
  state = {};

  render() {
    const selectOption = [{ value: 1, label: '运行' }, { value: 0, label: '停止' }].map(item => (
      <Select.Option value={item.value} key={item.value}>
        {item.label}
      </Select.Option>
    ));
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
            <Tabs.TabPane tab="全部订阅" key="all">
              <Form className="mb16">
                <Input className="mr16 w150" placeholder="订阅名称/发布名称" />
                <Input className="mr16 w150" placeholder="所属主题" />
                <Input className="mr16 w150" placeholder="订阅机构/发布机构" />
                <Select className="mr16 w120" placeholder="运行状态" allowClear>
                  {selectOption}
                </Select>
              </Form>
              <Table columns={columns} dataSource={dataSource} bordered rowKey="index" />
            </Tabs.TabPane>
            <Tabs.TabPane tab="已订阅" key="has">
              123123
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
