import React, { Component } from 'react';
import { Tabs, Form, Input, Select, DatePicker, Cascader, Button, Table } from 'antd';
import router from 'umi/router';
import { Throttle, Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { getTableFakeData } from '@/utils/utils';
import PageHeader from '@/components/PageHeaderWrapper';
import styles from './DataManagement.less';

@connect(({ dataManagement }) => ({
  dataManagement,
}))
export default class DataManagement extends Component {
  state = {
    searchDataDB: {},
    searchDataFile: {},
  };

  componentDidMount() {
    this.handelSearch(0);
  }

  @Bind()
  tabChange(key) {
    if (key === 'file') {
      this.handelSearch(1);
    } else {
      this.handelSearch(0);
    }
  }

  subIdChangeDB = e => {
    const { searchDataDB } = this.state;
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        subId: e.target.value || '',
      },
    });
  };

  subIdChangeFile = e => {
    const { searchDataFile } = this.state;
    this.setState({
      searchDataFile: {
        ...searchDataFile,
        subId: e.target.value || '',
      },
    });
  };

  infoSrcTitleChangeDB = e => {
    const { searchDataDB } = this.state;
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        infoSrcTitle: e.target.value || '',
      },
    });
  };

  infoSrcTitleChangeFile = e => {
    const { searchDataFile } = this.state;
    this.setState({
      searchDataFile: {
        ...searchDataFile,
        infoSrcTitle: e.target.value || '',
      },
    });
  };

  srcAttrClassifyChange = val => {
    const { searchDataDB } = this.state;
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        srcAttrClassify: val.pop(),
      },
    });
  };

  srcAttrClassifyChangeFile = val => {
    const { searchDataDB } = this.state;
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        srcAttrClassify: val.pop(),
      },
    });
  };

  pubNodeChangeDB = val => {
    const { searchDataDB } = this.state;
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        pubNode: val.pop(),
      },
    });
  };

  pubNodeChangeFile = val => {
    const { searchDataFile } = this.state;
    this.setState({
      searchDataFile: {
        ...searchDataFile,
        pubNode: val.pop(),
      },
    });
  };

  dateChangeDB = time => {
    const { searchDataDB } = this.state;
    console.log(time[0].format().substr(0, 10), time[1].format().substr(0, 10));
    this.setState({
      searchDataDB: {
        ...searchDataDB,
        time: [time[0].format().substr(0, 10), time[1].format().substr(0, 10)],
      },
    });
  };

  dateChangeFile = time => {
    const { searchDataFile } = this.state;
    console.log(time[0].format().substr(0, 10), time[1].format().substr(0, 10));
    this.setState({
      searchDataFile: {
        ...searchDataFile,
        time: [time[0].format().substr(0, 10), time[1].format().substr(0, 10)],
      },
    });
  };

  // Bind绑定this ; Throttle节流阀
  @Bind()
  @Throttle(500)
  handelSearch(flag = 0) {
    const { searchDataDB, searchDataFile } = this.state;
    // console.log(subId, infoSrcTitle, srcAttrClassify, pubNode, time)
    if (flag === 0) {
      this.props.dispatch({
        type: 'dataManagement/getDBList',
        payload: {
          ...searchDataDB,
        },
      });
    } else {
      this.props.dispatch({
        type: 'dataManagement/getFileList',
        payload: {
          ...searchDataFile,
        },
      });
    }
  }

  goToInfoSrcItem = row => {
    alert(row);
  };

  goToSubFileDetail = row => {
    router.push('subDetailFile', {
      payload: row,
    });
  };

  goToSubDBDetail = row => {
    router.push('subDetailDataBase', {
      payload: row,
    });
  };

  render() {
    const {
      dataManagement: { DBList },
    } = this.props;
    const options = [
      {
        value: 'hebei',
        label: '河北',
        children: [
          { value: 'hengshui', label: '衡水' },
          { value: 'shijiazhuang', label: '石家庄' },
        ],
      },
      {
        value: 'hunan',
        label: '湖南',
        children: [{ value: 'shaoyang', label: '邵阳' }, { value: '株洲', label: '株洲' }],
      },
    ];
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
        title: '数据大小',
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
              <a onClick={this.goToSubFileDetail.bind(null, row)}>文件</a>
            </div>
          );
        },
      },
    ];
    columns.forEach(item => (item.align = 'center'));
    const columnDB = [
      {
        dataIndex: 'id',
        title: '序号',
      },
      {
        dataIndex: 'subName',
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
        title: '最近更新时间',
      },
      {
        title: '操作',
        render: (text, row) => {
          return (
            <div>
              <a className="mr16">信息资源</a>
              <a onClick={this.goToSubDBDetail.bind(null, row)}>数据</a>
            </div>
          );
        },
      },
    ];
    columnDB.forEach(item => (item.align = 'center'));
    const dataSource = getTableFakeData(columns);
    // const dataSourceDB = getTableFakeData(columnDB)
    const pagination = {
      showQuickJumper: true,
      hideOnSinglePage: true,
      showTotal(total) {
        return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
      },
    };
    return (
      <PageHeader>
        <div className="content_layout">
          <Tabs defaultActiveKey="db" onChange={this.tabChange}>
            <Tabs.TabPane tab="数据库" key="db">
              <Form className="mb16">
                <Input className="mr16 w150" onChange={this.subIdChangeDB} placeholder="订阅名称" />
                <Input
                  className="mr16 w150"
                  onChange={this.infoSrcTitleChangeDB}
                  placeholder="信息资源名称"
                />
                <Cascader
                  className="mr16 w150"
                  options={options}
                  displayRender={labels => labels.pop()}
                  onChange={this.srcAttrClassifyChange}
                  placeholder="资源属性分类"
                />
                <Select
                  className="mr16 w150"
                  onChange={this.pubNodeChangeDB}
                  placeholder="发布节点"
                >
                  {SelectOption}
                </Select>
                <DatePicker.RangePicker onChange={this.dateChangeDB} className="mr16 w220" />
                <Button type="primary" icon="search" onClick={this.handelSearch.bind(null, 0)}>
                  搜索
                </Button>
              </Form>
              <Table
                columns={columnDB}
                dataSource={DBList}
                pagination={pagination}
                bordered
                rowKey="id"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="文件" key="file">
              <Form className="mb16">
                <Input
                  className="mr16 w150"
                  onChange={this.subIdChangeFile}
                  placeholder="订阅名称"
                />
                <Input
                  className="mr16 w150"
                  onChange={this.infoSrcTitleChangeFile}
                  placeholder="信息资源名称"
                />
                <Cascader
                  className="mr16 w150"
                  options={options}
                  displayRender={labels => labels.pop()}
                  onChange={this.srcAttrClassifyChangeFile}
                  placeholder="资源属性分类"
                />
                <Select
                  className="mr16 w150"
                  onChange={this.pubNodeChangeFile}
                  placeholder="发布节点"
                >
                  {SelectOption}
                </Select>
                <DatePicker.RangePicker onChange={this.dateChangeFile} className="mr16 w220" />
                <Button type="primary" icon="search" onClick={this.handelSearch.bind(null, 1)}>
                  搜索
                </Button>
              </Form>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={pagination}
                bordered
                rowKey="id"
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </PageHeader>
    );
  }
}
