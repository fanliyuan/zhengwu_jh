import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon, Tooltip } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';

const links = [];

// const copyright = (
//   <Fragment>
//     Copyright <Icon type="copyright" /> www.youedata.cn,All Rights Reserved
//   </Fragment>
// );
const copyright = '';

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = '政务数据共享交换开放系统';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - 政务数据共享交换开放系统`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.lang}>{/*<SelectLang />*/}</div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
              </Link>
            </div>
            <div className={styles.superTitle}>数据共享交换开放系统</div>
          </div>
          {children}
        </div>
        <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
