import React, { Component, Fragment } from 'react';
import { Select, Table, Modal, Radio, Input, Popconfirm } from 'antd';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
import DataTypeSelectOption from '@/components/DataTypeSelectOption';
import ModalRadio from '@/components/ModalRadio';

const { Option } = Select;
const { Group } = Radio;
const { TextAera } = Input;

const status = [
  { value: '-1', label: '待审核' },
  { value: '0', label: '已拒绝' },
  { value: '1', label: '已通过' },
];
const statusChildren = status.map(item => (
  <Option value={item.value} key={item.value}>
    {item.label}
  </Option>
));

export default class SubAuth extends Component {
  formOptions = {
    formData: [
      {
        name: 'infoSrcName',
        typeOptions: {
          maxLength: 50,
          placeholder: '信息资源名称',
        },
      },
      {
        name: 'mountDataName',
        typeOptions: {
          maxLength: 50,
          placeholder: '关联数据名称',
        },
      },
      {
        name: 'dataType',
        type: 'Select',
        typeOptions: {
          placeholder: '数据类型',
        },
        children: DataTypeSelectOption,
      },
      {
        name: 'subNode',
        type: 'Select',
        typeOptions: {
          placeholder: '订阅节点',
        },
        children: [],
      },
      {
        name: 'subTime',
        type: 'RangePicker',
      },
      {
        name: 'status',
        type: 'Select',
        typeOptions: {
          placeholder: '审核状态',
        },
        children: statusChildren,
      },
    ],
    searchHandler: this.handleSearch,
  };
  columns = [
    {
      dataIndex: 'id',
      title: '序号',
    },
    {
      dataIndex: 'infoSrcName',
      title: '信息资源名称',
    },
    {
      dataIndex: 'mountDataName',
      title: '关联数据名称',
    },
    {
      dataIndex: 'dataType',
      title: '数据类型',
    },
    {
      dataIndex: 'subNode',
      title: '订阅节点',
    },
    {
      dataIndex: 'subTime',
      title: '订阅时间',
    },
    {
      title: '操作',
      render: (_, row) => {
        return (
          <Fragment>
            <a className="mr16" onClick={this.handleGoView.bind(this, row)}>
              查看
            </a>
            {row.authStatus === -1 ? (
              <a onClick={this.handleAuthModalShow.bind(this, row)}>授权</a>
            ) : row.authStatus === undefined ? (
              <Popconfirm title="请确认取消授权" onConfirm={this.cancelAuth.bind(this, row)}>
                <a>取消授权</a>
              </Popconfirm>
            ) : (
              ''
            )}
          </Fragment>
        );
      },
    },
  ];

  state = {
    authStatus: '1',
    modalVisible: false,
  };

  handleGoView = row => {
    console.log(row);
  };

  handleAuthModalShow = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleAuthModalHide = () => {
    this.setState({
      modalVisible: false,
    });
  };

  onOk = value => {
    console.log(value);
  };

  cancelAuth = row => {
    console.log('取消授权', row);
  };

  @Bind()
  @Throttle(1000)
  handleSearch(queryData, resetPage = false) {
    console.log(queryData);
  }

  render() {
    const { modalVisible } = this.state;
    const pagination = {};
    const dataSource = [
      {
        id: 1,
        infoSrcName: '无名子',
      },
      {
        id: 2,
        infoSrcName: '无名子',
      },
    ];
    const paginationProps = {
      ...pagination,
      showQuickJumper: true,
      hideOnSinglePage: true,
      showTotal(total) {
        return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
      },
    };
    return (
      <PageHeaderWrapper>
        <div className="content_layout">
          <SearchForm formOptions={this.formOptions} />
          <Table
            columns={this.columns}
            dataSource={dataSource}
            pagination={paginationProps}
            bordered
            rowKey="id"
          />
          <ModalRadio visible={modalVisible} onCancel={this.handleAuthModalHide} onOk={this.onOk} />
        </div>
      </PageHeaderWrapper>
    );
  }
}
