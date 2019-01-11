import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { stringify } from 'qs';
import { Table, Icon, Modal, Form, Select, Input, Button, Card } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DataBaseInfo from '@/components/DataBaseInfo';
import styles from './SourceCatalog.less';

const authority = localStorage.getItem('antd-pro-authority');

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ subDetailDataBase, loading }) => ({
  subDetailDataBase,
  loadingTable: loading.effects['subDetailDataBase/getDbList'],
  loadingData: loading.effects['subDetailDataBase/getDbTableList'],
  loadingStruct: loading.effects['subDetailDataBase/getDBTableStruct'],
}))
@Form.create()
class SubDetailDataBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelName: '浏览',
      modelTitle: '数据',
      modelUnit: '行',
      visible: false,
      modalTitle: '数据导出',
      totals: 0,
      pageTable: 1,
      pageData: 1,
      pageStruct: 1,
    };
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'subDetailDataBase/getDbDetail',
      payload: {
        resourceId: match.params.mountResourceId,
      },
    });
    dispatch({
      type: 'subDetailDataBase/getDbList',
      payload: {
        tableName: match.params.tableName,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      subDetailDataBase: { dataList },
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
      type: 'subDetailDataBase/reset',
      payload: {
        tableList: {
          datas: [],
        },
        dataList: {},
        tableStruct: {},
        dbInfo: {},
      },
    });
  }

  viewTableData = () => {
    const {
      subDetailDataBase: { dataList },
    } = this.props;
    this.setState({
      modelName: '浏览',
      modelTitle: '数据',
      modelUnit: '行',
      totals: dataList.totalCounts || 0,
    });
  };

  viewTableStruct = () => {
    const {
      subDetailDataBase: { tableStruct },
    } = this.props;
    this.setState({
      modelName: '结构',
      modelTitle: '数据项',
      modelUnit: '项',
      totals: tableStruct.totalCounts || 0,
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
      subDetailDataBase: { dbInfo },
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
      subDetailDataBase: { dbInfo },
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
    const {
      dispatch,
      subDetailDataBase: { tableList },
    } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'subDetailDataBase/getDbTableList',
      payload: {
        tableName: tableList.datas[0].name,
        ...paramsPage,
      },
    });
    this.setState({
      pageData: pageNum,
    });
  };

  changePageStruct = (pageNum, pageSize) => {
    const {
      dispatch,
      subDetailDataBase: { tableList },
    } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'subDetailDataBase/getDBTableStruct',
      payload: {
        tableName: tableList.datas[0].name,
        ...paramsPage,
      },
    });
    this.setState({
      pageStruct: pageNum,
    });
  };

  changePageTable = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    const paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'subDetailDataBase/getDBTableStruct',
      payload: {
        id: match.params.id,
        ...paramsPage,
      },
    });
    this.setState({
      pageTable: pageNum,
    });
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  render() {
    let dbType;
    const methods = {
      viewTableData: this.viewTableData,
      viewTableStruct: this.viewTableStruct,
      exportData: this.exportData,
    };
    const {
      subDetailDataBase: { tableList, dbInfo, dataList, tableStruct },
      loadingTable,
      loadingData,
      loadingStruct,
      form: { getFieldDecorator },
    } = this.props;
    const {
      modelName,
      modelTitle,
      modelUnit,
      visible,
      modalTitle,
      totals,
      pageTable,
      pageData,
      pageStruct,
    } = this.state;
    const tableColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (pageTable - 1) * 10}`,
      },
      {
        title: '表名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '中文标注',
        dataIndex: 'comment',
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
        render: (text, record, index) => `${index + 1 + (pageData - 1) * 10}`,
      },
    ];
    const structColumn = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        render: (text, record, index) => `${index + 1 + (pageStruct - 1) * 10}`,
      },
      {
        title: '主键',
        dataIndex: 'indices',
        align: 'center',
        render: text => {
          if (text === 'pri') {
            return <Icon style={{ color: '#fb9a03' }} type="key" theme="outlined" />;
          }
          return '';
        },
      },
      {
        title: '字段名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '数据类型',
        align: 'center',
        dataIndex: 'type',
      },
      {
        title: '中文标注',
        align: 'center',
        dataIndex: 'comment',
      },
    ];
    const {
      dbName,
      name,
      updateTime,
      datasourceEntity,
      createUnit,
      appsysName,
      dutyName,
      dutyPhone,
      dutyPosition,
      describe,
      tableName,
    } = dbInfo;
    if (tableStruct.datas && tableStruct.datas.length > 0) {
      tableStruct.datas.map(item =>
        dataColumn.push({
          title: item.name,
          dataIndex: item.name,
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
    const paginationPropsTable = {
      showQuickJumper: true,
      total: tableList.totalCounts,
      onChange: this.changePageTable,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const paginationPropsStruct = {
      showQuickJumper: true,
      total: tableStruct.totalCounts,
      onChange: this.changePageStruct,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const keyArrInfo = Object.keys(dbInfo);
    if (keyArrInfo.length > 0) {
      dbType = datasourceEntity.type;
    }
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
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
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
      <PageHeaderWrapper action={buttonList}>
        <Card bordered={false}>
          <div className="content_layout">
            <DataBaseInfo dataBaseInfo={dataBaseInfo} />
            <Table
              bordered
              pagination={paginationPropsTable}
              dataSource={tableList.datas}
              className="mt16"
              columns={tableColumn}
              rowKey="name"
              loading={loadingTable}
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
              loading={loadingData}
            />
            <Table
              bordered
              pagination={paginationPropsStruct}
              dataSource={tableStruct.datas}
              columns={structColumn}
              className={`mt16 ${modelName === '结构' ? `${styles.show}` : `${styles.hidden}`}`}
              rowKey="name"
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
                        message: formatMessage({
                          id: 'validation.dbView.export.exportFileName.max',
                        }),
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Form>
            </Modal>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SubDetailDataBase;
