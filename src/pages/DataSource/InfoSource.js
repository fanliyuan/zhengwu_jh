import React, { Component, Fragment } from 'react';
import { Divider, Button } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InfoSourceDetail from '@/components/InfoSourceDetail';
import styles from './InfoSource.less';

@connect(({ infoSource }) => ({ infoSource }))
export default class InfoSource extends Component {
  buttonList = [
    {
      type: 'primary',
      text: '返回',
      fn() {
        window.history.back();
      },
    },
  ];
  infoSourceData = window.location.hash.split('?')[0].split('/');
  resourceId = this.infoSourceData.pop() || 0;
  id = this.infoSourceData.pop() || 0;
  type = this.infoSourceData.pop() || 'db';
  entry = window.location.hash.startsWith('#/data/management/infoSource') ? 'pub' : 'sub';
  componentDidMount() {
    this.props.dispatch({
      type: 'infoSource/getInfoSrcDetail',
      payload: {
        path: this.resourceId,
      },
    });
    this.props.dispatch({
      type: 'infoSource/getRefDetail',
      payload: {
        type: this.type,
        id: this.id,
      },
    });
  }
  render() {
    const {
      infoSource: { infoSourceDetail, refDetail },
    } = this.props;
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
    return (
      <PageHeaderWrapper buttonList={this.buttonList}>
        <div className="content_layout">
          {this.entry === 'sub' && (
            <Fragment>
              <span className="colon">状态</span>
              <span className="mr16">未订阅</span>
              <Button type="primary">立即订阅</Button>
              <Divider />
            </Fragment>
          )}
          <InfoSourceDetail infoSourceDetail={infoSourceDetail} />
          <Divider />
          <div className={styles.refDBDetail}>
            <h2>关联数据详情</h2>
            <div>
              <span className="colon">数据名称</span>
              <span>{dataTitle}</span>
            </div>
            <div>
              <span className="colon">数据类型</span>
              <span>{dataType}</span>
            </div>
            <div>
              <span className="colon">数据大小</span>
              <span>{dataSize}</span>
            </div>
            {/* <div>
            <span className='colon'>所属节点</span>
            <span>{dataNdoe}</span>
          </div>
          <div>
            <span className='colon'>所属机构</span>
            <span>{dataDepartment}</span>
          </div> */}
            <div>
              <span className="colon">发布模式</span>
              <span>{dataPubMode}</span>
            </div>
            <div>
              <span className="colon">接入时间</span>
              <span>{insertTime}</span>
            </div>
            <div>
              <span className="colon">更新时间</span>
              <span>{updateTime}</span>
            </div>
            <div>
              <span className="colon">查看数据</span>
              <span>查看</span>
            </div>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
