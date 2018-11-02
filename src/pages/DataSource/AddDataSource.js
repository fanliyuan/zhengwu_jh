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

  next() {
    const { dispatch } = this.props;
    dispatch({
      type: 'opreateDataSource/next',
    });
  }

  prev() {
    const { dispatch } = this.props;
    const { current } = this.props.opreateDataSource;
    Modal.confirm({
      title: '警告',
      content: '返回数据源页面，当前信息将不会被保存，是否返回？',
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
    this.props.history.goBack();
  }

  setType = (val, type) => {
    const dataType = type;
    const { dispatch } = this.props;
    this.setState({ dataType });
    dispatch({
      type: 'opreateDataSource/setParams',
      payload: {
        type: val,
      },
    });
  };

  handleAdd = () => {
    const { alias } = this.props.opreateDataSource.params;
    if (alias !== '') {
      this.child.setParams();
    } else {
      this.child.handleSubmit('sub');
    }
  };

  setParams = obj => {
    const { dispatch } = this.props;
    this.props.opreateDataSource.params = { ...this.props.opreateDataSource.params, ...obj };
    dispatch({
      type: 'opreateDataSource/testName',
      payload: this.props.opreateDataSource.params,
    });
  };

  connectTest = (obj, sub) => {
    const { dispatch } = this.props;
    this.props.opreateDataSource.params = { ...this.props.opreateDataSource.params, ...obj };
    dispatch({
      type: 'opreateDataSource/connection',
      payload: {
        params: this.props.opreateDataSource.params,
        sub: sub,
      },
    });
    message.info('连接测试中，请勿进行其他操作...', 0);
  };

  submit = obj => {
    const { dispatch } = this.props;
    const { params } = this.props.opreateDataSource;
    dispatch({
      type: 'opreateDataSource/submit',
      payload: params,
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      location,
      opreateDataSource: { params },
    } = this.props;
    const { submitting } = this.props;
    const { current } = this.props.opreateDataSource;
    const parentMethods = {
      setType: this.setType,
      handleAdd: this.handleAdd,
      connectTest: this.connectTest,
      setParams: this.setParams,
    };
    return (
      <PageHeaderWrapper tabActiveKey={location.pathname}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={current} className={styles.steps}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className="steps-content">
              {(() => {
                switch (current) {
                  case 0:
                    return <SelectDataSource {...parentMethods} type={params.type} />;
                    break;
                  case 1:
                    return (
                      <ConfigDataSource
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={this.state.dataType}
                        params={params}
                      />
                    );
                    break;
                  case 2:
                    return <AddSuccess />;
                    break;
                  default:
                    return <SelectDataSource {...parentMethods} type={params.type} />;
                }
              })()}
            </div>
            <div className={styles.stepsAction}>
              {current < steps.length - 2 &&
                params.type !== '' && (
                  <Button type="primary" onClick={() => this.next()}>
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
              {current === 1 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  上一步
                </Button>
              )}
              {
                <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.back()}>
                  返回
                </Button>
              }
            </div>
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StepForm;
