import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Card, Button, Upload, message } from 'antd';

import styles from './InputDirectory.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

export default class InputDirectory extends Component {
  state = {
    isEnable: false,
  };

  render() {
    const props = {
      name: 'file',
      action: '/api/api/v2/zhengwu/swap/resource/import',
      // headers: {
      //   authorization: 'authorization-text',
      // },
      data: {
        method: 'post',
      },
      onChange: info => {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 导入成功`);
          this.setState({
            isEnable: true,
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.response.message}`);
        }
      },
    };
    const { isEnable } = this.state;

    return (
      <PageHeaderLayout>
        <div className="btncls clearfix">
          <Link to="/informationResource/sourceManagement">
            <Button className="fr mr40">返回</Button>
          </Link>
        </div>
        <Card>
          <h3>
            请{' '}
            <a
              className={styles.aBtn}
              href="/api/api/v2/zhengwu/swap/resource/downTemplate?template=resource"
              download="/api/api/v2/zhengwu/swap/resource/downTemplate?template=resource"
            >
              下载模板{' '}
            </a>
            按格式填写信息资源内容后导入
          </h3>
          <Upload className={styles.infos} {...props}>
            <span>导入资源: </span>
            <Button type="primary" disabled={isEnable}>
              {' '}
              选取文件
            </Button>
          </Upload>
        </Card>
      </PageHeaderLayout>
    );
  }
}
