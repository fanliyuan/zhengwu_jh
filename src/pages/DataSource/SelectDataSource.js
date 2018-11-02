import React, { PureComponent, Fragment } from 'react';
import { List, Card, Icon } from 'antd';
import styles from './AddDataSource.less';

const { Meta } = Card;
const sqlData = [
  {
    title: 'mysql',
    type: 'db',
    icon: 'icon-mysql',
  },
  {
    title: 'sqlserver',
    type: 'db',
    icon: 'icon-SQLserver',
  },
  {
    title: 'oracle',
    type: 'db',
    icon: 'icon-oracle-01',
  },
  {
    title: 'dm',
    type: 'db',
    icon: 'icon-dataBase',
  },
  {
    title: 'kingbase',
    type: 'db',
    icon: 'icon-shuju',
  },
];
const ftpData = [
  {
    title: 'ftp',
    type: 'ftp',
    icon: 'icon-server',
  },
  {
    title: 'sftp',
    type: 'sftp',
    icon: 'icon-fuwuqi-shouye',
  },
  {
    title: '本地文件上传',
    type: 'file',
    icon: 'icon-wenjian',
  },
];
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_896555_yoxxpbidxz.js',
});

class SelectDataSource extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { setType, type } = this.props;
    return (
      <Fragment>
        <List
          className={styles.cardList}
          split={false}
          header={<h3>关系型数据库</h3>}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }}
          dataSource={sqlData}
          renderItem={item => (
            <List.Item>
              <Card
                onClick={() => setType(item.title, item.type)}
                className={`${styles.card} ${item.title === type ? `${styles.cardActive}` : ''}`}
                hoverable
                cover={<IconFont className={styles.cardIcon} type={item.icon} />}
              >
                <Meta className={styles.cardName} title={item.title} />
              </Card>
            </List.Item>
          )}
        />
        <List
          className={styles.cardList}
          split={false}
          header={<h3>半结构化存储</h3>}
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }}
          dataSource={ftpData}
          renderItem={item => (
            <List.Item>
              <Card
                onClick={() => setType(item.title, item.type)}
                className={`${styles.card} ${item.title === type ? `${styles.cardActive}` : null}`}
                hoverable
                cover={<IconFont className={styles.cardIcon} type={item.icon} />}
              >
                <Meta className={styles.cardName} title={item.title} />
              </Card>
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SelectDataSource;
