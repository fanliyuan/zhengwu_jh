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
const { Meta } = Card;
const { Option } = Select;
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

@connect(({ dataSource, loading }) => ({
  dataSource,
  submitting: loading.effects['dataSource/submit'],
}))
class StepForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      dataType: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/reset',
    });
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
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
          type: 'dataSource/reset',
        });
        const current = this.state.current - 1;
        this.setState({ current });
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
      type: 'dataSource/setParams',
      payload: {
        type: val,
      },
    });
  };

  handleAdd = () => {
    const { alias } = this.props.dataSource.params;
    if (alias !== '') {
      this.submit();
    } else {
      this.child.handleSubmit('sub');
    }
  };

  connectTest = (obj, sub) => {
    const { dispatch } = this.props;
    const { type } = this.props.dataSource.params;
    this.props.dataSource.params = { ...this.props.dataSource.params, ...obj };
    dispatch({
      type: 'dataSource/connection',
      payload: {
        type: type,
        addr: obj.ip,
        port: obj.port,
        username: obj.username,
        password: obj.password,
      },
      callback: res => {
        if (res.code < 300 && sub === 'sub') {
          this.submit();
        }
      },
    });
    message.info('连接测试中，请勿进行其他操作...', 0);
  };

  submit = obj => {
    const { dispatch } = this.props;
    const { params } = this.props.dataSource;
    dispatch({
      type: 'dataSource/submit',
      payload: params,
      callback: res => {
        if (res.code < 300) {
          this.next();
        }
      },
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      location,
      dataSource: { params },
    } = this.props;
    const { submitting } = this.props;
    const { current } = this.state;
    const parentMethods = {
      setType: this.setType,
      handleAdd: this.handleAdd,
      connectTest: this.connectTest,
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
                switch (this.state.current) {
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
