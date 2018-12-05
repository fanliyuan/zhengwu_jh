import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import KeyValue from '@/components/KeyValue';

@connect(({ resourceAudit, loading }) => ({
  resourceAudit,
  loading: loading.effects['resourceAudit/auditLog'],
}))
class ResourceAuditLog extends Component {
  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;
    dispatch({
      type: 'resourceAudit/auditLog',
      payload: {
        id: params.id,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dbView/resetAuditLog',
    });
  }

  back() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    const {
      loading,
      resourceAudit: { auditLog },
    } = this.props;
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper action={buttonList}>
        <div className="content_layout">
          <Card loading={loading} bordered={false}>
            <KeyValue dataList={auditLog} />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ResourceAuditLog;
