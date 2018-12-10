import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Divider } from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InfoResource from '@/components/InfoResource';
import styles from './ViewAuth.less';

@connect(({ informationResource, subAuth }) => ({ informationResource, subAuth }))
export default class ViewAuth extends Component {
  buttonList = [
    {
      text: '返回',
      fn() {
        window.history.back();
      },
    },
  ];

  componentDidMount() {
    const {
      match: {
        params: { resourceId, mountId, subId, dataType },
      },
    } = this.props;
    this.props.dispatch({
      type: 'informationResource/getResources',
      payload: { id: 51 || resourceId },
    });
    // this.props.dispatch({
    //   type: 'subAuth/getRefDetail',
    //   payload: {
    //     type: dataType,
    //     id: mountId,
    //   }
    // })
  }

  goView = info => {
    console.log(info);
  };

  render() {
    const {
      informationResource: { resourceDetail },
      subAuth: { refDetail },
    } = this.props;
    const infoResource = {
      infoSrcCode: resourceDetail.code,
      infoSrcName: resourceDetail.name,
      infoSrcProvider: resourceDetail.providerDept,
      pubTime: resourceDetail.publishTime,
      providerCode: resourceDetail.providerNo,
      infoSrcClassify: resourceDetail.typeName,
      infoSrcFormat: resourceDetail.format,
      infoSrcSummary: resourceDetail.summary,
    };
    const connectDataInfo = {
      dataTitle: '城市低保表',
      dataType: 'MySQL',
      dataNdoe: '石家庄市民政部',
      createNodeName: '石家庄民政部',
      appSysNname: '统计系统',
      accessTime: '2018-06-08 10:11:10',
      id: 1,
    };
    const {
      dataTitle,
      dataType,
      dataSize,
      dataNdoe,
      dataDepartment,
      dataPubMode,
      insertTime,
      updateTime,
      dataId,
    } = refDetail;
    const subDataInfo = {
      subNodeName: '石家庄市民政部',
      subDeptName: '石家庄市民政部',
      subTime: '2018-06-08 10:11:10',
      authState: '已拒绝 张三  2018-06-08 10:11:10',
      rejectReason: '你是谁?',
    };
    return (
      <PageHeaderWrapper buttonList={this.buttonList}>
        <div className="content_layout">
          <InfoResource infoResource={infoResource} />
          <Divider />
          <Row gutter={64} className={styles.row}>
            <Col span={11}>
              <h3>关联数据</h3>
              <ul>
                <li>
                  <label className="colon">数据名称</label>
                  <span>{dataTitle}</span>
                </li>
                <li>
                  <label className="colon">数据源类型</label>
                  <span>{dataType}</span>
                </li>
                <li>
                  <label className="colon">发布节点</label>
                  <span>{dataNdoe}</span>
                </li>
                <li>
                  <label className="colon">建库单位</label>
                  <span>{connectDataInfo.createNodeName}</span>
                </li>
                <li>
                  <label className="colon">应用系统名称</label>
                  <span>{connectDataInfo.appSysNname}</span>
                </li>
                <li>
                  <label className="colon">接入时间</label>
                  <span>{insertTime}</span>
                </li>
                <li>
                  <label className="colon">查看数据</label>
                  <a className="disabled" onClick={this.goView.bind(this, connectDataInfo)}>
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
                  <span>{subDataInfo.subNodeName}</span>
                </li>
                <li>
                  <label className="colon">订阅机构</label>
                  <span>{subDataInfo.subDeptName}</span>
                </li>
                <li>
                  <label className="colon">订阅时间</label>
                  <span>{subDataInfo.subTime}</span>
                </li>
                <li>
                  <label className="colon">授权状态</label>
                  <span>{subDataInfo.authState}</span>
                </li>
                <li>
                  <label className="colon">拒绝原因</label>
                  <span>{subDataInfo.rejectReason}</span>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </PageHeaderWrapper>
    );
  }
}
