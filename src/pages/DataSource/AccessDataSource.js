import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Steps, Button, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AccessDataInfo from './AccessDataInfo';
import SetSyncPlan from './SetSyncPlans';
import AddSuccess from './AddSuccess';
import styles from './AddDataSource.less';

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
}))
class AccessStepForm extends PureComponent {
  componentDidMount() {
    const { dispatch, match, route } = this.props;
    if (route.name === 'managementUpdate') {
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

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessData/reset',
      payload: {
        current: 0,
        dataType: '',
        type: '',
        oldName: '',
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
      accessData: { params, dataType },
    } = this.props;
    dispatch({
      type: 'accessData/submit',
      payload: {
        id: match.params.id,
        addDto: params,
        dataType,
      },
    });
  };

  next() {
    this.child.handleSubmit();
  }

  prev() {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '返回数据源页面，当前信息将不会被保存，是否返回？',
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
    const { history } = this.props;
    Modal.confirm({
      title: '警告',
      content: '返回数据源页面，当前信息将不会被保存，是否返回？',
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

  render() {
    const {
      location,
      match,
      submitting,
      history,
      testNameSubmitting,
      route,
      accessData: { params, current, dataType, type },
    } = this.props;
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
    return (
      <PageHeaderWrapper tabActiveKey={location.pathname}>
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
                      <AccessDataInfo
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={dataType}
                        match={match}
                        type={type}
                        params={params}
                      />
                    );
                }
              })()}
            </div>
            <div className={styles.stepsAction}>
              {dataType !== 'file' &&
                current === 1 && <Button onClick={() => this.prev()}>上一步</Button>}
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
              {current < 2 &&
                dataType !== 'file' && (
                  <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.back()}>
                    返回
                  </Button>
                )}
              {current < 1 &&
                dataType === 'file' && (
                  <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.back()}>
                    返回
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
