import React, { Component, Fragment } from 'react';
import { Table, Select, Modal, Button, Radio, Input, Card, Divider } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Bind, Throttle } from 'lodash-decorators';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
import KeyValue from '@/components/KeyValue';
import DescriptionList from '@/components/DescriptionList';
import DataTypeSelectOption from '@/components/DataTypeSelectOption';
import styles from './Assess.less';

const { Option, OptGroup } = Select;
const { Group } = Radio;
const { TextArea } = Input;
const { Description } = DescriptionList;

// 审核状态
// const statusObject = {
//   'all': '全部',
//   '-1': '待审核',
//   '0': '已拒绝',
//   '1': '已通过',
//   '10': '修改已拒绝',
//   '-11': '修改待审核',
//   '20': '删除已拒绝',
//   '-21': '删除待审核',
// }
const statusArray = [
  { value: 'all', label: '全部' },
  { value: '-1', label: '待审核' },
  { value: '0', label: '已拒绝' },
  { value: '1', label: '已通过' },
  { value: '10', label: '修改已拒绝' },
  { value: '-11', label: '修改待审核' },
  { value: '20', label: '删除已拒绝' },
  { value: '-21', label: '删除待审核' },
];
const classNameObject = {
  '-1': 'blue',
  '0': 'red',
  '1': 'green',
  '10': 'red',
  '-11': 'blue',
  '20': 'red',
  '-21': 'blue',
};
// const statusData = Object.entries(statusObject);

@connect(({ assess, accessData, loading }) => ({
  assess,
  accessData,
  loading: loading.models.assess,
  loadingTable: loading.effects['accessData/getCurrentdetail'],
  loadingStruct: loading.effects['accessData/getCurrentList'],
}))
export default class Assess extends Component {
  formOptions = {
    formData: [
      {
        name: 'name',
        typeOptions: {
          placeholder: '数据名称',
          maxLength: 50,
        },
      },
      {
        name: 'appsysName',
        typeOptions: {
          placeholder: '应用系统名称',
          maxLength: 50,
        },
      },
      {
        name: 'dataType',
        type: 'Select',
        itemOptions: {
          className: 'w150 fl mr16',
        },
        typeOptions: {
          placeholder: '数据类型',
          allowClear: true,
        },
        children: DataTypeSelectOption,
      },
      {
        name: 'time',
        type: 'RangePicker',
      },
      {
        name: 'status',
        type: 'Select',
        typeOptions: {
          placeholder: '审核状态',
          allowClear: true,
        },
        children: statusArray.map(item => (
          <Option value={item.value} key={item.value}>
            {item.label}
          </Option>
        )),
      },
    ],
    searchHandler: this.handleSearch,
  };

  operationsObject = {
    infoResource: '信息资源',
    view: '查看',
    assessLog: '审核日志',
    assess: '审核',
  };

  operationsData = [
    ['view', 'assess'],
    ['assessLog'],
    ['infoResource', 'view', 'assessLog'],
    ['infoResource', 'view', 'assessLog', 'assess'],
    ['infoResource', 'assessLog'],
  ];

  columns = [
    {
      dataIndex: 'id',
      title: '序号',
    },
    {
      dataIndex: 'name',
      title: '数据名称',
      width: '400px',
      render(text) {
        return (
          <Ellipsis tooltip={true} lines={1}>
            {text}
          </Ellipsis>
        );
      },
    },
    {
      dataIndex: 'dataType',
      title: '数据类型',
    },
    {
      dataIndex: 'appsysName',
      title: '应用系统名称',
      width: '200px',
      render(text) {
        return (
          <Ellipsis tooltip={true} lines={1}>
            {text || '暂无'}
          </Ellipsis>
        );
      },
    },
    {
      dataIndex: 'updateTime',
      title: '提交时间',
    },
    // {
    //   dataIndex: 'audit',
    //   title: '审核类型',
    // },
    {
      dataIndex: 'status',
      title: '审核状态',
      render(text) {
        // return statusData.find(item => item.value === text).label
        return (
          <span className={classNameObject[text]}>
            {statusArray.find(item => +item.value === text).label}
          </span>
        );
      },
    },
    {
      title: '操作',
      render: (_, row) => {
        // 这下面复杂的判断,不是我的本意
        let index = 1;
        let showData = true;
        let isCurOption = true;
        if (row.status === -1) {
          index = 0;
          isCurOption = false;
          showData = false;
        } else if (row.status === 1) {
          index = 2;
          showData = false;
        } else if (row.status === -11 || row.status === -21) {
          index = 3;
          if (row.status === -21) {
            showData = false;
          } else {
            isCurOption = false;
          }
        } else {
          index = 4;
        }
        return this.operationsData[index].map(item => {
          if (item === 'infoResource' && !row.resourceId) {
            return (
              <a className="mr16 disabled" key={item}>
                信息资源
              </a>
            );
          }
          return (
            <a
              className="mr16"
              onClick={this['handle' + item].bind(this, row, showData)}
              key={item}
            >
              {this.operationsObject[item]}
            </a>
          );
        });
      },
    },
  ];

  state = {
    queryData: {},
    pagination: { pageNum: 1, pageSize: 10 },
    row: {},
    dataId: 0,
    type: 'ftp',
    assessVisible: false,
    status: 1,
    rejectReason: '',
    hasSetCurrent: false,
    currentConfig: [1, -11, 10],
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleChange = pagination => {
    this.setState(
      {
        pagination: {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      },
      () => {
        const { queryData } = this.state;
        this.handleSearch(queryData);
      }
    );
  };

  handleinfoResource = row => {
    // console.log(row, '信息资源')
    router.push(
      `/data/management/infoSource/${row.type || 'ftp'}/${row.id || 0}/${row.resourceId || 0}`
    );
  };

  handleview = (row, showData, isCurOption) => {
    const { dispatch } = this.props;
    const { type } = row;
    this.showCurrentConfig(row, showData);
    dispatch({
      type: 'accessData/getCurrentdetail',
      payload: {
        id: row.id,
        type,
      },
    });
    dispatch({
      type: 'accessData/getCurrentList',
      payload: {
        id: row.id,
        type,
      },
    });
  };

  handleassessLog = row => {
    // 查看日志
    router.push(`/data/assessLog/${row.type || 'ftp'}/${row.id || 0}`);
  };

  handleassess = row => {
    // console.log(row)
    this.setState({
      row,
      dataId: row.id || 1,
      assessVisible: true,
      type: row.type || 'ftp',
    });
  };

  handleAssessOk = () => {
    let { status, type, rejectReason, dataId, row } = this.state;
    if (status === 1) {
      status = 1;
    } else {
      switch (this.state.row.status) {
        case -1:
          status = 0;
          break;
        case -11:
          status = 10;
          break;
        default:
          status = 20;
          break;
      }
    }
    // 这里发送 审核请求
    this.props.dispatch({
      type: 'assess/assessData',
      payload: {
        id: dataId,
        type,
        body: {
          status,
          reason: rejectReason,
        },
      },
    });
    this.setState({
      assessVisible: false,
    });
  };

  handleAssessCancel = () => {
    this.setState({
      assessVisible: false,
    });
  };

  handlePassChange = e => {
    this.setState({
      status: e.target.value,
    });
  };

  reasonChange = e => {
    this.setState({
      rejectReason: e.target.value,
    });
  };

  showCurrentConfig = (row, showData) => {
    const { type: dataType } = row;
    Modal.info({
      title: '当前配置',
      width: 900,
      okText: '关闭',
      maskClosable: false,
      content: (() => {
        switch (dataType) {
          case 'db':
            return this.renderDbInfo(showData);
          case 'ftp':
            return this.renderFtpInfo(showData);
          case 'file':
            return this.renderFileInfo(showData);
          default:
            return '';
        }
      })(),
    });
  };

  renderDbInfo = showData => {
    console.log('表格');
    const {
      loadingTable,
      loadingStruct,
      accessData: { currentDetail, currentSync, currentList },
    } = this.props;
    const tableList = [currentDetail];
    const tableColumn = [
      {
        title: '表名称',
        dataIndex: 'tableName',
        align: 'center',
      },
      {
        title: '中文标注',
        dataIndex: 'tableNote',
        align: 'center',
      },
    ];
    const structColumn = [
      {
        title: '主键',
        dataIndex: 'primaryKey',
        render: text => {
          if (text) {
            return <Icon style={{ color: '#fb9a03' }} type="key" theme="outlined" />;
          }
          return '';
        },
      },
      {
        title: '字段名称',
        dataIndex: 'columnName',
      },
      {
        title: '数据类型',
        dataIndex: 'columnType',
      },
      {
        title: '中文标注',
        dataIndex: 'note',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据库">{currentDetail.dbName}</Description>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="建库单位">{currentDetail.createUnit}</Description>
          <Description term="应用系统名称">{currentDetail.appsysName}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="同步信息" style={{ marginBottom: 32 }}>
          <Description term="同步模式">{currentSync.syncMode}</Description>
          <Description term="同步频率">{currentSync.syncRate}</Description>
          <Description term="定时设置">每{currentSync.timeSet}</Description>
          <Description term="自动停止">{currentSync.stopNum}次</Description>
        </DescriptionList>
        {showData && (
          <Fragment>
            <Divider style={{ marginBottom: 32 }} />
            <div className={styles.title}>表信息</div>
            <Table
              style={{ marginBottom: 24 }}
              loading={loadingTable}
              dataSource={tableList}
              columns={tableColumn}
              rowKey="id"
            />
            <div className={styles.title}>结构信息</div>
            <Table
              style={{ marginBottom: 16 }}
              loading={loadingStruct}
              dataSource={currentList}
              columns={structColumn}
              rowKey="id"
            />
          </Fragment>
        )}
      </Card>
    );
  };

  renderFtpInfo = showData => {
    const {
      loadingTable,
      accessData: { currentDetail, currentSync, currentList },
    } = this.props;
    console.log(currentDetail, currentSync, currentList);
    const tableColumn = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '文件类型',
        dataIndex: 'type',
      },
      {
        title: '文件相对路径',
        dataIndex: 'path',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="文件所属单位">{currentDetail.createUnit}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="同步信息" style={{ marginBottom: 32 }}>
          <Description term="同步模式">{currentSync.syncMode}</Description>
          <Description term="同步频率">{currentSync.syncRate}</Description>
          <Description term="定时设置">每{currentSync.timeSet}</Description>
          <Description term="自动停止">{currentSync.stopNum}次</Description>
        </DescriptionList>
        {showData && (
          <Fragment>
            <Divider style={{ marginBottom: 32 }} />
            <div className={styles.title}>文件信息</div>
            <Table
              style={{ marginBottom: 24 }}
              loading={loadingTable}
              dataSource={currentList}
              columns={tableColumn}
              rowKey="id"
            />
          </Fragment>
        )}
      </Card>
    );
  };

  renderFileInfo = showData => {
    const {
      loadingTable,
      accessData: { currentDetail, currentList },
    } = this.props;
    const tableColumn = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '文件类型',
        dataIndex: 'type',
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        render: text => this.setFileSize(parseInt(text)),
      },
      {
        title: '最近更新时间',
        dataIndex: 'uploadTimeStr',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="文件所属单位">{currentDetail.createUnit}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        {showData && (
          <Fragment>
            <Divider style={{ marginBottom: 32 }} />
            <div className={styles.title}>文件信息</div>
            <Table
              style={{ marginBottom: 24 }}
              loading={loadingTable}
              dataSource={currentList}
              columns={tableColumn}
              rowKey="id"
            />
          </Fragment>
        )}
      </Card>
    );
  };

  @Bind()
  @Throttle(1000)
  handleSearch(queryData = {}, resetPage = false) {
    const pagination = resetPage ? { pageNum: 1, pageSize: 10 } : this.state.pagination;
    this.setState({
      queryData,
    });
    if (queryData.time && queryData.time.length > 0) {
      queryData.beginTime = queryData.time[0].format().substr(0, 10);
      queryData.endTime = queryData.time[1].format().substr(0, 10);
    }
    if (queryData.status === 'all') {
      delete queryData.status;
    }
    delete queryData.time;
    this.props.dispatch({
      type: 'assess/getAssessList',
      payload: {
        params: {
          ...pagination,
          ...queryData,
        },
      },
    });
  }

  render() {
    const {
      assess: { assessList, pagination },
      loading,
    } = this.props;
    const { assessVisible, status, rejectReason } = this.state;
    const paginationProps = {
      showQuickJumper: true,
      hideOnSinglePage: true,
      showTotal(total) {
        return `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`;
      },
      ...pagination,
    };
    return (
      <PageHeaderWrapper>
        <div className="content_layout">
          <SearchForm formOptions={this.formOptions} />
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={assessList}
            onChange={this.handleChange}
            pagination={paginationProps}
            rowKey="index"
            bordered
          />
          <Modal
            title="审核"
            visible={assessVisible}
            onOk={this.handleAssessOk}
            onCancel={this.handleAssessCancel}
          >
            <div className={styles.modals}>
              <div>
                <Group value={status} onChange={this.handlePassChange}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={0}>拒绝</Radio>
                </Group>
              </div>
              <div style={{ display: +status === 1 ? 'block' : 'none' }}>
                您是否确定通过此次审核?
              </div>
              <div style={{ display: +status === 0 ? 'block' : 'none' }}>
                <div style={{ marginBottom: '10px' }}>请输入拒绝理由</div>
                <TextArea row={5} onChange={this.reasonChange} />
              </div>
            </div>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}
