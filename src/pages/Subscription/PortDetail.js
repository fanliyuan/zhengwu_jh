import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import styles from './PortDetail.less';

@connect(({ name }) => ({
  // , loading
  name,
  // loading1: loading.effects['name/JK1'],
  // loading2: loading.effects['name/JK2'],
}))
class PortDetail extends Component {
  buttonList = [
    {
      text: '申请',
      fn() {
        router.push('/subscribe/sourceCatalog');
      },
    },
  ];

  state = {
    // title: 'Title',
  };

  componentDidMount() {}

  render() {
    return (
      <PageHeaderWrapper buttonList={this.buttonList}>
        <Card bordered={false}>
          <div>测试</div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default PortDetail;
