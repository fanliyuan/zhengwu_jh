/*
 * @Author: ChouEric
 * @Date: 2018-07-05 14:01:01
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-19 17:29:49
*/
import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch, Link } from 'dva/router';
import { Steps, Card, Button } from 'antd';

import PageHeaderLayout from '@/components/PageHeaderWrapper';
import { getRoutes } from '@/utils/utils';
import styles from './index.less';

const { Step } = Steps;

export default class NewMenu extends PureComponent {
  buttonList = [
    {
      text: '取消',
      fn() {
        window.history.back();
      },
    },
  ];

  getCurrentStep() {
    const {
      location: { pathname },
    } = this.props;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'one':
        return 0;
      case 'two':
        return 1;
      case 'three':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { match, route } = this.props;

    return (
      <PageHeaderLayout buttonList={this.buttonList}>
        {/* <div className="clearfix btncls">
          <Link to="/informationResource/management" className="fr mr40">
            <Button>返回</Button>
          </Link>
        </div> */}
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写信息资源内容" />
              <Step title="编辑信息项" />
              <Step title="完成" />
            </Steps>
            <Switch>
              {getRoutes(match.path, route).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect
                exact
                from="/informationResource/newMenu"
                to="/informationResource/newMenu/one"
              />
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
