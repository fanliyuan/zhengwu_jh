import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Steps, Button, message, Modal } from 'antd';
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

  componentDidMount() {
    const { dispatch } = this.props;
    const { name } = this.props.route;
    if (name === 'sourceUpdate') {
      dispatch({
        type: 'opreateDataSource/next',
      });
      dispatch({
        type: 'opreateDataSource/detail',
        payload: {
          id: this.props.match.params.id,
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
    const { oldName } = this.props.opreateDataSource;
    this.props.opreateDataSource.params = { ...this.props.opreateDataSource.params, ...obj };
    dispatch({
      type: 'opreateDataSource/connection',
      payload: {
        params: this.props.opreateDataSource.params,
        sub: sub,
        oldName: oldName,
      },
    });
    message.info('连接测试中，请勿进行其他操作...', 0);
  };

  submit = (obj, type) => {
    const { dispatch } = this.props;
    const { oldName } = this.props.opreateDataSource;
    this.props.opreateDataSource.params = { ...this.props.opreateDataSource.params, ...obj };
    dispatch({
      type: 'opreateDataSource/testName',
      payload: {
        params: this.props.opreateDataSource.params,
        subType: type,
        oldName: oldName,
      },
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
    const { current, dataType } = this.props.opreateDataSource;
    const { name } = this.props.route;
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
                    break;
                  case 1:
                    return (
                      <ConfigDataSource
                        onRef={this.onRef}
                        {...parentMethods}
                        dataType={dataType}
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
              {current < steps.length - 2 && (
                <Button type="primary" disabled={params.type === ''} onClick={() => this.next()}>
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
