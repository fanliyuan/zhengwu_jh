import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Steps, Button, Modal, Alert, Divider, Table, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import AccessDataInfo from './AccessDataInfo';
import SetSyncPlan from './SetSyncPlans';
import AddSuccess from './AddSuccess';
import styles from './AddDataSource.less';

const { Description } = DescriptionList;
const { Step } = Steps;
const stepsDb = [
  {
    title: '填写数据信息',
  },
  {
    title: '设置同步计划',
  },
  {
    title: '完成',
  },
];
const stepsFtp = [
  {
    title: '选择文件或文件夹',
  },
  {
    title: '设置同步计划',
  },
  {
    title: '完成',
  },
];
const stepsFile = [
  {
    title: '上传本地文件',
  },
  {
    title: '完成',
  },
];
let steps = [];

@connect(({ accessData, loading }) => ({
  accessData,
  submitting: loading.effects['accessData/submit'],
  testNameSubmitting: loading.effects['accessData/testName'],
  loadingTable: loading.effects['accessData/getCurrentdetail'],
  loadingStruct: loading.effects['accessData/getCurrentList'],
}))
class AccessStepForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSetCurrent: false,
      currentConfig: [1, -11, 10],
      pageTitle: '',
    };
  }

  componentDidMount() {
    const { dispatch, match, route } = this.props;
    if (route.name === 'managementUpdate') {
      this.setState({
        pageTitle: '待审核配置',
      });
      dispatch({
        type: 'accessData/updateDetail',
        payload: {
          id: match.params.id,
          dataType: match.params.type,
        },
      });
    } else {
      dispatch({
        type: 'accessData/detail',
        payload: {
          id: match.params.id,
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, match } = this.props;
    const {
      accessData: { dataType, status },
    } = nextProps;
    const { hasSetCurrent, currentConfig } = this.state;
    if (
      !hasSetCurrent &&
      dataType !== '' &&
      status !== '' &&
      currentConfig.indexOf(status) !== -1
    ) {
      if (dataType !== 'file') {
        dispatch({
          type: 'accessData/getCurrentSync',
          payload: {
            id: match.params.id,
            dataType,
          },
        });
      }
      dispatch({
        type: 'accessData/getCurrentdetail',
        payload: {
          id: match.params.id,
          dataType,
        },
      });
      dispatch({
        type: 'accessData/getCurrentList',
        payload: {
          id: match.params.id,
          dataType,
        },
      });
      this.setState({
        hasSetCurrent: true,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessData/reset',
      payload: {
        current: 0,
        dataType: '',
        type: '',
        alias: '',
        ip: '',
        port: '',
        username: '',
        password: '',
        oldName: '',
        status: '',
        dbList: [],
        treeList: [],
        tableList: [],
        columnList: [],
        checkedKeys: [],
        syncModeList: [
          {
            key: '增量',
            value: '增量',
          },
          {
            key: '全量',
            value: '全量',
          },
        ],
        syncRateList: [
          {
            key: '定时',
            value: '定时',
          },
          {
            key: '实时',
            value: '实时',
          },
        ],
        timeList: [
          {
            key: '分钟',
            value: '分钟',
          },
          {
            key: '小时',
            value: '小时',
          },
          {
            key: '周',
            value: '周',
          },
          {
            key: '天',
            value: '天',
          },
          {
            key: '月',
            value: '月',
          },
        ],
        params: {},
        currentDetail: {},
        currentSync: {},
        currentList: [],
      },
    });
  }

  onRef = ref => {
    this.child = ref;
  };

  handleAdd = () => {
    this.child.handleSubmit();
  };

  submit = () => {
    const {
      dispatch,
      match,
      route,
      accessData: { params, dataType },
    } = this.props;
    dispatch({
      type: 'accessData/submit',
      payload: {
        id: match.params.id,
        addDto: params,
        routeName: route.name,
        dataType,
      },
    });
  };

  showCurrentConfig = () => {
    const {
      accessData: { dataType },
    } = this.props;
    Modal.info({
      title: '当前配置',
      width: 900,
      okText: '关闭',
      maskClosable: false,
      content: (() => {
        switch (dataType) {
          case 'db':
            return this.renderDbInfo();
          case 'ftp':
            return this.renderFtpInfo();
          case 'file':
            return this.renderFileInfo();
          default:
            return '';
        }
      })(),
    });
  };

  setFileSize = size => {
    if (size === null || size === 0) {
      return '0 Bytes';
    }
    const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const srcSize = parseFloat(size);
    const index = Math.floor(Math.log(srcSize) / Math.log(1024));
    let powNum = 1;
    for (let i = 0, len = index; i < len; i += 1) {
      powNum *= 1024;
    }
    let newSize = srcSize / powNum;
    newSize = newSize.toFixed(2);
    return newSize + unitArr[index];
  };

  next() {
    this.child.handleSubmit();
  }

  prev(dataType) {
    let content;
    const { dispatch } = this.props;
    if (dataType === 'db') {
      content = '返回数据信息页面，当前信息将不会被保存，是否返回？';
    } else {
      content = '返回选择文件或文件夹页面，当前信息将不会被保存，是否返回？';
    }
    Modal.confirm({
      title: '警告',
      content,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'accessData/prev',
        });
      },
    });
  }

  back() {
    const { history, route } = this.props;
    let pageName = '数据源';
    if (route.name === 'managementUpdate') {
      pageName = '数据管理';
    }
    Modal.confirm({
      title: '警告',
      content: `返回${pageName}页面，当前信息将不会被保存，是否返回？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        history.goBack();
      },
    });
  }

  close() {
    const { history } = this.props;
    history.goBack();
  }

  renderDbInfo = () => {
    const {
      loadingTable,
      loadingStruct,
      accessData: { currentDetail, currentSync, currentList },
    } = this.props;
    const tableList = [currentDetail];
    const tableColumn = [
      {
        title: '表名称',
        dataIndex: 'tableName',
        align: 'center',
      },
      {
        title: '中文标注',
        dataIndex: 'tableNote',
        align: 'center',
      },
    ];
    const structColumn = [
      {
        title: '主键',
        dataIndex: 'primaryKey',
        render: text => {
          if (text) {
            return <Icon style={{ color: '#fb9a03' }} type="key" theme="outlined" />;
          }
          return '';
        },
      },
      {
        title: '字段名称',
        dataIndex: 'columnName',
      },
      {
        title: '数据类型',
        dataIndex: 'columnType',
      },
      {
        title: '中文标注',
        dataIndex: 'note',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据库">{currentDetail.dbName}</Description>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="建库单位">{currentDetail.createUnit}</Description>
          <Description term="应用系统名称">{currentDetail.appsysName}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="同步信息" style={{ marginBottom: 32 }}>
          <Description term="同步模式">{currentSync.syncMode}</Description>
          <Description term="同步频率">{currentSync.syncRate}</Description>
          <Description term="定时设置">每{currentSync.timeSet}</Description>
          <Description term="自动停止">{currentSync.stopNum}次</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>表信息</div>
        <Table
          style={{ marginBottom: 24 }}
          loading={loadingTable}
          dataSource={tableList}
          columns={tableColumn}
          rowKey="id"
        />
        <div className={styles.title}>结构信息</div>
        <Table
          style={{ marginBottom: 16 }}
          loading={loadingStruct}
          dataSource={currentList}
          columns={structColumn}
          rowKey="id"
        />
      </Card>
    );
  };

  renderFtpInfo = () => {
    const {
      loadingTable,
      accessData: { currentDetail, currentSync, currentList },
    } = this.props;
    const tableColumn = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '文件类型',
        dataIndex: 'type',
      },
      {
        title: '文件相对路径',
        dataIndex: 'path',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="文件所属单位">{currentDetail.createUnit}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <DescriptionList size="large" title="同步信息" style={{ marginBottom: 32 }}>
          <Description term="同步模式">{currentSync.syncMode}</Description>
          <Description term="同步频率">{currentSync.syncRate}</Description>
          <Description term="定时设置">每{currentSync.timeSet}</Description>
          <Description term="自动停止">{currentSync.stopNum}次</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>文件信息</div>
        <Table
          style={{ marginBottom: 24 }}
          loading={loadingTable}
          dataSource={currentList}
          columns={tableColumn}
          rowKey="id"
        />
      </Card>
    );
  };

  renderFileInfo = () => {
    const {
      loadingTable,
      accessData: { currentDetail, currentList },
    } = this.props;
    const tableColumn = [
      {
        title: '文件名称',
        dataIndex: 'name',
      },
      {
        title: '文件类型',
        dataIndex: 'type',
      },
      {
        title: '文件大小',
        dataIndex: 'size',
        render: text => this.setFileSize(parseInt(text, 10)),
      },
      {
        title: '最近更新时间',
        dataIndex: 'uploadTimeStr',
      },
    ];
    return (
      <Card bordered={false}>
        <DescriptionList size="large" title="基础信息" style={{ marginBottom: 32 }}>
          <Description term="数据名称">{currentDetail.name}</Description>
          <Description term="文件所属单位">{currentDetail.createUnit}</Description>
          <Description term="数据描述">{currentDetail.describe}</Description>
          <Description term="负责人姓名">{currentDetail.dutyName}</Description>
          <Description term="负责人手机号">{currentDetail.dutyPhone}</Description>
          <Description term="负责人职位">{currentDetail.dutyPosition}</Description>
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>文件信息</div>
        <Table
          style={{ marginBottom: 24 }}
          loading={loadingTable}
          dataSource={currentList}
          columns={tableColumn}
          rowKey="id"
        />
      </Card>
    );
  };

  render() {
    const {
      location,
      match,
      submitting,
      history,
      testNameSubmitting,
      route,
      accessData: { params, current, dataType, type, status, currentList },
    } = this.props;
    const { currentConfig, pageTitle } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      submit: this.submit,
    };
    switch (dataType) {
      case 'db':
        steps = stepsDb;
        break;
      case 'ftp':
        steps = stepsFtp;
        break;
      case 'file':
        steps = stepsFile;
        break;
      default:
        steps = [];
        break;
    }
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        {currentConfig.indexOf(status) !== -1 &&
          dataType !== 'file' && (
            <Button
              className={current !== 2 ? styles.show : styles.hidden}
              disabled={currentList.length < 1}
              type="primary"
              style={{ float: 'left' }}
              onClick={() => this.showCurrentConfig()}
            >
              当前配置
            </Button>
          )}
        {currentConfig.indexOf(status) !== -1 &&
          dataType === 'file' && (
            <Button
              className={current !== 1 ? styles.show : styles.hidden}
              disabled={currentList.length < 1}
              type="primary"
              style={{ float: 'left' }}
              onClick={() => this.showCurrentConfig()}
            >
              当前配置
            </Button>
          )}
        {dataType !== 'file' && (
          <Button
            className={current !== 2 ? styles.show : styles.hidden}
            style={{ float: 'left' }}
            type="primary"
            onClick={() => this.back()}
          >
            取消
          </Button>
        )}
        {dataType === 'file' && (
          <Button
            className={current !== 1 ? styles.show : styles.hidden}
            style={{ float: 'left' }}
            type="primary"
            onClick={() => this.back()}
          >
            取消
          </Button>
        )}
      </div>
    );
    return (
      <PageHeaderWrapper title={pageTitle} tabActiveKey={location.pathname} action={buttonList}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">
              {(() => {
                switch (current) {
                  case 0:
                    if (dataType === '') {
                      return (
                        <Alert
                          message="页面正努力加载中......"
                          style={{ marginBottom: 20 }}
                          type="info"
                          showIcon
                        />
                      );
                    }
                    return (
                      <AccessDataInfo
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={dataType}
                        match={match}
                        type={type}
                        params={params}
                        route={route}
                      />
                    );
                  case 1:
                    if (dataType !== 'file') {
                      return <SetSyncPlan onRef={this.onRef} {...parentMethods} params={params} />;
                    }
                    return (
                      <AddSuccess
                        title="数据接入配置成功，请等待审核结果！"
                        pageName="数据源"
                        history={history}
                      />
                    );
                  case 2:
                    return (
                      <AddSuccess
                        title="数据接入配置成功，请等待审核结果！"
                        pageName="数据源"
                        history={history}
                      />
                    );
                  default:
                    return (
                      <Alert
                        message="页面加载中..."
                        description="请耐心等待!"
                        type="info"
                        showIcon
                      />
                    );
                }
              })()}
            </div>
            <div className={styles.stepsAction}>
              {dataType !== 'file' &&
                current === 1 && <Button onClick={() => this.prev(dataType)}>上一步</Button>}
              {current < steps.length - 2 &&
                dataType !== 'file' && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={testNameSubmitting}
                    onClick={() => this.next()}
                  >
                    下一步
                  </Button>
                )}
              {current === 1 &&
                dataType !== 'file' && (
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    onClick={() => this.handleAdd()}
                  >
                    提交
                  </Button>
                )}
              {current === 0 &&
                dataType === 'file' && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    onClick={() => this.handleAdd()}
                  >
                    提交
                  </Button>
                )}
            </div>
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AccessStepForm;
