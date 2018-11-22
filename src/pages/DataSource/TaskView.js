import React, { Component, Fragment } from 'react';
import { Table, Icon, Button, Tabs, List } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataBaseInfo';
import DataFileInfo from '@/components/DataFileInfo';
import styles from './DataSourceManagement.less';

const { TabPane } = Tabs;

@connect(({ taskView, loading }) => ({
  taskView,
  loadingSyncInfo: loading.effects['taskView/getSyncInfo'],
  loadingRunLog: loading.effects['taskView/getRunlog'],
  loadingSyncLog: loading.effects['taskView/getSyncInfo'],
}))
class TaskView extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'taskView/getDetail',
      payload: {
        id: match.params.id,
        dataType: match.params.type,
      },
    });
    dispatch({
      type: 'taskView/getSyncInfo',
      payload: {
        id: match.params.id,
        dataType: match.params.type,
      },
    });
    dispatch({
      type: 'taskView/getRunlog',
      payload: {
        id: match.params.id,
        type: match.params.type,
        query: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    dispatch({
      type: 'taskView/getSynclog',
      payload: {
        id: match.params.id,
        type: match.params.type,
        query: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskView/reset',
      payload: {
        runLogList: {},
        syncLogList: {},
        basicInfo: {},
        syncInfo: {},
        pageRun: 1,
        pageSync: 1,
      },
    });
  }

  changePage = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'taskView/getRunlog',
      payload: {
        id: match.params.id,
        type: match.params.type,
        query: {
          ...paramsPage,
        },
        page: pageNum,
      },
    });
  };

  changeSyncPage = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'taskView/getSynclog',
      payload: {
        id: match.params.id,
        type: match.params.type,
        query: {
          ...paramsPage,
        },
        page: pageNum,
      },
    });
  };

  render() {
    let dType;
    let dataBaseInfo;
    const {
      location,
      match,
      taskView: { runLogList, syncLogList, basicInfo, syncInfo, pageRun, pageSync },
      loadingSyncInfo,
      loadingRunLog,
      loadingSyncLog,
    } = this.props;
    const runLogColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (pageRun - 1) * 10}`,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
      },
      {
        title: '操作方式',
        dataIndex: 'operateMode',
        align: 'center',
      },
      {
        title: '操作结果',
        dataIndex: 'operateResult',
        align: 'center',
      },
      {
        title: '最近更新时间',
        dataIndex: 'time',
        align: 'center',
      },
    ];
    const syncLogColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        render: (text, record, index) => `${index + 1 + (pageSync - 1) * 10}`,
      },
      {
        title: '传输记录数',
        dataIndex: 'transferNum',
      },
      {
        title: '传输大小（MB）',
        dataIndex: 'transferSize',
      },
      {
        title: '新增记录数',
        dataIndex: 'insertNum',
      },
      {
        title: '更新记录数',
        dataIndex: 'updateNum',
      },
      {
        title: '删除记录数',
        dataIndex: 'daleteNum',
      },
      {
        title: '忽略记录数',
        dataIndex: 'ignoreNum',
      },
      {
        title: '错误记录数',
        dataIndex: 'errorNum',
      },
      {
        title: '最近更新时间',
        dataIndex: 'time',
      },
    ];
    const paginationProps = {
      showQuickJumper: true,
      total: runLogList.totalCounts,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const paginationSyncProps = {
      showQuickJumper: true,
      total: syncLogList.totalCounts,
      onChange: this.changeSyncPage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    if (basicInfo.datasourceDetailDto) {
      dType = basicInfo.datasourceDetailDto.type;
    }
    if (match.params.type === 'db') {
      dataBaseInfo = {
        dataBaseName: basicInfo.dbName,
        dataBaseType: dType,
        dataName: basicInfo.name,
        updateTime: basicInfo.updateTime,
        createUnit: basicInfo.createUnit,
        appsysName: basicInfo.appsysName,
        dutyName: basicInfo.dutyName,
        dutyPhone: basicInfo.dutyPhone,
        dutyPosition: basicInfo.dutyPosition,
        describe: basicInfo.describe,
      };
    } else {
      dataBaseInfo = {
        dataType: dType,
        name: basicInfo.name,
        createUnit: basicInfo.createUnit,
        dutyName: basicInfo.dutyName,
        dutyPhone: basicInfo.dutyPhone,
        dutyPosition: basicInfo.dutyPosition,
        describe: basicInfo.describe,
      };
    }
    const syncDatas = [
      {
        title: '同步模式',
        value: syncInfo.syncMode,
      },
      {
        title: '同步频率',
        value: `${syncInfo.syncRate} - 每${syncInfo.timeSet}`,
      },
      {
        title: '状态',
        value: syncInfo.status,
      },
      {
        title: '接入时间',
        value: syncInfo.accessTime,
      },
      {
        title: '最近更新时间',
        value: syncInfo.lastSyncTime,
      },
      {
        title: '数据库文件大小',
        value: syncInfo.dataFileSzie,
      },
      {
        title: '查看数据',
        value: syncInfo,
      },
    ];
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => window.history.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper tabActiveKey={location.pathname} action={buttonList}>
        <div className="content_layout">
          {(() => {
            if (match.params.type === 'db') {
              return <DataBaseInfo dataBaseInfo={dataBaseInfo} />;
            }
            return <DataFileInfo dataBaseInfo={dataBaseInfo} />;
          })()}
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <List
                loading={loadingSyncInfo}
                itemLayout="horizontal"
                dataSource={syncDatas}
                renderItem={item => (
                  <List.Item key={item.title}>{`${item.title}：${item.value}`}</List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="运行日志" key="2">
              <Table
                bordered
                pagination={paginationProps}
                dataSource={runLogList.datas}
                columns={runLogColumn}
                rowKey="id"
                loading={loadingRunLog}
              />
            </TabPane>
            <TabPane tab="更新日志" key="3">
              <Table
                bordered
                pagination={paginationSyncProps}
                dataSource={syncLogList.datas}
                columns={syncLogColumn}
                rowKey="id"
                loading={loadingSyncLog}
              />
            </TabPane>
          </Tabs>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default TaskView;
