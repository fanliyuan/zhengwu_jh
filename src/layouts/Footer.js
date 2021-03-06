import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
// const FooterView = () => (
//   <Footer style={{ padding: 0 }}>
//     <GlobalFooter
//       links={[]}
//       copyright={
//         <Fragment>
//           Copyright <Icon type="copyright" /> 2018 国信优易
//         </Fragment>
//       }
//     />
//   </Footer>
// );
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter links={[]} />
  </Footer>
);
export default FooterView;
