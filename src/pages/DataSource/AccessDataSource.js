import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  List,
  Card,
  Steps,
  Form,
  Input,
  Button,
  Select,
  Divider,
  Icon,
  message,
  Modal,
} from 'antd';
import router from 'umi/router';
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
}))
class AccessStepForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'accessData/detail',
      payload: {
        id: id,
      },
    });
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
        tableList: [],
        columnList: [],
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
    Modal.confirm({
      title: '警告',
      content: '返回数据源页面，当前信息将不会被保存，是否返回？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.history.goBack();
      },
    });
  }

  close() {
    this.props.history.goBack();
  }

  setType = (val, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessData/setDataType',
      payload: {
        dataType: type,
        oldName: '',
        params: {
          type: val,
        },
      },
    });
  };

  handleAdd = () => {
    this.child.handleSubmit();
  };

  submit = () => {
    console.log(this.props);
    const { dispatch } = this.props;
    const { params } = this.props.accessData;
    dispatch({
      type: 'accessData/submit',
      payload: {
        id: this.props.match.params.id,
        dbAddDto: params,
      },
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      location,
      accessData: { params },
    } = this.props;
    const { submitting } = this.props;
    const { current, dataType, type } = this.props.accessData;
    const { name } = this.props.route;
    const parentMethods = {
      setType: this.setType,
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
                        type={type}
                        params={params}
                      />
                    );
                    break;
                  case 1:
                    return <SetSyncPlan onRef={this.onRef} {...parentMethods} params={params} />;
                    break;
                  case 2:
                    return <AddSuccess />;
                    break;
                  default:
                    return (
                      <AccessDataInfo
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={dataType}
                        type={type}
                        params={params}
                      />
                    );
                }
              })()}
            </div>
            <div className={styles.stepsAction}>
              {current < steps.length - 2 && (
                <Button type="primary" htmlType="submit" onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current === 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  onClick={() => this.handleAdd()}
                >
                  提交
                </Button>
              )}
              {name !== 'sourceUpdate' &&
                current === 1 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    上一步
                  </Button>
                )}
              {current !== 2 && (
                <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.back()}>
                  返回
                </Button>
              )}
              {current === 2 && (
                <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.close()}>
                  关闭
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
