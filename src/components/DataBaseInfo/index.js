import React, { PureComponent } from 'react';

import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';

export default class DataBaseInfo extends PureComponent {
  state = {
    flag: false,
  };

  click = () => {
    const { flag } = this.state;
    this.setState({
      flag: !flag,
    });
  };

  render() {
    const { flag } = this.state;
    const {
      dataBaseInfo: {
        dataBaseName = '',
        dataBaseType = '',
        dataName = '',
        pubNodeName = '',
        updateTime = '',
      } = {},
    } = this.props;
    return (
      <div className={flag ? styles.boxOpen : styles.boxClose}>
        <div>
          <a onClick={this.click} className={styles.button}>
            {flag ? '收起' : '展开'}
          </a>
          <span className="mr40">
            <span className={styles.name}>数据库</span>
            <span className={styles.value1}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseName}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据名称</span>
            <span className={styles.value3}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataName}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>发布节点</span>
            <span className={styles.value4}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {pubNodeName}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据更新时间</span>
            <span className={styles.value5}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {updateTime}
              </Ellipsis>
            </span>
          </span>
        </div>
        <div>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
          <span className="mr40">
            <span className={styles.label}>数据类型</span>
            <span className={styles.value2}>
              <Ellipsis lines={1} fullWidthRecognition={true} tooltip={true}>
                {dataBaseType}
              </Ellipsis>
            </span>
          </span>
        </div>
      </div>
    );
  }
}
