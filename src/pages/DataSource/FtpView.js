import React, { Component } from 'react';
import { Row, Col, Table, Button, Form, Input } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataFileInfo';
import styles from './DataSourceManagement.less';

const FormItem = Form.Item;
let formValues;

@connect(({ ftpView, loading }) => ({
  ftpView,
  loadingList: loading.effects['ftpView/getFtpList'],
}))
@Form.create()
class FtpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIds: [],
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'ftpView/getFtpDetail',
      payload: match.params.id,
    });
    dispatch({
      type: 'ftpView/getFtpList',
      payload: {
        id: match.params.id,
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
      type: 'ftpView/reset',
      payload: {
        dataList: {},
        fileInfo: {},
        page: 1,
      },
    });
  }

  resetSelectedIds = () => {
    this.setState({
      selectedIds: [],
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const selectedIds = [];
    selectedRows.map(item => {
      selectedIds.push(item.id);
      return selectedIds;
    });
    this.setState({
      selectedIds,
    });
  };

  handleDowloads = () => {
    const { match } = this.props;
    const { selectedIds } = this.state;
    const { id } = match.params;
    const query = selectedIds.join('%2C');
    window.location.href = `/api/api/v2/zhengwu/swap/dataR/ftp/${id}/down?ids=${query}`;
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'ftpView/getFtpList',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
          ...formValues,
        },
        page: pageNum,
      },
    });
    this.resetSelectedIds();
  };

  handleSearch = e => {
    const { dispatch, form, match } = this.props;
    const paramsPage = { pageNum: 1, pageSize: 10 };
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const fieldsForm = fieldsValue;
      formValues = fieldsForm;

      const values = {
        ...fieldsForm,
        ...paramsPage,
      };

      dispatch({
        type: 'ftpView/getFtpList',
        payload: {
          id: match.params.id,
          query: {
            ...values,
          },
          page: 1,
        },
      });
    });
    this.resetSelectedIds();
  };

  handleFormReset = () => {
    const { form, dispatch, match } = this.props;
    form.resetFields();
    formValues = {};
    const paramsPage = { pageNum: 1, pageSize: 10 };
    dispatch({
      type: 'ftpView/getFtpList',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
        },
        page: 1,
      },
    });
    this.resetSelectedIds();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="文件名称">
              {getFieldDecorator('name')(<Input maxLength="50" placeholder="请输入文件名称" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    let ftpType;
    const dataColumn = [
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
    const {
      ftpView: { dataList, fileInfo },
      loadingList,
    } = this.props;
    const { selectedIds } = this.state;
    const {
      name,
      createUnit,
      dutyName,
      dutyPhone,
      dutyPosition,
      describe,
      datasourceDetailDto,
    } = fileInfo;
    if (datasourceDetailDto) {
      ftpType = datasourceDetailDto.type;
    }
    const paginationProps = {
      showQuickJumper: true,
      total: dataList.totalCounts,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const dataBaseInfo = {
      dataType: ftpType,
      name,
      pubNodeName: '石家庄民政局',
      createUnit,
      dutyName,
      dutyPhone,
      dutyPosition,
      describe,
    };
    const buttonList = [
      {
        type: 'primary',
        text: '返回',
        fn() {
          window.history.back();
        },
      },
    ];
    const columnRowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys: selectedIds,
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的文件',
    };
    return (
      <PageHeaderWrapper buttonList={buttonList}>
        <div className="content_layout">
          <DataBaseInfo dataBaseInfo={dataBaseInfo} />
          <div className={`${styles.tableListForm} mt16`}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button
              icon="download"
              type="primary"
              onClick={() => {
                this.handleDowloads();
              }}
              disabled={selectedIds.length < 1}
            >
              下载
            </Button>
          </div>
          <Table
            bordered
            pagination={paginationProps}
            dataSource={dataList.datas}
            columns={dataColumn}
            className="mt16"
            rowKey="id"
            loading={loadingList}
            rowSelection={columnRowSelection}
            locale={locale}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default FtpView;