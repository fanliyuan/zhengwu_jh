import React, { PureComponent, Fragment } from 'react';
import Result from '@/components/Result';
import styles from './AddDataSource.less';

class AddSuccess extends PureComponent {
  render() {
    return <Result type="success" title="操作成功" className={styles.result} />;
  }
}

export default AddSuccess;
