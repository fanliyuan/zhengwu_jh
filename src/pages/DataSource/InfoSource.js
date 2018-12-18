import React, { Component, Fragment } from 'react';
import { Divider, Button, Card } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import InfoSourceDetail from '@/components/InfoSourceDetail';
import Ellipsis from '@/components/Ellipsis';
import styles from './InfoSource.less';

@connect(({ infoSource, loading }) => ({
  infoSource,
  infoSourceLoading: loading.effects['infoSource/getInfoSrcDetail'],
  refDetailLoading: loading.effects['infoSource/getRefDetail'],
}))
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

  state = {
    entry: 'pub',
  };

  componentDidMount() {
    const {
      match: {
        params: { type, id, resourceId },
      },
      route,
      dispatch,
    } = this.props;
    const entry = route.name === 'subInfoSrc' ? 'sub' : 'pub';
    this.setState({
      entry,
    });
    dispatch({
      type: 'infoSource/getInfoSrcDetail',
      payload: {
        path: resourceId,
      },
    });
    dispatch({
      type: 'infoSource/getRefDetail',
      payload: {
        type,
        id,
      },
    });
  }

  render() {
    const {
      infoSource: { infoSourceDetail, refDetail },
      refDetailLoading,
      infoSourceLoading,
    } = this.props;
    const { entry } = this.state;
    const {
      dataTitle,
      dataType,
      dataSize,
      dataNdoe, // eslint-disable-line
      dataDepartment, // eslint-disable-line
      dataPubMode,
      insertTime,
      updateTime,
      dataId, // eslint-disable-line
    } = refDetail;
    return (
      <PageHeaderWrapper buttonList={this.buttonList}>
        <div className="content_layout">
          {entry === 'sub' && (
            <Fragment>
              <span className="colon">状态</span>
              <span className="mr16">未订阅</span>
              <Button type="primary">立即订阅</Button>
              <Divider />
            </Fragment>
          )}
          <Card loading={infoSourceLoading} bordered={false}>
            <InfoSourceDetail infoSourceDetail={infoSourceDetail} />
          </Card>
          <Divider />
          <Card loading={refDetailLoading} bordered={false}>
            <div className={styles.refDBDetail}>
              <h2>关联数据详情</h2>
              <div>
                <div className={`${styles.label} colon`}>数据名称</div>
                <div>
                  <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{dataTitle}</div>
                  </Ellipsis>
                </div>
              </div>
              <div>
                <div className={`${styles.label} colon`}>数据类型</div>
                <div>
                  <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{dataType}</div>
                  </Ellipsis>
                </div>
              </div>
              {dataSize && (
                <div>
                  <div className={`${styles.label} colon`}>数据大小</div>
                  <div>
                    <Ellipsis lines={1} fullWidthRecognition tooltip>
                      <div>{dataSize}</div>
                    </Ellipsis>
                  </div>
                </div>
              )}
              {/* <div>
                <div className={`${styles.label} colon`}>所属节点</div>
                <div
                <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{dataNdoe}</div>
              </Ellipsis>>
              </div>
              </div>
              <div>
                <div className={`${styles.label} colon`}>所属机构</div>
                <div
                <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{dataDepartment}</div>
              </Ellipsis>>
              </div>
              </div> */}
              {dataPubMode && (
                <div>
                  <div className={`${styles.label} colon`}>发布模式</div>
                  <div>
                    <Ellipsis lines={1} fullWidthRecognition tooltip>
                      <div>{dataPubMode}</div>
                    </Ellipsis>
                  </div>
                </div>
              )}
              <div>
                <div className={`${styles.label} colon`}>接入时间</div>
                <div>
                  <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{insertTime}</div>
                  </Ellipsis>
                </div>
              </div>
              <div>
                <div className={`${styles.label} colon`}>更新时间</div>
                <div>
                  <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>{updateTime}</div>
                  </Ellipsis>
                </div>
              </div>
              {/* <div>
                <div className={`${styles.label} colon`}>查看数据</div>
                <div>
                  <Ellipsis lines={1} fullWidthRecognition tooltip>
                    <div>查看</div>
                  </Ellipsis>
                </div>
              </div> */}
            </div>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
