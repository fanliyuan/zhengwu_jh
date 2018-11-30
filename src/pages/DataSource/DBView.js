import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Table, Icon, Modal, Form, Select, Input } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataBaseInfo';
import styles from './DataSourceManagement.less';

const authority = localStorage.getItem('antd-pro-authority');

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ dbView, loading }) => ({
  dbView,
  loading: loading.effects['dbView/getDbTableList'],
  loadingStruct: loading.effects['dbView/getDBTableStruct'],
  loadingInfo: loading.effects['dbView/getDbDetail'],
}))
@Form.create()
class DBView extends Component {
  pagination = {
    hideOnSinglePage: true,
    showQuickJumper: true,
    showTotal: total => `共 ${Math.ceil(total / 10)}页 / ${total}条 数据`,
  };

  constructor(props) {
    super(props);
    this.state = {
      modelName: '浏览',
      modelTitle: '数据',
      modelUnit: '行',
      visible: false,
      modalTitle: '数据导出',
      totals: 0,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dbView/getDbDetail',
      payload: match.params.id,
    });
    dispatch({
      type: 'dbView/getDbTableList',
      payload: {
        id: match.params.id,
        query: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    dispatch({
      type: 'dbView/getDBTableStruct',
      payload: {
        id: match.params.id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      dbView: { dataList },
    } = nextProps;
    const { totals } = this.state;
    if (totals === 0 && dataList.totalCounts) {
      this.setState({
        totals: dataList.totalCounts,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dbView/reset',
      payload: {
        tableList: [],
        dataList: {},
        tableStruct: [],
        dbInfo: {},
        page: 1,
      },
    });
  }

  viewTableData = () => {
    const {
      dbView: { dataList },
    } = this.props;
    this.setState({
      modelName: '浏览',
      modelTitle: '数据',
      modelUnit: '行',
      totals: dataList.totalCounts,
    });
  };

  viewTableStruct = () => {
    const {
      dbView: { tableStruct },
    } = this.props;
    this.setState({
      modelName: '结构',
      modelTitle: '数据项',
      modelUnit: '项',
      totals: tableStruct.length,
    });
  };

  exportData = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = () => {
    const {
      form,
      match,
      dbView: { dbInfo },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = match.params;
        const params = {
          id,
          query: values,
        };
        window.location.href = `/api/api/v2/zhengwu/swap/dataR/db/${params.id}/export?${stringify(
          params.query
        )}`;
        this.setState({
          visible: false,
        });
        setTimeout(() => {
          form.setFieldsValue({
            fileFormat: 'EXCEL/XLSX',
            codeFormat: 'UTF-8',
            exportFileName: dbInfo.tableName,
          });
        }, 20);
      }
    });
  };

  handleCancel = () => {
    const {
      form,
      dbView: { dbInfo },
    } = this.props;
    this.setState({
      visible: false,
    });
    setTimeout(() => {
      form.setFieldsValue({
        fileFormat: 'EXCEL/XLSX',
        codeFormat: 'UTF-8',
        exportFileName: dbInfo.tableName,
      });
    }, 20);
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'dbView/getDbTableList',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
        },
        page: pageNum,
      },
    });
  };

  render() {
    let dbType;
    const methods = {
      viewTableData: this.viewTableData,
      viewTableStruct: this.viewTableStruct,
      exportData: this.exportData,
    };
    const {
      dbView: { tableList, dbInfo, dataList, tableStruct, page },
      loading,
      loadingStruct,
      loadingInfo,
      form: { getFieldDecorator },
    } = this.props;
    const { modelName, modelTitle, modelUnit, visible, modalTitle, totals } = this.state;
    const tableColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: () => 1,
      },
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
      {
        title: '操作',
        align: 'center',
        render() {
          return authority === '["user"]' ? (
            <Fragment>
              <a className="mr16" disabled={modelName === '浏览'} onClick={methods.viewTableData}>
                浏览
              </a>
              <a className="mr16" disabled={modelName === '结构'} onClick={methods.viewTableStruct}>
                结构
              </a>
              <a className="mr16" onClick={methods.exportData}>
                导出
              </a>
            </Fragment>
          ) : (
            <Fragment>
              <a className="mr16" disabled={modelName === '浏览'} onClick={methods.viewTableData}>
                浏览
              </a>
              <a className="mr16" disabled={modelName === '结构'} onClick={methods.viewTableStruct}>
                结构
              </a>
            </Fragment>
          );
        },
      },
    ];
    const dataColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (page - 1) * 10}`,
      },
    ];
    const structColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '主键',
        dataIndex: 'primaryKey',
        align: 'center',
        render: text => {
          if (text) {
            return <Icon style={{ color: '#fb9a03' }} type="key" theme="outlined" />;
          }
          return '';
        },
      },
      {
        title: '字段名称',
        align: 'center',
        dataIndex: 'columnName',
      },
      {
        title: '数据类型',
        align: 'center',
        dataIndex: 'columnType',
      },
      {
        title: '中文标注',
        align: 'center',
        dataIndex: 'note',
      },
    ];
    const {
      dbName,
      name,
      updateTime,
      datasourceDetailDto,
      createUnit,
      appsysName,
      dutyName,
      dutyPhone,
      dutyPosition,
      describe,
      tableName,
    } = dbInfo;
    if (datasourceDetailDto) {
      dbType = datasourceDetailDto.type;
    }
    if (tableStruct && tableStruct.length > 0) {
      tableStruct.map(item =>
        dataColumn.push({
          title: item.columnName,
          dataIndex: item.columnName,
          align: 'center',
        })
      );
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
      dataBaseName: dbName,
      dataBaseType: dbType,
      dataName: name,
      updateTime,
      createUnit,
      appsysName,
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <PageHeaderWrapper buttonList={buttonList}>
        <div className="content_layout">
          <DataBaseInfo dataBaseInfo={dataBaseInfo} />
          <Table
            bordered
            pagination={this.pagination}
            dataSource={tableList}
            className="mt16"
            columns={tableColumn}
            rowKey="id"
            loading={loadingInfo}
          />
          <div className={`mt16 ${styles.title}`}>
            {modelTitle} 共 <span style={{ color: '#ed4014' }}>{totals}</span> {modelUnit}
          </div>
          <Table
            bordered
            pagination={paginationProps}
            dataSource={dataList.datas}
            columns={dataColumn}
            className={`mt16 ${modelName === '浏览' ? `${styles.show}` : `${styles.hidden}`}`}
            rowKey="id"
            loading={loading}
          />
          <Table
            bordered
            pagination={false}
            dataSource={tableStruct}
            columns={structColumn}
            className={`mt16 ${modelName === '结构' ? `${styles.show}` : `${styles.hidden}`}`}
            rowKey="id"
            loading={loadingStruct}
          />
          <Modal
            title={modalTitle}
            visible={visible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            width={600}
            maskClosable={false}
          >
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="form.dbView.export.fileFormat.label" />}
              >
                {getFieldDecorator('fileFormat', {
                  initialValue: 'EXCEL/XLSX',
                })(
                  <Select onChange={this.changeDbName}>
                    <Option key="EXCEL/XLSX">EXCEL/XLSX</Option>
                    <Option key="EXCEL/CSV">EXCEL/CSV</Option>
                    <Option key="JSON">JSON</Option>
                    <Option key="XML">XML</Option>
                    <Option key="MySQL/SQL">MySQL/SQL</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="form.dbView.export.codeFormat.label" />}
              >
                {getFieldDecorator('codeFormat', {
                  initialValue: 'UTF-8',
                })(
                  <Select onChange={this.changeDbName}>
                    <Option key="UTF-8">UTF-8</Option>
                    <Option key="GBK">GBK</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="form.dbView.export.exportFileName.label" />}
              >
                {getFieldDecorator('exportFileName', {
                  initialValue: tableName,
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'validation.dbView.export.exportFileName.required',
                      }),
                    },
                    {
                      max: 50,
                      message: formatMessage({ id: 'validation.dbView.export.exportFileName.max' }),
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Form>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}
export default DBView;
