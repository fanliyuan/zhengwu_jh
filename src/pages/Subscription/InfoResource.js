import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider } from 'antd';
import moment from 'moment';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCard from '@/components/ViewCard';

@connect(({ infoResource, loading }) => ({
  infoResource,
  loading: loading.models.infoResource,
}))
class InfoResource extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'infoResource/getResourceDetail',
      payload: {
        resourceId: match.params.resourceId,
      },
    });
    dispatch({
      type: 'infoResource/getDataDetail',
      payload: {
        resourceId: match.params.mountResourceId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'infoResource/reset',
    });
  }

  setTimeFormat = val => {
    let str = '';
    if (val) {
      str = val.replace('-', '');
    }
    return str;
  };

  setSync = val => {
    if (val.value.syncEntity) {
      if (val.value.syncEntity.syncRate === '定时') {
        return `${val.value.syncEntity.syncMode}-${
          val.value.syncEntity.syncRate
        } 每${this.setTimeFormat(val.value.syncEntity.timeSet)}`;
      }
      return `${val.value.syncEntity.syncMode}-${val.value.syncEntity.syncRate}`;
    }
    return '无';
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  renderViewCard() {
    const {
      infoResource: { resourceDetail },
    } = this.props;
    const viewData = {
      title: '信息资源详情',
      col: 3,
      data: [
        {
          key: '信息资源代码',
          value: resourceDetail.resourceCode,
        },
        {
          key: '信息资源名称',
          value: resourceDetail.resourceName,
        },
        {
          key: '信息资源属性分类',
          value: resourceDetail.resourceProjectCatalogType,
        },
        {
          key: '信息资源提供方',
          value: resourceDetail.resourceProviderName,
        },
        {
          key: '提供方代码',
          value: resourceDetail.resourceProviderCode,
        },
        {
          key: '提供方内部部门',
          value: resourceDetail.resourceProviderDepartment,
        },
        {
          key: '更新周期',
          value: resourceDetail.resourceUpdateCycle,
        },
        {
          key: '发布日期',
          value: resourceDetail.resourcePublishTime,
        },
        {
          key: '共享日期',
          value: resourceDetail.shareTime,
        },
        {
          key: '信息资源格式',
          value: resourceDetail.resourceFormatClassify,
        },
        {
          key: '关联资源代码',
          value: resourceDetail.relateCode,
        },
        {
          key: '信息项',
          value: resourceDetail.itemNum,
        },
        {
          key: '信息资源摘要',
          value: resourceDetail.resourceAbstract,
          fullWidth: true,
          lines: 3,
        },
      ],
    };
    return <ViewCard data={viewData} />;
  }

  renderViewCardData() {
    // let path;
    const {
      infoResource: { dataDetail },
    } = this.props;
    // if (match.params.mountResourceId.indexOf('db') !== -1) {
    //   path = `/data/management/dbview/${match.params.id}`;
    // } else if (match.params.mountResourceId.indexOf('ftp') !== -1) {
    //   path = `/data/management/ftpview/${match.params.id}`;
    // } else if (match.params.mountResourceId.indexOf('file') !== -1) {
    //   path = `/data/management/fileview/${match.params.id}`;
    // } else {
    //   path = '';
    // }
    const viewData = {
      title: '关联数据详情',
      col: 3,
      data: [
        {
          key: '数据名称',
          value: dataDetail.name,
        },
        {
          key: '数据类型',
          value: dataDetail.value.datasourceEntity.type,
        },
        {
          key: '数据大小',
          value: dataDetail.name,
        },
        {
          key: '所属节点',
          value: dataDetail.value.deptName,
        },
        {
          key: '所属机构',
          value: dataDetail.value.deptName,
        },
        {
          key: '发布模式',
          value: this.setSync(dataDetail),
        },
        {
          key: '接入时间',
          value: moment(dataDetail.value.createTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          key: '更新时间',
          value: moment(dataDetail.value.updateTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        // {
        //   key: '数据查看',
        //   link: true,
        //   href: path,
        //   value: '查看',
        // },
      ],
    };
    return <ViewCard data={viewData} />;
  }

  render() {
    const {
      infoResource: { dataDetail, resourceDetail },
      loading,
    } = this.props;
    const keyArr = Object.keys(dataDetail);
    const keyArrR = Object.keys(resourceDetail);
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper action={buttonList}>
        <Card loading={loading} bordered={false}>
          {keyArrR.length > 0 && this.renderViewCard()}
          <Divider style={{ marginBottom: 10, marginTop: 0 }} />
          {keyArr.length > 0 && this.renderViewCardData()}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default InfoResource;
