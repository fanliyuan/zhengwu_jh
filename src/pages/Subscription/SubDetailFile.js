import React, { Component } from 'react';
import { Form, Input, DatePicker, Button, Table } from 'antd';

import { getTableFakeData } from '@/utils/utils';
import PageHeader from '@/components/PageHeaderWrapper';
import styles from './SubDetailFile.less';

export default class SubDetailFile extends Component {
  state = {
    selectKeys: [],
  };

  componentDidMount() {
    const {
      location: {
        state: { payload },
      },
    } = this.props;
    console.log(payload);
  }

  handlerDownload = () => {
    const { selectKeys } = this.state;
    alert(selectKeys);
  };

  render() {
    const { selectKeys } = this.state;
    const buttonList = [
      {
        type: 'default',
        text: '返回',
        fn: () => {
          window.history.back();
        },
        key: '0',
      },
    ];
    const columns = [
      {
        dataIndex: 'id',
        title: '序号',
        className: 'table_index',
      },
      {
        dataIndex: 'fileName',
        title: '文件名称',
      },
      {
        title: '文件类型',
      },
      {
        title: '数据大小',
      },
      {
        title: '最近更新时间',
      },
    ];
    columns.forEach(item => (item.align = 'center'));
    const dataSource = getTableFakeData(columns);
    const rowSelection = {
      onChange: selectKeys => {
        this.setState({
          selectKeys,
        });
      },
      selection: {
        text: <div>2123123</div>,
        key: '',
      },
    };
    const pagination = {
      hideOnSinglePage: true,
      showQuickJumper: true,
      showTotal: (total, range) => {
        return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
      },
    };
    return (
      <PageHeader buttonList={buttonList}>
        <div className="content_layout">
          <div className={styles.box}>
            <Form className="mb16">
              <Input className="mr16 w150" maxLength={50} placeholder="文件名称" />
              <DatePicker.RangePicker className="mr16 w220" />
              <Button type="primary" icon="search">
                搜索
              </Button>
            </Form>
            <Table
              columns={columns}
              dataSource={dataSource}
              rowSelection={rowSelection}
              pagination={pagination}
              bordered
              rowKey="id"
            />
            <Button onClick={this.handlerDownload} disabled={selectKeys.length === 0}>
              下载
            </Button>
          </div>
        </div>
      </PageHeader>
    );
  }
}
