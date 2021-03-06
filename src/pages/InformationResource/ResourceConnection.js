import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Table,
  Button,
  Card,
  Divider,
  Row,
  Col,
  Modal,
  Input,
  DatePicker,
  Popconfirm,
  Select,
  message,
} from 'antd';
import moment from 'moment';
// import Cookies from 'js-cookie'

import styles from './ResourceConnection.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { RangePicker } = DatePicker;
const { isMoment } = moment;
const { Option } = Select;
let initialData = [];
let enableEditFile = [];
// let resourceDetailData;
let resourceItemDetail = [];
@connect(({ informationResource, loading }) => ({
  informationResource,
  loading: loading.models.informationResource,
}))
export default class ResourceConnection extends Component {
  // goToDetail = row => {
  //   this.props.dispatch(
  //     routerRedux.push({
  //       pathname: `/dataSourceManagement/fileSourceDetail/${row.id}`,
  //       state: row,
  //     })
  //   );
  // };
  state = {
    visible1: false,
    routeId: '',
    visible2: false,
    connectName: '',
    connectType: '',
    startTimes: '',
    endTimes: '',
    connectTime: [],
    chooseName: '',
    chooseName1: '',
    chooseId: '',
    chooseId1: '',
    zcName: '',
    zcId: -1,
    zcType: '',
    fileListData: [],
    // isNodeOperator: false,
    isExpandOrFolder: true,
    dataTypes: '',
    initialType: '',
    hasMounted: '',
    hasSetMounted: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: { state },
    } = this.props;
    dispatch({
      type: 'informationResource/getResources',
      payload: { id: state ? state.routeId : '' },
    });
    this.setState({
      routeId: state ? state.routeId : '',
      fileListData: [],
    });
  }

  componentWillReceiveProps(nextProps) {
    const { hasSetMounted } = this.state;
    this.setState({
      fileListData: [],
    });
    const resourceDetailData = nextProps.informationResource.resourceDetail;
    if (resourceDetailData) {
      this.setState({
        initialType: resourceDetailData.mountType,
        chooseName1: resourceDetailData.mountName,
      });
      if (resourceDetailData.mount) {
        if (!hasSetMounted) {
          this.setState({
            dataTypes: resourceDetailData.mountType,
            hasMounted: resourceDetailData.mount,
            hasSetMounted: true,
          });
        }
        const arr = [];
        initialData = [];
        for (const val in resourceDetailData.mountInfoItemIdMap) {
          enableEditFile.forEach(item => {
            if (+resourceDetailData.mountInfoItemIdMap[val] === +item.id) {
              arr.push(item);
            }
          });
        }
        initialData = [...arr];
        this.setState({
          fileListData: [...arr],
          chooseId1: resourceDetailData.mountId,
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/reset',
    });
  }

  handleSave = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/dataSourceManagement/catalogManagement'));
  };

  handleBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/dataSourceManagement/catalogManagement'));
  };

  showModal1 = () => {
    this.setState({
      visible1: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/getConnectListss',
      payload: { pageNum: 1, pageSize: 10, status: 1, mount: false },
    });
  };

  handleChooseChange = row => {
    this.setState({
      zcName: row.name,
      zcId: row.id,
      zcType: row.type,
    });
  };

  handleSearch = pagination => {
    const { connectName, connectType, startTimes, endTimes } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/getConnectListss',
      payload: {
        pageNum: pagination ? pagination.current : 1,
        pageSize: pagination ? pagination.pageSize : 10,
        name: connectName ? connectName : undefined,
        dataType: connectType ? connectType : undefined,
        beginTime: startTimes ? startTimes : undefined,
        endTime: endTimes ? endTimes : undefined,
        status: 1,
        mount: false,
      },
    });
  };

  handleConnectName = e => {
    this.setState({
      connectName: e.target.value,
    });
  };

  handleConnectType = value => {
    this.setState({
      connectType: value,
    });
  };

  handleConnectTimeChange = val => {
    const timeArr = val.map(item => {
      if (isMoment(item)) {
        return item.format('YYYY-MM-DD');
      }
      return '';
    });
    this.setState({
      startTimes: timeArr[0] ? timeArr[0] : undefined,
      endTimes: timeArr[1] ? timeArr[1] : undefined,
      connectTime: val,
    });
  };

  handleConnectListChange = pagination => {
    this.handleSearch(pagination);
  };

  handleFileTableChange = async pagination => {
    enableEditFile = [];
    const { chooseName, chooseId } = this.state;
    const { dispatch } = this.props;
    await dispatch({
      type: 'informationResource/getFileList',
      payload: {
        id: chooseId,
        pagination: { pageNum: pagination.current, pageSize: pagination.pageSize },
      },
    });
    this.setState({
      fileListData: [...enableEditFile],
    });
  };

  handleFile1TableChange = pagination => {
    const { dispatch } = this.props;
    const { initialType, chooseId1 } = this.state;
    if (initialType === 'ftp') {
      dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: chooseId1,
          pagination: { pageNum: pagination.current, pageSize: pagination.pageSize },
          type: 'ftp',
          type1: 'ftpfile',
        },
      });
      // yield put({
      //   type: 'getResourceDetail',
      //   payload: response.result.data,
      // });
    } else if (initialType === 'file') {
      dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: chooseId1,
          pagination: { pageNum: pagination.current, pageSize: pagination.pageSize },
          type: 'file',
          type1: 'file',
        },
      });
      // yield put({
      //   type: 'getResourceDetail',
      //   payload: response.result.data,
      // });
    } else if (initialType === 'db') {
      dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: chooseId1,
          pagination: { pageNum: pagination.current, pageSize: pagination.pageSize },
          type: 'db',
          type1: 'struct',
        },
      });
    }
    // dispatch({
    //   type: 'informationResource/',
    //   payload: { id: routeId, pageNum: pagination.current, pageSize: pagination.pageSize },
    // });
  };

  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  };

  handleOk1 = async () => {
    initialData = [];
    enableEditFile = [];
    const { zcName, zcId, zcType } = this.state;
    this.setState({
      chooseName: zcName,
      chooseId: zcId,
      abc: zcType,
      dataTypes: zcType,
      visible1: false,
    });
    const { dispatch } = this.props;
    if (zcType === 'ftp') {
      await dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: zcId,
          pagination: { pageNum: 1, pageSize: 10 },
          type: 'ftp',
          type1: 'ftpfile',
        },
      });
      initialData = [...enableEditFile];
      this.setState({
        fileListData: [...enableEditFile],
        hasMounted: true,
      });
    } else if (zcType === 'file') {
      await dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: zcId,
          pagination: { pageNum: 1, pageSize: 10 },
          type: 'file',
          type1: 'file',
        },
      });
      initialData = [...enableEditFile];
      this.setState({
        fileListData: [...enableEditFile],
        hasMounted: true,
      });
    } else if (zcType === 'db') {
      await dispatch({
        type: 'informationResource/getFileList',
        payload: {
          id: zcId,
          pagination: { pageNum: 1, pageSize: 10 },
          type: 'db',
          type1: 'struct',
        },
      });
      initialData = [...enableEditFile];
      this.setState({
        fileListData: [...enableEditFile],
        hasMounted: true,
      });
    }
  };

  handleOk2 = () => {
    this.setState({
      visible2: false,
    });
  };

  handleCancel1 = () => {
    this.setState({
      visible1: false,
      zcName: '',
      zcId: -1,
      zcType: '',
    });
  };

  handleCancel2 = () => {
    this.setState({
      visible2: false,
    });
  };

  handleDeleteFile = id => {
    const { fileListData } = this.state;
    const fileData = [...fileListData];
    fileData.forEach((item, i) => {
      if (+item.id === +id) {
        fileData.splice(i, 1);
      }
    });
    this.setState({
      fileListData: [...fileData],
    });
  };

  handleResetFile = () => {
    this.setState({
      fileListData: [...initialData],
    });
  };

  handleSaveMountData = () => {
    const { routeId, fileListData, chooseId, dataTypes, initialType, chooseId1 } = this.state;
    const { dispatch } = this.props;
    const ids = fileListData.map(item => {
      return item.id;
    });
    const arr = {};
    if (dataTypes === 'db' || (!dataTypes && initialType === 'db')) {
      if (resourceItemDetail.length <= ids.length) {
        resourceItemDetail.forEach((item, j) => {
          const i = item.id;
          arr[i] = ids[j];
        });
      } else {
        ids.forEach((item, j) => {
          arr[resourceItemDetail[j].id] = item;
        });
      }
    } else {
      for (let i = 0; i < ids.length; i += 1) {
        arr[i] = ids[i];
      }
    }
    dispatch({
      type: 'informationResource/saveMountData',
      payload: {
        id: routeId,
        resourceMountDto: {
          infoItemIdMap: arr,
          itemId: chooseId ? chooseId : chooseId1,
          type: dataTypes ? dataTypes : initialType,
        },
      },
    });
  };

  handleCancelMount = () => {
    const { routeId } = this.state;
    const { dispatch } = this.props;
    return Modal.confirm({
      title: '警告',
      content: '是否解除关联？',
      okText: '确认',
      cancelText: '取消',
      onOk: () =>
        dispatch({
          type: 'informationResource/saveMountData',
          payload: {
            id: routeId,
            resourceMountDto: { infoItemIdMap: {}, itemId: null, type: '' },
          },
        }),
    });
  };

  setFileSize = size => {
    if (size === null || size === 0) {
      return '0 Bytes';
    }
    const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const srcSize = parseFloat(size);
    const index = Math.floor(Math.log(srcSize) / Math.log(1024));
    let powNum = 1;
    for (let i = 0, len = index; i < len; i += 1) {
      powNum *= 1024;
    }
    let newSize = srcSize / powNum;
    newSize = newSize.toFixed(2);
    return newSize + unitArr[index];
  };

  isFolderOrExpand = () => {
    const { isExpandOrFolder } = this.state;
    this.setState({
      isExpandOrFolder: !isExpandOrFolder,
    });
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    let time = '';
    let timeName = '';
    // const { resourceVisible, resourceFileVisible, confirmLoading, confirmFileLoading } = this.state;
    const {
      loading,
      informationResource: {
        resourceDetail, // 页面头部 资源的详情
        connectList,
        connectPagination,
        connectFileList,
        connectFilePagination,
        itemList, // 左边的表格的数据
      },
    } = this.props;
    enableEditFile = [...connectFileList];
    // initialData = [...connectFileList]
    // resourceDetailData = resourceDetail;
    resourceItemDetail = itemList;
    const {
      visible1,
      visible2,
      connectName,
      connectType,
      connectTime,
      fileListData,
      isExpandOrFolder,
      initialType,
      dataTypes,
      chooseName,
      chooseName1,
      hasMounted,
      zcName,
    } = this.state;
    if (dataTypes === 'ftp') {
      time = 'time';
      timeName = '挂接时间';
    }
    if (dataTypes === 'file') {
      time = 'uploadTimeStr';
      timeName = '接入时间';
    }
    const pagination = { pageSize: 10, current: 1 };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        render: text => {
          return this.setFileSize(text);
        },
      },
      {
        title: timeName,
        dataIndex: time,
      },
    ];
    // if (isNodeOperator) {
    columns.push({
      title: '操作',
      render: (text, row) => {
        return (
          <Popconfirm
            title={`是否删除${row.fileName || '此行'}?`}
            onConfirm={() => this.handleDeleteFile(row.id)}
          >
            <a>删除</a>
          </Popconfirm>
        );
      },
    });
    // }
    columns.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const columnsLeft = [
      {
        title: '信息项名称',
        dataIndex: 'name',
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
      },
      {
        title: '数据长度',
        dataIndex: 'dataLength',
      },
    ];
    columnsLeft.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const columnsr = [
      {
        title: '字段',
        dataIndex: 'columnName',
      },
      {
        title: '数据类型',
        dataIndex: 'columnType',
      },
      {
        title: '说明',
        dataIndex: 'note',
      },
    ];
    columnsr.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const columns1 = [
      {
        title: '表名称',
        dataIndex: 'tableName',
      },
      {
        title: '字段',
        dataIndex: 'field',
      },
      {
        title: '类型',
        dataIndex: 'types',
      },
      {
        title: '说明',
        dataIndex: 'intro',
      },
      {
        title: '操作',
        render() {
          return <a>删除</a>;
        },
      },
    ];
    columns1.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const columnsModal1 = [
      {
        title: 'ID',
        dataIndex: 'id',
        render: (text, row) => {
          return (
            <div>
              <input type="radio" name="mo1" onChange={this.handleChooseChange.bind(null, row)} />
              <span style={{ marginLeft: 10 }}>{text}</span>
            </div>
          );
        },
      },
      {
        title: '数据名称',
        dataIndex: 'name',
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
      },
      // {
      //   title: '应用系统名称',
      //   dataIndex: 'systemName',
      // },
      {
        title: '接入时间',
        dataIndex: 'createTime',
        render(text) {
          return moment(text).format('lll');
        },
      },
    ];
    columnsModal1.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const columnsModal2 = [
      {
        title: 'ID',
        dataIndex: 'id',
        render(text) {
          return (
            <div>
              <input type="radio" name="mo2" />
              <span style={{ marginLeft: 10 }}>{text}</span>
            </div>
          );
        },
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '文件大小',
        dataIndex: 'fileSize',
      },
      {
        title: '上传人',
        dataIndex: 'uploader',
      },
      {
        title: '上传时间',
        dataIndex: 'uploadTime',
        render(text) {
          return moment(text).format('lll');
        },
      },
    ];
    columnsModal2.forEach(item => {
      Object.defineProperty(item, 'align', {
        value: `center`,
        enumerable: true,
      });
    });
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    const disabled = zcName === '' ? 1 : 0;
    const okButtonProps = { disabled };
    return (
      <PageHeaderWrapper action={buttonList}>
        <div className="btncls">
          <Button onClick={this.handleBack} className="fr mr40">
            返回
          </Button>
          {/* {isNodeOperator && ( */}
          <Button type="primary" className="fr mr40" onClick={this.handleSave}>
            保存
          </Button>
          {/* )} */}
        </div>
        <Card>
          <div className={styles.form}>
            <h3>
              信息资源代码:
              <span> {resourceDetail && resourceDetail.code}</span>
              信息资源名称:
              <span> {resourceDetail && resourceDetail.name}</span>
              信息资源提供方:
              <span> {resourceDetail && resourceDetail.providerDept}</span>
              发布时间:
              <span> {resourceDetail && resourceDetail.shareTime}</span>
            </h3>
            <h3 style={{ display: isExpandOrFolder ? 'none' : 'block' }}>
              提供方代码:
              <span> {resourceDetail && resourceDetail.providerNo}</span>
              信息属性分类:
              <span> {resourceDetail && resourceDetail.typeName}</span>
              信息资源格式:
              <span> {resourceDetail && resourceDetail.format}</span>
              信息资源摘要:
              <span> {resourceDetail && resourceDetail.summary}</span>
            </h3>
            <a style={{ position: 'absolute', right: 35, top: 20 }} onClick={this.isFolderOrExpand}>
              {isExpandOrFolder ? '展开' : '收起'}
            </a>
            <Divider />
          </div>
          <div style={{ marginBottom: 15 }} className="clearfix">
            <div style={{ display: 'inline-block', marginRight: 20 }}>
              <h3>
                关联数据名称:
                <span style={{ marginLeft: 10 }}>{chooseName ? chooseName : chooseName1}</span>
              </h3>
            </div>
            <div style={{ display: 'inline-block' }}>
              <span className={styles.linkBtn} onClick={this.showModal1}>
                去选择
              </span>
              {hasMounted && (
                <span
                  className={styles.linkBtn}
                  style={{
                    marginLeft: 20,
                    display: !dataTypes
                      ? initialType !== 'db'
                        ? 'inline-block'
                        : 'none'
                      : dataTypes !== 'db'
                        ? 'inline-block'
                        : 'none',
                  }}
                  onClick={this.handleResetFile}
                >
                  重载文件
                </span>
              )}
            </div>
            {hasMounted && (
              <span
                className={styles.linkBtn}
                style={{ float: 'right' }}
                onClick={this.handleCancelMount}
              >
                解除关联
              </span>
            )}
          </div>
          <div>
            <Row>
              <Col
                span={!dataTypes ? (initialType !== 'db' ? 0 : 11) : dataTypes !== 'db' ? 0 : 11}
              >
                <Table
                  columns={columnsLeft}
                  dataSource={itemList}
                  loading={loading}
                  // pagination={
                  //   connectFilePagination && {
                  //     ...connectFilePagination,
                  //     showQuickJumper: true,
                  //     showTotal: total =>
                  //       `共 ${Math.ceil(
                  //         total / connectFilePagination.pageSize
                  //       )}页 / ${total}条 数据`,
                  //   }
                  // }
                  pagination={false}
                  rowKey="id"
                  bordered
                  // onChange={this.handleFile1TableChange}
                />
              </Col>
              <Col
                span={!dataTypes ? (initialType !== 'db' ? 0 : 2) : dataTypes !== 'db' ? 0 : 2}
              />
              {hasMounted && (
                <Col
                  span={!dataTypes ? (initialType !== 'db' ? 0 : 11) : dataTypes !== 'db' ? 0 : 11}
                >
                  <Table
                    columns={columnsr}
                    dataSource={fileListData}
                    loading={loading}
                    // pagination={
                    //   connectFilePagination && {
                    //     ...connectFilePagination,
                    //     showQuickJumper: true,
                    //     showTotal: total => `共 ${Math.ceil(+total / 10)}页 / ${total}条 数据`,
                    //   }
                    // }
                    pagination={false}
                    rowKey="id"
                    bordered
                    // onChange={this.handleFile1TableChange}
                  />
                </Col>
              )}
              {hasMounted && (
                <Col
                  span={!dataTypes ? (initialType !== 'db' ? 24 : 0) : dataTypes !== 'db' ? 24 : 0}
                >
                  <Table
                    columns={columns}
                    dataSource={fileListData}
                    loading={loading}
                    pagination={
                      connectFilePagination && {
                        ...connectFilePagination,
                        showQuickJumper: true,
                        showTotal: total => `共 ${Math.ceil(+total / 10)}页 / ${total}条 数据`,
                      }
                    }
                    rowKey="id"
                    bordered
                    onChange={this.handleFileTableChange}
                  />
                </Col>
              )}
            </Row>
            <Button
              loading={loading}
              type="primary"
              style={{ marginTop: 20 }}
              onClick={this.handleSaveMountData}
            >
              保存
            </Button>
          </div>
          <Modal
            title="选择要关联的数据"
            visible={visible1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            width={900}
            okButtonProps={okButtonProps}
          >
            <Row style={{ marginBottom: 20 }}>
              <Col span={5}>
                <Input
                  placeholder="数据名称"
                  maxLength="50"
                  value={connectName}
                  onChange={this.handleConnectName}
                />
              </Col>
              <Col span={5} offset={1}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="数据类型"
                  onChange={this.handleConnectType}
                >
                  <Option value="">全部</Option>
                  <Option value="mysql">mysql</Option>
                  <Option value="sqlserver">sqlserver</Option>
                  <Option value="oracle">oracle</Option>
                  <Option value="dm">dm</Option>
                  <Option value="kingbase">kingbase</Option>
                  <Option value="ftp">ftp</Option>
                  <Option value="sftp">sftp</Option>
                  <Option value="file">文件</Option>
                </Select>
              </Col>
              <Col span={8} offset={1}>
                <RangePicker onChange={this.handleConnectTimeChange} value={connectTime} />
              </Col>
              <Col span={3} offset={1}>
                <Button type="primary" onClick={this.handleSearch.bind(null, '')}>
                  搜索
                </Button>
              </Col>
            </Row>
            <Table
              columns={columnsModal1}
              dataSource={connectList}
              loading={loading}
              onChange={this.handleConnectListChange}
              pagination={
                connectPagination && {
                  ...connectPagination,
                  showQuickJumper: true,
                  showTotal: total =>
                    `共 ${Math.ceil(total / connectPagination.pageSize)}页 / ${total}条 数据`,
                }
              }
              rowKey="id"
              bordered
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
