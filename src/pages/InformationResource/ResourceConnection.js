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
  message,
} from 'antd';
import moment from 'moment';
// import Cookies from 'js-cookie'

import styles from './ResourceConnection.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

const { RangePicker } = DatePicker;
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
    visible2: false,
    // isNodeOperator: false,
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
      payload: { pageNum: 1, pageSize: 10 },
    });
  };

  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  };

  handleOk1 = () => {
    this.setState({
      visible1: false,
    });
  };

  handleOk2 = () => {
    this.setState({
      visible2: false,
    });
  };

  handleCancel1 = () => {
    this.setState({
      visible1: false,
    });
  };

  handleCancel2 = () => {
    this.setState({
      visible2: false,
    });
  };

  render() {
    // const { resourceVisible, resourceFileVisible, confirmLoading, confirmFileLoading } = this.state;
    const {
      informationResource: { resourceDetail, connectList },
    } = this.props;
    console.log(resourceDetail);
    const { visible1, visible2 } = this.state;
    const pagination = { pageSize: 10, current: 1 };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
      },
      {
        title: '类型',
        dataIndex: 'types',
      },
      {
        title: '文件大小',
        dataIndex: 'fileSize',
      },
      {
        title: '挂接时间',
        dataIndex: 'connectionTime',
        render(text) {
          return moment(text).format('lll');
        },
      },
    ];
    // if (isNodeOperator) {
    columns.push({
      title: '操作',
      render(text, row) {
        return (
          <Popconfirm
            title={`是否删除${row.fileName || '此行'}?`}
            onConfirm={() => message.info('删除成功!')}
          >
            <a>删除</a>
          </Popconfirm>
        );
      },
    });
    // }
    columns.forEach(item => {
      item.align = 'center';
    });
    const list = [
      {
        id: 0,
        fileName: '城市低保标准表(各市第1季度).xlsx',
        types: 'Zip',
        fileSize: '1.38MB',
        connectionTime: 342323333,
      },
      {
        id: 1,
        fileName: '农村低保标准表(各地第1季度).json',
        types: 'json',
        fileSize: '0.12MB',
        connectionTime: 3423233,
      },
      {
        id: 2,
        fileName: '人口普查数据.xml',
        types: 'jpeg',
        fileSize: '1.56MB',
        connectionTime: 34223233,
      },
    ];
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
      item.align = 'center';
    });
    const columnsModal1 = [
      {
        title: 'ID',
        dataIndex: 'id',
        render(text) {
          return (
            <div>
              <input type="radio" name="mo1" />
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
      item.align = 'center';
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
      item.align = 'center';
    });
    const listModal1 = [
      {
        id: 0,
        sourceName: '城市低保标准',
        dataType: '文件',
        systemName: '统计系统',
        registerTime: 451233554,
      },
      {
        id: 1,
        sourceName: '农村低保准备',
        dataType: '文件',
        systemName: '统计系统',
        registerTime: 451233554,
      },
      {
        id: 2,
        sourceName: '人口统计',
        dataType: '文件',
        systemName: '统计系统',
        registerTime: 451233554,
      },
    ];
    const listModal2 = [
      {
        fileName: '城市低保标准表(各市第7季度).xlsx',
        type: 'Zip',
        fileSize: '1.38MB',
        uploader: '张三',
        uploadTime: 4512211,
      },
      {
        fileName: '农村低保标准表(各地第1季度).json',
        type: 'json',
        fileSize: '0.12MB',
        uploader: '李四',
        uploadTime: 4512211,
      },
      {
        fileName: '人口普查数据.xml',
        type: 'jpeg',
        fileSize: '1.56MB',
        uploader: '王五',
        uploadTime: 4512211,
      },
    ];
    return (
      <PageHeaderLayout>
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
              <Button style={{ marginLeft: 10 }}>查看更多</Button>
            </h3>
            <Divider />
          </div>
          <div style={{ marginBottom: 15 }} className="clearfix">
            <div style={{ display: 'inline-block', marginRight: 20 }}>
              <h3>
                关联数据名称:
                <span style={{ marginLeft: 10 }}>城市低保标准</span>
              </h3>
            </div>
            {/* {isNodeOperator && ( */}
            <div style={{ display: 'inline-block' }}>
              <span className={styles.linkBtn} onClick={this.showModal1}>
                去选择
              </span>
              <span className={styles.linkBtn} style={{ marginLeft: 20 }}>
                重载文件
              </span>
            </div>
            <span className={styles.linkBtn} style={{ float: 'right' }}>
              取消关联
            </span>
            {/* )} */}
          </div>
          {/* <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'inline-block', marginRight: 20 }}>
              <h3>挂接资源检索关系设置:</h3>
            </div>
            {/* {isNodeOperator && ( */}
          {/* <div style={{ display: 'inline-block' }}>
                <span className={styles.linkBtn} onClick={this.showModal2}>
                  去选择
                </span>
              </div> */}
          {/* )} */}
          {/* </div> */}
          <div>
            <Table
              columns={columns}
              dataSource={list}
              pagination={
                pagination && {
                  ...pagination,
                  showQuickJumper: true,
                  showTotal: total =>
                    `共 ${Math.ceil(total / pagination.pageSize)}页 / ${total}条 数据`,
                }
              }
              rowKey="id"
              bordered
            />
            <Button type="primary">保存</Button>
          </div>
          <Modal
            title="选择要挂接的数据"
            visible={visible1}
            onOk={this.handleOk1}
            onCancel={this.handleCancel1}
            width={900}
          >
            <Row style={{ marginBottom: 20 }}>
              <Col span={5}>
                <Input placeholder="资源名称" />
              </Col>
              <Col span={5} offset={1}>
                <Input placeholder="数据源类型" />
              </Col>
              <Col span={5} offset={1}>
                <RangePicker />
              </Col>
              <Col span={5} offset={1}>
                <Button type="primary">搜索</Button>
              </Col>
            </Row>
            <Table
              columns={columnsModal1}
              dataSource={listModal1}
              pagination={
                pagination && {
                  ...pagination,
                  showQuickJumper: true,
                  showTotal: total =>
                    `共 ${Math.ceil(total / pagination.pageSize)}页 / ${total}条 数据`,
                }
              }
              rowKey="id"
              bordered
            />
          </Modal>
          {/* <Modal
            title="选择要挂接的数据"
            visible={visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
            width={900}
          >
            <Table
              columns={columnsModal2}
              dataSource={listModal2}
              pagination={
                pagination && {
                  ...pagination,
                  showQuickJumper: true,
                  showTotal: total =>
                    `共 ${Math.ceil(total / pagination.pageSize)}页 / ${total}条 数据`,
                }
              }
              rowKey="id"
              bordered
            />
          </Modal> */}
        </Card>
      </PageHeaderLayout>
    );
  }
}
