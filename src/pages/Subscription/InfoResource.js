import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Modal, Input, Form } from 'antd';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCard from '@/components/ViewCard';

const FormItem = Form.Item;
@connect(({ infoResource, loading }) => ({
  infoResource,
  loading: loading.models.infoResource,
  confirmLoading: loading.effects['infoResource/subscribe'],
}))
@Form.create()
class InfoResource extends Component {
  state = {
    visible: false,
    record: {},
  };

  componentDidMount() {
    const { dispatch, match, location } = this.props;
    if (location.params) {
      this.setState({
        record: location.params.record,
      });
      sessionStorage.setItem('subInfo', JSON.stringify(location.params.record));
    } else {
      const record = JSON.parse(sessionStorage.getItem('subInfo'));
      this.setState({
        record,
      });
    }
    dispatch({
      type: 'infoResource/getResourceDetail',
      payload: {
        resourceId: match.params.resourceId,
      },
    });
    dispatch({
      type: 'infoResource/getDataDetail',
      payload: {
        resourceId: match.params.mountResourceId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'infoResource/reset',
    });
  }

  handleOrder = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    e.preventDefault();
    let dataType;
    const { dispatch, form } = this.props;
    const { record } = this.state;
    if (record.mountResourceId.indexOf('db') !== -1) {
      dataType = `db`;
    } else if (record.mountResourceId.indexOf('ftp') !== -1) {
      dataType = `ftp`;
    } else if (record.mountResourceId.indexOf('file') !== -1) {
      dataType = `file`;
    } else {
      dataType = '';
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        catalogId: record.typeId,
        dataType,
        directoryName: record.resourceProjectCatalogType,
        dsID: record.resourceId,
        dsName: record.resourceName,
        kafkaTopic: record.kafkaTopic,
        mountResourceId: record.mountResourceId,
        mountResourceName: record.mountResourceName,
        publishInstitution: record.nodeName,
        publisherID: record.nodeId,
        subscribeName: fieldsValue.subscribeName,
        subscriptionAuth: record.subscriptionAuth,
        synchronizationType: record.synchronizationType,
      };
      dispatch({
        type: 'infoResource/subscribe',
        payload: {
          ...params,
        },
        callback: res => {
          if (res.code < 300 && res.code >= 0) {
            this.setState({
              visible: false,
              record: {
                ...record,
                orderStatus: '已订阅',
              },
            });
            sessionStorage.setItem(
              'subInfo',
              JSON.stringify({
                ...record,
                orderStatus: '已订阅',
              })
            );
          }
        },
      });
    });
  };

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      visible: false,
    });
  };

  setTimeFormat = val => {
    let str = '';
    if (val) {
      str = val.replace('-', '');
    }
    return str;
  };

  setSync = val => {
    if (val.value.syncEntity) {
      if (val.value.syncEntity.syncRate === '定时') {
        return `${val.value.syncEntity.syncMode}-${
          val.value.syncEntity.syncRate
        } 每${this.setTimeFormat(val.value.syncEntity.timeSet)}`;
      }
      return `${val.value.syncEntity.syncMode}-${val.value.syncEntity.syncRate}`;
    }
    return '无';
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  renderViewCard() {
    const {
      infoResource: { resourceDetail },
    } = this.props;
    const viewData = {
      title: '信息资源详情',
      col: 3,
      data: [
        {
          key: '信息资源代码',
          value: resourceDetail.resourceCode,
        },
        {
          key: '信息资源名称',
          value: resourceDetail.resourceName,
        },
        {
          key: '信息资源属性分类',
          value: resourceDetail.resourceProjectCatalogType,
        },
        {
          key: '信息资源提供方',
          value: resourceDetail.resourceProviderName,
        },
        {
          key: '提供方代码',
          value: resourceDetail.resourceProviderCode,
        },
        {
          key: '提供方内部部门',
          value: resourceDetail.resourceProviderDepartment,
        },
        {
          key: '更新周期',
          value: resourceDetail.resourceUpdateCycle,
        },
        {
          key: '发布日期',
          value: resourceDetail.resourcePublishTime,
        },
        {
          key: '共享日期',
          value: resourceDetail.shareTime,
        },
        {
          key: '信息资源格式',
          value: resourceDetail.resourceFormatClassify,
        },
        {
          key: '关联资源代码',
          value: resourceDetail.relateCode,
        },
        {
          key: '信息项',
          value: resourceDetail.itemNum,
        },
        {
          key: '信息资源摘要',
          value: resourceDetail.resourceAbstract,
          fullWidth: true,
          lines: 3,
        },
      ],
    };
    return <ViewCard data={viewData} />;
  }

  renderViewCardData() {
    // let path;
    const {
      infoResource: { dataDetail },
    } = this.props;
    // if (match.params.mountResourceId.indexOf('db') !== -1) {
    //   path = `/data/management/dbview/${match.params.id}`;
    // } else if (match.params.mountResourceId.indexOf('ftp') !== -1) {
    //   path = `/data/management/ftpview/${match.params.id}`;
    // } else if (match.params.mountResourceId.indexOf('file') !== -1) {
    //   path = `/data/management/fileview/${match.params.id}`;
    // } else {
    //   path = '';
    // }
    const viewData = {
      title: '关联数据详情',
      col: 3,
      data: [
        {
          key: '数据名称',
          value: dataDetail.name,
        },
        {
          key: '数据类型',
          value: dataDetail.value.datasourceEntity.type,
        },
        {
          key: '数据大小',
          value: dataDetail.name,
        },
        {
          key: '所属节点',
          value: dataDetail.value.deptName,
        },
        {
          key: '所属机构',
          value: dataDetail.value.deptName,
        },
        {
          key: '发布模式',
          value: this.setSync(dataDetail),
        },
        {
          key: '接入时间',
          value: moment(dataDetail.value.createTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          key: '更新时间',
          value: moment(dataDetail.value.updateTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        // {
        //   key: '数据查看',
        //   link: true,
        //   href: path,
        //   value: '查看',
        // },
      ],
    };
    return <ViewCard data={viewData} />;
  }

  renderOrderForm(record) {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <Form onSubmit={this.handleOk} style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label="订阅名称">
          {getFieldDecorator('subscribeName', {
            initialValue: `${record.resourceProviderName}：${record.resourceName}`,
            rules: [
              {
                max: 50,
                message: '订阅名称不能超过50个字符！',
              },
              {
                required: true,
                message: '请填写订阅名称！',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="同步模式">
          {getFieldDecorator('synchronizationType', {
            initialValue: record.synchronizationType,
          })(<span>{record.synchronizationType}</span>)}
        </FormItem>
      </Form>
    );
  }

  render() {
    const {
      infoResource: { dataDetail, resourceDetail },
      loading,
      confirmLoading,
    } = this.props;
    const { visible, record } = this.state;
    const keyArr = Object.keys(dataDetail);
    const keyArrR = Object.keys(resourceDetail);
    const keyArrRecord = Object.keys(record);
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper action={buttonList}>
        <Card loading={loading} bordered={false}>
          {keyArrRecord.length > 0 && (
            <Fragment>
              <span style={{ marginRight: 10 }}>
                状态：
                {record.orderStatus}
              </span>
              {record.orderStatus !== '已订阅' && (
                <Button type="primary" onClick={() => this.handleOrder()}>
                  立即订阅
                </Button>
              )}
              <Divider style={{ marginBottom: 10, marginTop: 20 }} />
            </Fragment>
          )}
          {keyArrR.length > 0 && this.renderViewCard()}
          <Divider style={{ marginBottom: 10, marginTop: 0 }} />
          {keyArr.length > 0 && this.renderViewCardData()}
          <Modal
            title="信息资源订阅"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={520}
            maskClosable={false}
            confirmLoading={confirmLoading}
          >
            {this.renderOrderForm(record)}
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InfoResource;
