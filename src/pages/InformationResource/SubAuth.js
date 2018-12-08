import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Select, Table, Modal, Radio, Input, Popconfirm } from 'antd';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
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

@connect(({ subAuth, loading }) => ({ subAuth, loading: loading.models.subAuth }))
export default class SubAuth extends Component {
  formOptions = {
    formData: [
      {
        name: 'dsName',
        typeOptions: {
          maxLength: 50,
          placeholder: '信息资源名称',
        },
      },
      // {
      //   name: 'mountDataName',
      //   typeOptions: {
      //     maxLength: 50,
      //     placeholder: '关联数据名称',
      //   },
      // },
      {
        name: 'dataType',
        type: 'Select',
        typeOptions: {
          placeholder: '数据类型',
        },
        children: DataTypeSelectOption,
      },
      // {
      //   name: 'subNode',
      //   type: 'Select',
      //   typeOptions: {
      //     placeholder: '订阅节点',
      //   },
      //   children: [],
      // },
      {
        name: 'subTime',
        type: 'RangePicker',
      },
      {
        name: 'subscribeStatus',
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
      dataIndex: 'index',
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
            {row.subscribeStatus === -1 ? (
              <a onClick={this.handleAuthModalShow.bind(this, row)}>授权</a>
            ) : row.subscribeStatus === 11111 ? (
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
    row: {},
    modalVisible: false,
    pagination: { pageSize: 10, pageNum: 1 },
    queryData: {},
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleGoView = row => {
    console.log(row);
  };

  handleAuthModalShow = row => {
    this.setState({
      modalVisible: true,
      row: { ...row },
    });
  };

  handleAuthModalHide = () => {
    this.setState({
      modalVisible: false,
    });
  };

  onOk = value => {
    const { dsID, subID, subscriberID } = this.state.row;
    this.props.dispatch({
      type: 'subAuth/subscribeAudit',
      payload: {
        codeReply: value.subscribeStatus,
        reason: value.reason,
        dsID,
        subID,
        subscriberID,
      },
    });
  };

  cancelAuth = row => {
    console.log('取消授权', row);
  };

  @Bind()
  @Throttle(1000)
  handleSearch(queryData = {}, resetPage = false) {
    const pagination = resetPage ? { pageSize: 10, pageNum: 1 } : this.state.pagination;
    this.setState({
      queryData: {
        ...queryData,
      },
    });
    const { dispatch } = this.props;
    if (queryData.subTime && queryData.subTime.length > 0) {
      queryData.beginTime = queryData.subTime[0].format().substr(0, 10);
      queryData.endTime = queryData.subTime[1].format().substr(0, 10);
    }
    delete queryData.subTime;
    dispatch({
      type: 'subAuth/getSubAuthList',
      payload: {
        ...pagination,
        ...queryData,
      },
    });
  }

  render() {
    const { modalVisible } = this.state;
    const {
      subAuth: { dataList, pagination },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div className="content_layout">
          <SearchForm formOptions={this.formOptions} />
          <StandardTable
            loading={loading}
            columns={this.columns}
            dataSource={dataList}
            pagination={pagination}
            bordered
            rowKey="index"
          />
          <ModalRadio visible={modalVisible} onCancel={this.handleAuthModalHide} onOk={this.onOk} />
        </div>
      </PageHeaderWrapper>
    );
  }
}
