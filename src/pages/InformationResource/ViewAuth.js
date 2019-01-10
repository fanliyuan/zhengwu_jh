/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Divider, Card, Button } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InfoResource from '@/components/InfoResource';
import styles from './ViewAuth.less';

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

@connect(({ subAuth, loading }) => ({
  subAuth,
  loading: loading.models.subAuth,
}))
export default class ViewAuth extends Component {
  componentDidMount() {
    const {
      match: {
        params: { resourceId, mountId, subId, subscriberId: subscriberID },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'subAuth/getResourceDetail',
      payload: { resourceId },
    });
    // dispatch({
    //   type: 'subAuth/getRefDetail',
    //   payload: {
    //     type: dataType,
    //     id: mountId,
    //   },
    // });
    dispatch({
      type: 'subAuth/getSubAuthDetail',
      payload: {
        dsID: resourceId,
        subID: subId,
        subscriberID,
      },
    });
  }

  goView = info => {
    console.log(info); // eslint-disable-line
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const {
      subAuth: { subAuthDetail, resourceDetail },
      loading,
    } = this.props;
    const infoResource = {
      infoSrcCode: resourceDetail.resourceCode,
      infoSrcName: resourceDetail.resourceName,
      infoSrcProvider: resourceDetail.resourceProviderName,
      pubTime: resourceDetail.resourcePublishTime,
      providerCode: resourceDetail.resourceProviderCode,
      infoSrcClassify: resourceDetail.resourceProjectCatalogType,
      infoSrcFormat: resourceDetail.resourceFormatClassify,
      infoSrcSummary: resourceDetail.resourceAbstract,
    };
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper action={buttonList}>
        <Card bordered={false} loading={loading}>
          <div className="content_layout">
            <InfoResource infoResource={infoResource} />
            <Divider />
            <Row gutter={64} className={styles.row}>
              <Col span={11}>
                <h3>关联数据</h3>
                <ul>
                  <li>
                    <label className="colon">数据名称</label>
                    <span>{subAuthDetail.name}</span>
                  </li>
                  <li>
                    <label className="colon">数据源类型</label>
                    <span>{subAuthDetail.mountType}</span>
                  </li>
                  <li>
                    <label className="colon">发布节点</label>
                    <span>{subAuthDetail.node}</span>
                  </li>
                  <li>
                    <label className="colon">建库单位</label>
                    <span>{subAuthDetail.providerName}</span>
                  </li>
                  {/* <li>
                   <label className="colon">应用系统名称</label>
                   <span>{connectDataInfo.appSysNname}</span>
                   </li> */}
                  <li>
                    <label className="colon">接入时间</label>
                    <span>{subAuthDetail.registerTime}</span>
                  </li>
                  <li>
                    <label className="colon">查看数据</label>
                    <a className="disabled" onClick={this.goView.bind(this, 1)}>
                      查看
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={11}>
                <h3>订阅详情</h3>
                <ul>
                  <li>
                    <label className="colon">订阅节点</label>
                    <span>{subAuthDetail.subscriberName}</span>
                  </li>
                  <li>
                    <label className="colon">订阅机构</label>
                    <span>{subAuthDetail.subscribeInstitution}</span>
                  </li>
                  <li>
                    <label className="colon">订阅时间</label>
                    <span>{subAuthDetail.subTime}</span>
                  </li>
                  <li>
                    <label className="colon">授权状态</label>
                    <span>
                      {`${
                        statusArray.find(item => +item.value === +subAuthDetail.status)
                          ? statusArray.find(item => +item.value === +subAuthDetail.status).label
                          : ' '
                      } ${subAuthDetail.reviewer} ${subAuthDetail.reviewTime}`}
                    </span>
                  </li>
                  {subAuthDetail.status % 10 === 0 && (
                    <li>
                      <label className="colon">拒绝原因</label>
                      <span>{subAuthDetail.reviewReason}</span>
                    </li>
                  )}
                </ul>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
