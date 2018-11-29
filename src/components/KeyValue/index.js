import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';

import PageHeaderLayout from '@/components/PageHeaderWrapper';
import styles from './index.less';

export default class AuditLog extends Component {
  render() {
    const { dataList, size = 2 } = this.props;
    const data = Array.from({ length: Math.ceil(dataList.length / size) }, (v, i) =>
      dataList.slice(size * i, size * i + size)
    );
    return data.map((sub, subi) => (
      <Row type="flex" key={Math.random()} className={styles.row}>
        {sub.map((item, itemi) => (
          <Col xs={{ span: 20 }} sm={{ span: 12 }} key={Math.random()}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.value}>{item.value}</span>
          </Col>
        ))}
      </Row>
    ));
  }
}
