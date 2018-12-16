/* eslint-disable react/no-multi-comp */
/* eslint-disable no-param-reassign */
import React, { Component, Fragment, PureComponent } from 'react';
import { Table, Select, Modal, Radio, Input, Card, Divider, Icon, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { Bind, Throttle } from 'lodash-decorators';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/SearchForm';
// import KeyValue from '@/components/KeyValue';
import DescriptionList from '@/components/DescriptionList';
import DataTypeSelectOption from '@/components/DataTypeSelectOption';
import styles from './Assess.less';

const { Option } = Select;
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
  { value: '-11', label: '修改待审核' },
  { value: '-21', label: '删除待审核' },
  { value: '0', label: '已拒绝' },
  { value: '10', label: '修改已拒绝' },
  { value: '20', label: '删除已拒绝' },
  { value: '1', label: '已通过' },
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

// 接入数据配置组件
class ResuoceInfo extends PureComponent {
  render() {
    const {
      dataType,
      loadingConfig,
      loadingTable,
      loadingStruct,
      currentDetail = {},
      currentSync = {},
      currentList = {},
      syncVisible = false,
      listVisible = false,
    } = this.props;

    const dbColumn = [
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
    const ftpColumn = [
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
    const fileColumn = [
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

    const tableList = [currentDetail];

    return (
      <Fragment>
        <Spin spinning={loadingConfig}>
          <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
            <Description term="数据名称">{currentDetail.name}</Description>
            <Description term="文件所属单位">{currentDetail.createUnit}</Description>
            <Description term="数据描述">{currentDetail.describe}</Description>
            <Description term="负责人姓名">{currentDetail.dutyName}</Description>
            <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
            <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
          </DescriptionList>
          {syncVisible && (
            <Fragment>
              <Divider />
              <DescriptionList size="large" title="同步信息" style={{ marginBottom: 32 }}>
                <Description term="同步模式">{currentSync.syncMode}</Description>
                <Description term="同步频率">{currentSync.syncRate}</Description>
                <Description term="定时设置">每{currentSync.timeSet}</Description>
                <Description term="自动停止">{currentSync.stopNum}次</Description>
              </DescriptionList>
            </Fragment>
          )}
          {listVisible &&
            (dataType === 'db' ? (
              <Fragment>
                <Divider style={{ marginBottom: 32 }} />
                <div className={styles.title}>表信息</div>
                <Table
                  style={{ marginBottom: 24 }}
                  loading={loadingTable}
                  dataSource={tableList}
                  columns={dbColumn}
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
            ) : dataType === 'ftp' ? (
              <Fragment>
                <Divider style={{ marginBottom: 32 }} />
                <div className={styles.title}>文件信息</div>
                <Table
                  style={{ marginBottom: 24 }}
                  loading={loadingTable}
                  dataSource={currentList}
                  columns={ftpColumn}
                  rowKey="id"
                />
              </Fragment>
            ) : (
              <Fragment>
                <Divider style={{ marginBottom: 32 }} />
                <div className={styles.title}>文件信息</div>
                <Table
                  style={{ marginBottom: 24 }}
                  loading={loadingTable}
                  dataSource={currentList}
                  columns={fileColumn}
                  rowKey="id"
                />
              </Fragment>
            ))}
        </Spin>
      </Fragment>
    );
  }
}

@connect(({ assess, accessData, loading }) => ({
  assess,
  accessData,
  loading: loading.models.assess,
  loadingTable: loading.effects['accessData/getCurrentdetail'],
  loadingStruct: loading.effects['accessData/getCurrentList'],
  loadingConfig:
    loading.effects['accessData/getCurrentdetail'] || loading.effects['accessData/getCurrentSync'],
}))
class Assess extends Component {
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
          <Ellipsis tooltip lines={1}>
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
          <Ellipsis tooltip lines={1}>
            {text || '暂无'}
          </Ellipsis>
        );
      },
    },
    {
      dataIndex: 'createTime', // applyTime updateTime
      title: '申请时间',
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
        const status = statusArray.find(item => +item.value === text) || {};
        return <span className={classNameObject[text]}>{status.label}</span>;
      },
    },
    {
      title: '操作',
      render: (_, row) => {
        // 这下面复杂的判断,不是我的本意
        let index = 1;
        let showData = true;
        let isCurOption = true; // eslint-disable-line
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
              onClick={this[`handle${item}`].bind(this, row, showData, isCurOption)}
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
    modalVisible: false,
    syncVisible: false,
    listVisible: false,
    dataType: 'db',
    // hasSetCurrent: false,
    // currentConfig: [1, -11, 10],
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

  // eslint-disable-next-line
  handleview = (row, showData, isCurOption) => {
    const { type: dataType } = row;
    const { dispatch } = this.props;
    if (dataType !== 'file') {
      dispatch({
        type: 'accessData/getCurrentSync',
        payload: {
          id: row.id,
          dataType,
        },
      });
      this.setState({
        syncVisible: true,
      });
    } else {
      this.setState({
        syncVisible: false,
      });
    }
    if (isCurOption) {
      dispatch({
        type: 'accessData/getCurrentdetail',
        payload: {
          id: row.id,
          dataType,
        },
      });
    } else {
      dispatch({
        type: 'accessData/getWillDetail',
        payload: {
          id: row.id,
          dataType,
        },
      });
    }
    if (showData) {
      this.setState({
        listVisible: true,
      });
      dispatch({
        type: 'accessData/getCurrentList',
        payload: {
          id: row.id,
          dataType,
        },
      });
    } else {
      this.setState({
        listVisible: false,
      });
    }
    this.setState({
      modalVisible: true,
      dataType,
    });
  };

  handleConfigCancel = () => {
    this.setState({
      modalVisible: false,
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
    // eslint-disable-next-line
    let { status, type, rejectReason, dataId, row } = this.state;
    const { dispatch } = this.props;
    if (status === 1) {
      status = 1;
    } else {
      switch (row.status) {
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
    dispatch({
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

  renderDbInfo = showData => {
    console.log('表格'); // eslint-disable-line
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
    console.log(currentDetail, currentSync, currentList); // eslint-disable-line
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
        render: text => this.setFileSize(parseInt(text, 10)),
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
  @Throttle(300, { trailing: false })
  handleSearch(queryData = {}, resetPage = false) {
    // eslint-disable-next-line
    const pagination = resetPage ? { pageNum: 1, pageSize: 10 } : this.state.pagination;
    const { dispatch } = this.props;
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
    queryData.mount = true;
    dispatch({
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
      loadingConfig,
      loadingTable,
      loadingStruct,
      accessData: { currentDetail, currentSync, currentList },
    } = this.props;
    const { dataType, assessVisible, status, modalVisible, syncVisible, listVisible } = this.state;
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
            className={styles.table}
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
          <Modal
            width={900}
            visible={modalVisible}
            title="当前配置"
            okButtonProps={{ hidden: true }}
            cancelText="关闭"
            onCancel={this.handleConfigCancel}
          >
            <ResuoceInfo
              dataType={dataType}
              currentDetail={currentDetail}
              currentList={currentList}
              currentSync={currentSync}
              syncVisible={syncVisible}
              listVisible={listVisible}
              loadingConfig={loadingConfig}
              loadingTable={loadingTable}
              loadingStruct={loadingStruct}
            />
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default Assess;
