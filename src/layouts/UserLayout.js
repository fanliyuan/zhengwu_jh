import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon, Tooltip } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';

const links = [];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> www.youedata.cn,All Rights Reserved
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <Tooltip
            title={
              <div>
                <div>节点管理员 : admin</div>
                <div>节点安全员 : security</div>
                <div>节点审计员 : auditor</div>
                <div>节点审核员 : assessor</div>
                <div>节点操作员 : user</div>
              </div>
            }
          >
            <Icon type="question-circle-o" />
          </Tooltip>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
            <div className={styles.superTitle}>政务数据共享交换开放系统</div>
          </div>
          {children}
        </div>
        <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
