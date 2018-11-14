import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Select,
  Card,
  Icon,
  message,
  Tree,
  Upload,
  Modal,
  Table,
  Row,
  Col,
  Alert,
} from 'antd';
import styles from './AddDataSource.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { DirectoryTree } = Tree;
const { TreeNode } = Tree;
const { Dragger } = Upload;

@connect(({ accessData, loading }) => ({
  accessData,
  loadingTable: loading.effects['accessData/setTableList'],
  loadingColumn: loading.effects['accessData/setColumnList'],
}))
@Form.create()
class AccessDataInfo extends PureComponent {
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: text => {
        const { page } = this.state;
        return `${text + (page - 1) * 10}`;
      },
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
      render: text => {
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
      render: (text, record) => `text(${record.length})`,
    },
    {
      title: '中文标注',
      dataIndex: 'comment',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      page: 1,
      modalTitle: '',
      dbName: '',
      selectedRowKeys: [],
      selectedTableRowKeys: [],
      structAddDtoList: [],
      tableName: '',
      tableNote: '',
      fileTypes: [
        {
          name: 'file-text',
          datas: ['txt'],
        },
        {
          name: 'file-pdf',
          datas: ['pdf'],
        },
        {
          name: 'file-word',
          datas: ['doc', 'docx'],
        },
        {
          name: 'file-excel',
          datas: ['xls', 'xlsx'],
        },
        {
          name: 'file-ppt',
          datas: ['ppt', 'pptx'],
        },
        {
          name: 'picture',
          datas: ['jpg', 'png', 'bmp', 'gif', 'jpeg'],
        },
        {
          name: 'code',
          datas: ['html', 'css', 'js', 'java', 'php'],
        },
        {
          name: 'folder',
          datas: ['folder'],
        },
      ],
      fileList: [],
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  handleSubmit = () => {
    const {
      form,
      dispatch,
      match,
      accessData: { params, dataType },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (dataType === 'db' && params.structAddDtoList.length < 1) {
          message.destroy();
          return message.error(
            formatMessage({ id: 'validation.accessDataSource.structAddDtoList.required' })
          );
        }

        if (dataType === 'ftp' && params.ftpfileAddDtoList.length < 1) {
          message.destroy();
          return message.error(
            formatMessage({ id: 'validation.accessDataSource.ftpfileAddDtoList.required' })
          );
        }

        if (dataType === 'file') {
          const { fileList } = this.state;
          if (fileList.length < 1) {
            message.destroy();
            return message.error(
              formatMessage({ id: 'validation.accessDataSource.fileAddDtoList.required' })
            );
          }
          const paramsFile = [];
          fileList.map(item => {
            return paramsFile.push(item.response.result.data);
          });
          values.fileAddDtoList = paramsFile;
        }

        dispatch({
          type: 'accessData/testName',
          payload: {
            values,
            dataType,
            id: match.params.id,
          },
        });
      }
    });
  };

  selectData = dbName => {
    if (dbName === '') {
      message.destroy();
      return message.info('请先选择数据库！');
    }
    return this.showModal(dbName);
  };

  showModal = dbName => {
    const {
      dispatch,
      accessData: { alias },
    } = this.props;
    this.setState({
      visible: true,
      modalTitle: `数据库：${dbName}`,
      dbName,
    });
    dispatch({
      type: 'accessData/setTableList',
      payload: {
        alias,
        db: dbName,
      },
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { structAddDtoList, tableName, tableNote } = this.state;
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
        tableName,
        tableNote,
      },
    });
    this.setState({
      visible: false,
      page: 1,
      selectedRowKeys: [],
      selectedTableRowKeys: [],
      tableName: '',
      tableNote: '',
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    const { structAddDtoList } = this.state;
    structAddDtoList.splice(0, structAddDtoList.length);
    this.setState({
      visible: false,
      page: 1,
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
    const {
      dispatch,
      accessData: { alias },
    } = this.props;
    const { structAddDtoList, dbName } = this.state;
    this.setState({
      selectedRowKeys: [],
      selectedTableRowKeys: selectedRowKeys,
      tableName: selectedRows[0].name,
      tableNote: selectedRows[0].comment,
    });
    dispatch({
      type: 'accessData/setColumnList',
      payload: {
        alias,
        db: dbName,
        table: selectedRows[0].name,
      },
    });
    structAddDtoList.splice(0, structAddDtoList.length);
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSelectColumn = (record, selected) => {
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

  handleSelectAllColumn = (selected, selectedRows) => {
    const { structAddDtoList } = this.state;
    if (selected) {
      structAddDtoList.splice(0, structAddDtoList.length);
      selectedRows.map(item => {
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

  onLoadTreeData = treeNode => {
    const {
      dispatch,
      type,
      accessData: { alias },
    } = this.props;
    const { path, name, open, children } = treeNode.props.dataRef;
    return new Promise(resolve => {
      if (open && !children) {
        resolve(
          dispatch({
            type: 'accessData/setTreeList',
            payload: {
              params: {
                alias,
                path: `${path}${name}/`,
              },
              type: 'update',
              treeNode,
              treeType: type,
            },
          })
        );
      } else {
        resolve();
      }
    });
  };

  checkTree = (checkedKeys, e) => {
    const { halfCheckedKeys } = e;
    const addNodes = [];
    e.checkedNodes.map(item => {
      const { dataRef } = item.props;
      const { path } = dataRef;
      if (path === '/') {
        addNodes.push(dataRef.key);
      } else {
        const newPath = path.substr(0, path.length - 1);
        if (halfCheckedKeys.indexOf(newPath) !== -1) {
          addNodes.push(dataRef.key);
        }
      }
    });
    this.addFtpfileAddDtoList(addNodes, e.checkedNodes);
  };

  addFtpfileAddDtoList = (nodes, checkedNodes) => {
    const { dispatch } = this.props;
    let params = [];
    checkedNodes.map(item => {
      if (nodes.indexOf(item.key) !== -1) {
        params.push({
          name: item.props.dataRef.name,
          open: item.props.dataRef.open,
          path: item.props.dataRef.path,
          type: item.props.dataRef.type,
        });
      }
    });
    dispatch({
      type: 'accessData/addFtpfileAddDtoList',
      payload: params,
    });
    dispatch({
      type: 'accessData/addDefaultCheckedKeys',
      payload: nodes,
    });
  };

  uploadBefore = (file, fileList) => {
    return new Promise((resolve, reject) => {
      if (file.size > 52428800) {
        message.destroy();
        reject(message.error(`${file.name} 大于50M，停止上传！`));
      } else {
        resolve();
      }
    });
  };

  addFileAddDtoList = info => {
    console.log(info);
    const status = info.file.status;
    if (status !== 'uploading') {
      this.setState({
        fileList: info.fileList,
      });
    }
    if (status === 'done') {
      message.success(`${info.file.name}上传成功！`);
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败！`);
    }
  };

  renderDbForm() {
    const { params, type } = this.props;
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
          })(<TextArea rows={4} />)}
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
    const { fileTypes } = this.state;
    return data.map(item => {
      if (item.open) {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            icon={<Icon type="folder" theme="outlined" />}
            title={item.name}
            key={item.key}
            dataRef={item}
          />
        );
      }
      let type = 'file';
      for (let i = 0, len = fileTypes.length; i < len; i++) {
        if (fileTypes[i].datas.indexOf(item.type) !== -1) {
          type = fileTypes[i].name;
          break;
        }
      }
      return (
        <TreeNode
          isLeaf={true}
          icon={<Icon type={type} theme="outlined" />}
          title={item.name}
          key={item.key}
          dataRef={item}
        />
      );
    });
  };

  renderFtpForm() {
    const { params, type } = this.props;
    const { treeList, checkedKeys } = this.props.accessData;
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
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="结构树">
            {treeList.length < 1 && <Alert message="数据加载中..." type="info" showIcon />}
            {treeList.length > 0 && (
              <DirectoryTree
                className={styles.tree}
                checkable
                showIcon
                loadData={this.onLoadTreeData}
                onCheck={this.checkTree}
                defaultCheckedKeys={checkedKeys}
                defaultExpandedKeys={checkedKeys}
              >
                {this.renderTreeNodes(treeList)}
              </DirectoryTree>
            )}
          </FormItem>
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
            })(<TextArea rows={4} />)}
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
    const { params, type } = this.props;
    const { fileList } = this.state;
    console.log(this.props);
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
    const fileProps = {
      name: 'file',
      multiple: true,
      action: '/api/api/v2/zhengwu/swap/datasource/file/up',
      beforeUpload: this.uploadBefore,
      onChange: this.addFileAddDtoList,
      fileList: fileList,
    };
    return (
      <Fragment>
        <Dragger {...fileProps}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">单击或拖动文件到该区域上传</p>
          <p className="ant-upload-hint">支持单个或批量上传</p>
        </Dragger>
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="form.accessDataSource.dataType.label" />}
          >
            <h4>本地文件上传</h4>
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
            })(<TextArea rows={4} />)}
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

  changePage = (current, pageSize) => {
    const { dispatch } = this.props;
    this.setState({
      page: current,
    });
  };

  render() {
    const { dataType, loadingTable, loadingColumn } = this.props;
    const { tableList, columnList } = this.props.accessData;
    const { selectedRowKeys, selectedTableRowKeys, page } = this.state;
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
    let paginationProps = {
      current: page,
      onChange: this.changePage,
      pageSize: 10,
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
                  pagination={paginationProps}
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
