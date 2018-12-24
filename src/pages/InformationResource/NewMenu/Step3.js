/*
 * @Author: ChouEric
 * @Date: 2018-07-06 17:49:38
 * @Last Modified by: fly
 * @Last Modified time: 2018-12-24 13:32:27
*/
import React, { PureComponent } from 'react';
import { Card } from 'antd';
// import { routerRedux } from 'dva/router'
import Result from '@/components/Result';
import router from 'umi/router';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

// import styles from './index.less'

// const { Item } = Form

export default class Step3 extends PureComponent {
  buttonList = [
    {
      text: '取消',
      fn() {
        router.push('/informationResource/sourceManagement');
      },
    },
  ];
  state = {
    show: true,
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    setTimeout(() => {
      router.push('/informationResource/sourceManagement');
    }, 10000);
  };

  render() {
    const { show } = this.state;
    return (
      <PageHeaderLayout buttonList={this.buttonList}>
        <Card bordered={false}>
          <Result type="success" title="资源配置创建成功，请等待审核结果！" />
          {show && (
            <div style={{ textAlign: 'center' }}>
              <p>
                页面将在 10秒 之后跳转到资源页面{' '}
                <Link to="/informationResource/sourceManagement">立即跳转</Link>
              </p>
            </div>
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
