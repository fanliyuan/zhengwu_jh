import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  message,
  Tree,
  Upload,
  Modal,
  Table,
  Row,
  Col,
} from 'antd';
import styles from './AddDataSource.less';

const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Dragger = Upload.Dragger;
const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];

@connect(({ accessData, loading }) => ({
  accessData,
  loadingTable: loading.effects['accessData/setTableList'],
  loadingColumn: loading.effects['accessData/setColumnList'],
}))
@Form.create()
class AccessDataInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTitle: '',
      dbName: '',
      selectedRowKeys: [],
      selectedTableRowKeys: [],
      structAddDtoList: [],
      tableName: '',
      tableNote: '',
    };
  }

  columns = [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '表名称',
      dataIndex: 'name',
    },
    {
      title: '中文标注',
      dataIndex: 'comment',
    },
  ];

  colColumns = [
    {
      title: '序号',
      dataIndex: 'index',
    },
    {
      title: '主键',
      dataIndex: 'pri',
      render: (text, record, index) => {
        if (text === 'PRI') {
          return <Icon style={{ color: '#fb9a03' }} type="key" theme="outlined" />;
        }
        return '';
      },
    },
    {
      title: '字段名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return `text(${record.length})`;
      },
    },
    {
      title: '中文标注',
      dataIndex: 'comment',
    },
  ];

  componentDidMount() {
    this.props.onRef(this);
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { params } = this.props.accessData;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (params.structAddDtoList.length < 1) {
          return message.error(
            formatMessage({ id: 'validation.accessDataSource.structAddDtoList.required' })
          );
        }
        dispatch({
          type: 'accessData/testName',
          payload: values,
        });
        console.log(this.props);
      }
    });
  };

  selectData = dbName => {
    if (dbName === '') {
      return message.info('请先选择数据库！');
    }
    this.showModal(dbName);
  };

  showModal = dbName => {
    const { dispatch } = this.props;
    const { alias } = this.props.accessData;
    this.setState({
      visible: true,
      modalTitle: '数据库：' + dbName,
      dbName: dbName,
    });
    dispatch({
      type: 'accessData/setTableList',
      payload: {
        alias: alias,
        db: dbName,
      },
    });
  };

  handleOk = e => {
    const { dispatch } = this.props;
    const { structAddDtoList, tableName, tableNote } = this.state;
    console.log(tableName);
    console.log(tableNote);
    dispatch({
      type: 'accessData/addStructAddDtoList',
      payload: structAddDtoList,
    });
    dispatch({
      type: 'accessData/resetTableColumnList',
    });
    dispatch({
      type: 'accessData/updateParams',
      payload: {
        tableName: tableName,
        tableNote: tableNote,
      },
    });
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedTableRowKeys: [],
      tableName: '',
      tableNote: '',
    });
  };

  handleCancel = e => {
    const { dispatch } = this.props;
    const { structAddDtoList } = this.state;
    structAddDtoList.splice(0, structAddDtoList.length);
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedTableRowKeys: [],
      tableName: '',
      tableNote: '',
    });
    dispatch({
      type: 'accessData/resetTableColumnList',
    });
  };

  handleSelectTable = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    const { alias } = this.props.accessData;
    const { structAddDtoList } = this.state;
    this.setState({
      selectedRowKeys: [],
      selectedTableRowKeys: selectedRowKeys,
      tableName: selectedRows[0].name,
      tableNote: selectedRows[0].comment,
    });
    dispatch({
      type: 'accessData/setColumnList',
      payload: {
        alias: alias,
        db: this.state.dbName,
        table: selectedRows[0].name,
      },
    });
    structAddDtoList.splice(0, structAddDtoList.length);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSelectColumn = (record, selected, selectedRows, nativeEvent) => {
    const { structAddDtoList } = this.state;
    let pri;
    switch (record.pri) {
      case 'PRI':
        pri = true;
        break;
      default:
        pri = false;
        break;
    }
    if (selected) {
      structAddDtoList.push({
        columnName: record.name,
        columnType: record.type,
        note: record.comment,
        primaryKey: pri,
      });
    } else {
      structAddDtoList.map((item, index) => {
        if (item.columnName === record.name) {
          structAddDtoList.splice(index, 1);
        }
      });
    }
  };

  handleSelectAllColumn = (selected, selectedRows, changeRows) => {
    const { structAddDtoList } = this.state;
    if (selected) {
      structAddDtoList.splice(0, structAddDtoList.length);
      selectedRows.map((item, index) => {
        let pri;
        switch (item.pri) {
          case 'PRI':
            pri = true;
            break;
          default:
            pri = false;
            break;
        }
        structAddDtoList.push({
          columnName: item.name,
          columnType: item.type,
          note: item.comment,
          primaryKey: pri,
        });
      });
    } else {
      structAddDtoList.splice(0, structAddDtoList.length);
    }
  };

  setRowNum = (record, index) => {
    record.index = index + 1;
  };

  renderDbForm() {
    const { dispatch } = this.props;
    const { params } = this.props;
    const { type, alias } = this.props;
    const { dbList } = this.props.accessData;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
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
      <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.dataType.label" />}
        >
          <h4>{type}</h4>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.dbName.label" />}
        >
          {getFieldDecorator('dbName', {
            initialValue: params.dbName,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.accessDataSource.dbName.required' }),
              },
            ],
          })(
            <Select>
              {dbList.map(d => (
                <Option key={d.name}>{d.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.structAddDtoList.label" />}
        >
          {getFieldDecorator('structAddDtoList', {
            initialValue: params.structAddDtoList,
          })(<a onClick={() => this.selectData(getFieldValue('dbName'))}>选择数据</a>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.name.label" />}
        >
          {getFieldDecorator('name', {
            initialValue: params.name,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.accessDataSource.name.required' }),
              },
              {
                max: 50,
                message: formatMessage({ id: 'validation.accessDataSource.name.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.createUnit.label" />}
        >
          {getFieldDecorator('createUnit', {
            initialValue: params.createUnit,
            rules: [
              {
                max: 50,
                message: formatMessage({ id: 'validation.accessDataSource.createUnit.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.appsysName.label" />}
        >
          {getFieldDecorator('appsysName', {
            initialValue: params.appsysName,
            rules: [
              {
                max: 50,
                message: formatMessage({ id: 'validation.accessDataSource.appsysName.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.describe.label" />}
        >
          {getFieldDecorator('describe', {
            initialValue: params.describe,
            rules: [
              {
                max: 500,
                message: formatMessage({ id: 'validation.accessDataSource.describe.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.dutyName.label" />}
        >
          {getFieldDecorator('dutyName', {
            initialValue: params.dutyName,
            rules: [
              {
                max: 20,
                message: formatMessage({ id: 'validation.accessDataSource.dutyName.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.dutyPhone.label" />}
        >
          {getFieldDecorator('dutyPhone', {
            initialValue: params.dutyPhone,
            rules: [
              {
                pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
                message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.pattern' }),
              },
              {
                max: 11,
                message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form.accessDataSource.dutyPosition.label" />}
        >
          {getFieldDecorator('dutyPosition', {
            initialValue: params.dutyPosition,
            rules: [
              {
                max: 50,
                message: formatMessage({ id: 'validation.accessDataSource.dutyPosition.max' }),
              },
            ],
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };

  renderFtpForm() {
    const { params } = this.props;
    const { type } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
      <Fragment>
        <Tree>{this.renderTreeNodes(treeData)}</Tree>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dataType.label" />}
          >
            <h4>{type}</h4>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.name.label" />}
          >
            {getFieldDecorator('name', {
              initialValue: params.name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.accessDataSource.name.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.name.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.ftp.createUnit.label" />}
          >
            {getFieldDecorator('createUnit', {
              initialValue: params.createUnit,
              rules: [
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.createUnit.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.describe.label" />}
          >
            {getFieldDecorator('describe', {
              initialValue: params.describe,
              rules: [
                {
                  max: 500,
                  message: formatMessage({ id: 'validation.accessDataSource.describe.max' }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyName.label" />}
          >
            {getFieldDecorator('dutyName', {
              initialValue: params.dutyName,
              rules: [
                {
                  max: 20,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyName.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyPhone.label" />}
          >
            {getFieldDecorator('dutyPhone', {
              initialValue: params.dutyPhone,
              rules: [
                {
                  pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.pattern' }),
                },
                {
                  max: 11,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyPosition.label" />}
          >
            {getFieldDecorator('dutyPosition', {
              initialValue: params.dutyPosition,
              rules: [
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPosition.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Fragment>
    );
  }

  renderFileForm() {
    const { params } = this.props;
    const { type } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
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
      <Fragment>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or
            other band files
          </p>
        </Dragger>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dataType.label" />}
          >
            <h4>{type}</h4>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.name.label" />}
          >
            {getFieldDecorator('name', {
              initialValue: params.name,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.accessDataSource.name.required' }),
                },
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.name.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.ftp.createUnit.label" />}
          >
            {getFieldDecorator('createUnit', {
              initialValue: params.createUnit,
              rules: [
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.createUnit.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.describe.label" />}
          >
            {getFieldDecorator('describe', {
              initialValue: params.describe,
              rules: [
                {
                  max: 500,
                  message: formatMessage({ id: 'validation.accessDataSource.describe.max' }),
                },
              ],
            })(<Input type="password" autoComplete="new-password" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyName.label" />}
          >
            {getFieldDecorator('dutyName', {
              initialValue: params.dutyName,
              rules: [
                {
                  max: 20,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyName.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyPhone.label" />}
          >
            {getFieldDecorator('dutyPhone', {
              initialValue: params.dutyPhone,
              rules: [
                {
                  pattern: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.pattern' }),
                },
                {
                  max: 11,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPhone.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dutyPosition.label" />}
          >
            {getFieldDecorator('dutyPosition', {
              initialValue: params.dutyPosition,
              rules: [
                {
                  max: 50,
                  message: formatMessage({ id: 'validation.accessDataSource.dutyPosition.max' }),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Fragment>
    );
  }

  render() {
    const { dataType, loadingTable, loadingColumn } = this.props;
    const { tableList, columnList } = this.props.accessData;
    const { selectedRowKeys, selectedTableRowKeys } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedTableRowKeys,
      onChange: this.handleSelectTable,
    };
    const columnRowSelection = {
      onSelect: this.handleSelectColumn,
      onSelectAll: this.handleSelectAllColumn,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    let tableLength = `数据表 共${tableList.length}张`;
    let columnLength = `数据项 共${columnList.length}项`;
    return (
      <Card bordered={false}>
        {(() => {
          switch (dataType) {
            case 'db':
              return this.renderDbForm();
            case 'ftp':
              return this.renderFtpForm();
            case 'file':
              return this.renderFileForm();
          }
        })()}
        <Modal
          title={this.state.modalTitle}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1200}
          maskClosable={false}
        >
          <Row gutter={16}>
            <Col span={10}>
              <Card title={tableLength} bordered={false}>
                <Table
                  rowKey="name"
                  bordered
                  onRow={this.setRowNum}
                  columns={this.columns}
                  dataSource={tableList}
                  size="small"
                  loading={loadingTable}
                  rowSelection={rowSelection}
                />
              </Card>
            </Col>
            <Col span={14}>
              {columnList.length < 1 && (
                <Card title={columnLength} bordered={false}>
                  请选择数据表
                </Card>
              )}
              {columnList.length > 0 && (
                <Card title={columnLength} bordered={false}>
                  <Table
                    rowKey="name"
                    bordered
                    onRow={this.setRowNum}
                    columns={this.colColumns}
                    dataSource={columnList}
                    size="small"
                    loading={loadingColumn}
                    rowSelection={columnRowSelection}
                    pagination={false}
                  />
                </Card>
              )}
            </Col>
          </Row>
        </Modal>
      </Card>
    );
  }
}

export default AccessDataInfo;
