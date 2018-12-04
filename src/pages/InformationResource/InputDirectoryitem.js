import React, { Component } from 'react';
// import { Link } from 'dva/router';
import { Card, Button, Upload, message } from 'antd';

import styles from './InputDirectory.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

let arr = [];
export default class InputDirectory extends Component {
  state = {};

  componentDidMount() {
    // sessionStorage.setItem('itemData', '');
    arr = [];
  }

  handleCancel = () => {
    // sessionStorage.setItem('isBack', true); // 区分是从导入页面返回到第二步还是在第二步进行了刷新
    window.history.back();
  };

  handleBackBtn = () => {
    if (arr.length === 0) {
      if (!sessionStorage.getItem('itemData')) {
        sessionStorage.setItem('itemData', '');
      }
    } else {
      for (let i = 0; i < arr.length; i += 1) {
        arr[i].key = i;
      }
      sessionStorage.setItem('itemData', JSON.stringify(arr));
    }
    sessionStorage.setItem('isBack', true); // 区分是从导入页面返回到第二步还是在第二步进行了刷新
    window.history.back();
  };

  render() {
    const props = {
      name: 'file',
      action: '/api/api/v2/zhengwu/swap/resource/info/import',
      // headers: {
      //   authorization: 'authorization-text',
      // },
      data: {
        method: 'post',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          sessionStorage.setItem('itemData', '');
          if (info.file.response) {
            if (+info.file.response.code === 200) {
              message.success(`${info.file.name} 导入成功`);
              arr = arr.concat(info.file.response.result.datas);
            } else {
              message.error(`${info.file.response.message}`);
            }
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.response.message}`);
        }
      },
    };

    return (
      <PageHeaderLayout>
        <div className="btncls clearfix">
          {/* <Link to="/informationResource/newMenu/two"> */}
          <Button className="fr mr40" onClick={this.handleCancel}>
            取消
          </Button>
          {/* </Link> */}
        </div>
        <Card>
          <h3>
            请{' '}
            <a
              className={styles.aBtn}
              href="/api/api/v2/zhengwu/swap/resource/downTemplate?template=info"
              download="/api/api/v2/zhengwu/swap/resource/downTemplate?template=info"
            >
              下载模板{' '}
            </a>
            按格式填写信息资源项内容后导入
          </h3>
          <Upload className={styles.infos} {...props}>
            <span>导入信息项: </span>
            <Button type="primary"> 选取文件</Button>
          </Upload>
          <Button type="primary" onClick={this.handleBackBtn} style={{ marginTop: 20 }}>
            上一步
          </Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
