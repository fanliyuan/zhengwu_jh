import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Steps, Button, message, Modal } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import SelectDataSource from './SelectDataSource';
import ConfigDataSource from './ConfigDataSource';
import AddSuccess from './AddSuccess';
import styles from './AddDataSource.less';

const { Step } = Steps;
const steps = [
  {
    title: '选择数据源类型',
  },
  {
    title: '配置数据源',
  },
  {
    title: '完成',
  },
];

@connect(({ opreateDataSource, loading }) => ({
  opreateDataSource,
  submitting: loading.effects['opreateDataSource/submit'],
}))
class StepForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitName: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { route, match } = this.props;
    if (route.name === 'sourceUpdate') {
      dispatch({
        type: 'opreateDataSource/next',
      });
      dispatch({
        type: 'opreateDataSource/detail',
        payload: {
          id: match.params.id,
        },
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opreateDataSource/reset',
      payload: {
        current: 0,
        dataType: '',
      },
    });
  }

  onRef = ref => {
    this.child = ref;
  };

  setType = (val, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'opreateDataSource/setParams',
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
    this.child.handleSubmit('sub');
  };

  connectTest = (obj, sub) => {
    const { dispatch } = this.props;
    const {
      opreateDataSource: { oldName, params },
    } = this.props;
    this.setState({
      submitName: obj.name,
    });
    dispatch({
      type: 'opreateDataSource/connection',
      payload: {
        params: { ...params, ...obj },
        sub,
        oldName,
      },
    });
    message.info('连接测试中，请勿进行其他操作...', 0);
  };

  submit = (obj, type) => {
    const { dispatch } = this.props;
    const {
      opreateDataSource: { oldName, params },
    } = this.props;
    this.setState({
      submitName: obj.name,
    });
    dispatch({
      type: 'opreateDataSource/testName',
      payload: {
        params: { ...params, ...obj },
        subType: type,
        oldName,
      },
    });
  };

  next() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opreateDataSource/next',
    });
  }

  prev() {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '警告',
      content: '返回选择数据源类型页面，当前信息将不会被保存，是否返回？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'opreateDataSource/prev',
        });
      },
    });
  }

  back() {
    const { history } = this.props;
    const {
      opreateDataSource: { current },
    } = this.props;
    if (current !== 0) {
      Modal.confirm({
        title: '警告',
        content: '返回数据源页面，当前信息将不会被保存，是否返回？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          history.goBack();
        },
      });
    } else {
      history.goBack();
    }
  }

  render() {
    const {
      location,
      submitting,
      history,
      route: { name },
      opreateDataSource: { params, current, dataType },
    } = this.props;
    const { submitName } = this.state;
    const parentMethods = {
      setType: this.setType,
      handleAdd: this.handleAdd,
      connectTest: this.connectTest,
      submit: this.submit,
    };
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
                    return <SelectDataSource {...parentMethods} type={params.type} />;
                  case 1:
                    return (
                      <ConfigDataSource
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={dataType}
                        params={params}
                      />
                    );
                  case 2:
                    return (
                      <AddSuccess
                        title={`数据源 ${submitName} 创建成功`}
                        pageName="数据源"
                        history={history}
                      />
                    );
                  default:
                    return <SelectDataSource {...parentMethods} type={params.type} />;
                }
              })()}
            </div>
            <div className={styles.stepsAction}>
              {name !== 'sourceUpdate' &&
                current === 1 && <Button onClick={() => this.prev()}>上一步</Button>}
              {current < steps.length - 2 && (
                <Button type="primary" disabled={params.type === ''} onClick={() => this.next()}>
                  下一步
                </Button>
              )}
              {current === 1 && (
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
              {current < 2 && (
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

export default StepForm;
