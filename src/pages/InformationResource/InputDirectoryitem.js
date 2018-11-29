import React, { Component } from 'react';
// import { Link } from 'dva/router';
import { Card, Button, Upload, message } from 'antd';

import styles from './InputDirectory.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';

let arr = [];
export default class InputDirectory extends Component {
  state = {};

  componentDidMount() {
    sessionStorage.setItem('itemData', '');
    arr = [];
  }

  handleBackBtn = () => {
    if (arr.length === 0) {
      sessionStorage.setItem('itemData', '');
    } else {
      for (let i = 0; i < arr.length; i += 1) {
        arr[i].key = i;
      }
      sessionStorage.setItem('itemData', JSON.stringify(arr));
    }
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
          message.success(`${info.file.name} 导入成功`);
          if (info.file.response) {
            if (+info.file.response.code === 200) {
              arr = arr.concat(info.file.response.result.datas);
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
          <Button className="fr mr40" onClick={this.handleBackBtn}>
            返回
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
