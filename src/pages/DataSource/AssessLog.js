import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import KeyValue from '@/components/KeyValue';

@connect(({ assess, loading }) => ({ assess, loading: loading.models.assess }))
export default class AssessLog extends Component {
  buttonList = [
    {
      text: '返回',
      fn() {
        window.history.back();
      },
    },
  ];

  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;
    dispatch({
      type: 'assess/getAssessLog',
      payload: {
        params,
      },
    });
  }

  render() {
    const {
      loading,
      assess: { assessLog },
    } = this.props;
    return (
      <PageHeaderWrapper buttonList={this.buttonList}>
        <div className="content_layout">
          <Card loading={loading} bordered={false}>
            <KeyValue dataList={assessLog} />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}
