/*
 * @Author: ChouEric
 * @Date: 2018-11-01 15:49:27
 * @Last Modified by:   ChouEric
 * @Last Modified time: 2018-11-01 15:49:27
 * @Description: 描述
 */
import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Button, Table } from 'antd';

import PageHeader from '@/components/PageHeaderWrapper';
import styles from './SourceCatalog.less';

export default class SourceCatalog extends Component {
  state = {};

  render() {
    const selectData = [{ value: 0, label: '选择1' }, { value: 1, label: '选择2' }];
    const selectOption = selectData.map(item => (
      <Select.Option value={item.value} key={item.value}>
        {item.label}
      </Select.Option>
    ));
    const tableColumns = [
      {
        dataIndex: 'infoSrcCode',
        title: '信息资源代码',
      },
      {
        dataIndex: 'infoSrcTitle',
        title: '信息资源名称',
      },
      {
        title: '资源属性分类',
      },
      {
        title: '发布节点',
      },
      {
        title: '关联数据名称',
      },
      {
        title: '关联数据类型',
      },
      {
        title: '共享时间',
      },
      {
        title: '订阅是否需发布方授权',
        width: '110px',
      },
      {
        title: '订阅状态',
      },
      {
        title: '操作',
      },
    ];
    tableColumns.forEach(item => (item.align = 'center'));
    const dataSource = [
      {
        infoSrcCode: 1,
        infoSrcTitle: '资源项1',
      },
      {
        infoSrcCode: 2,
        infoSrcTitle: '资源项1',
      },
    ];
    return (
      <PageHeader>
        <div className="content_layout">
          <div className={styles.box}>
            <Form className="mb16">
              <Input className="mr16 w150" placeholder="信息资源代码" />
              <Input className="mr16 w150" placeholder="信息资源名称" />
              <Select className="w150 mr16" placeholder="资源属性分类" allowClear>
                {selectOption}
              </Select>
              <Select className="w150 mr16" placeholder="发布节点" allowClear>
                {selectOption}
              </Select>
              <Select className="w150 mr16" placeholder="订阅状态" allowClear>
                {selectOption}
              </Select>
              <DatePicker.RangePicker className="mr16 w220" />
              <Button type="primary" icon="search">
                搜索
              </Button>
            </Form>
            <Table bordered columns={tableColumns} dataSource={dataSource} rowKey="infoSrcCode" />
          </div>
        </div>
      </PageHeader>
    );
  }
}
