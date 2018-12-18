import React, { PureComponent, Fragment } from 'react';

import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';

export default class InfoSourceDetail extends PureComponent {
  render() {
    const {
      infoSourceDetail: {
        infoSrcCode,
        infoSrcName,
        infoSrcClassify,
        infoSrcProvider,
        infoSrcProviderCode,
        infoSrcProviderDepartment,
        updateCircle,
        pubDate,
        shareDate,
        infoSrcType,
        linkSrcCode,
        infoItem,
        infoSrcSummary,
      } = {},
    } = this.props;
    return (
      <Fragment>
        <h2>信息资源详情</h2>
        <div className={styles.detail}>
          <div>
            <div className={`${styles.label} colon`}>信息资源代码</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcCode}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息资源名称</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcName}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息资源属性分类</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcClassify}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息资源提供方</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcProvider}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>提供方代码</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcProviderCode}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>提供方内部部门</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcProviderDepartment}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>更新周期</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{updateCircle}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>发布日期</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{pubDate}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>共享日期</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{shareDate}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息资源格式</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcType}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>关联资源代码</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{linkSrcCode}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息项</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoItem}</div>
              </Ellipsis>
            </div>
          </div>
          <div>
            <div className={`${styles.label} colon`}>信息资源摘要</div>
            <div>
              <Ellipsis lines={1} fullWidthRecognition tooltip>
                <div>{infoSrcSummary}</div>
              </Ellipsis>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
