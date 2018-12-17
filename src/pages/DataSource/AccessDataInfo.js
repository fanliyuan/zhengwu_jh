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
import codeThumb from '../../assets/code.svg';
import fileThumb from '../../assets/file.svg';
import fileExcelThumb from '../../assets/file-excel.svg';
import fileImageThumb from '../../assets/file-image.svg';
import filePdfThumb from '../../assets/file-pdf.svg';
import filePptThumb from '../../assets/file-ppt.svg';
import fileTextThumb from '../../assets/file-text.svg';
import fileWordThumb from '../../assets/file-word.svg';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const { DirectoryTree } = Tree;
const { TreeNode } = Tree;
const { Dragger } = Upload;
const tree = [];

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
      dataIndex: 'indices',
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
      render: (text, record) => `${text}(${record.length})`,
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
      hasReceiveFiles: false,
      hasSetRowKeys: false,
      page: 1,
      modalTitle: '',
      dbName: '',
      selectedRowKeys: [],
      hasSelectedRowKeys: [],
      selectedTableRowKeys: [],
      hasSelectedTableRowKeys: [],
      structAddDtoList: [],
      tableName: '',
      tableNote: '',
      fileTypes: [
        {
          name: 'file-text',
          thumb: fileTextThumb,
          datas: ['txt'],
        },
        {
          name: 'file-pdf',
          thumb: filePdfThumb,
          datas: ['pdf'],
        },
        {
          name: 'file-word',
          thumb: fileWordThumb,
          datas: ['doc', 'docx'],
        },
        {
          name: 'file-excel',
          thumb: fileExcelThumb,
          datas: ['xls', 'xlsx'],
        },
        {
          name: 'file-ppt',
          thumb: filePptThumb,
          datas: ['ppt', 'pptx'],
        },
        {
          name: 'picture',
          thumb: fileImageThumb,
          datas: ['jpg', 'png', 'bmp', 'gif', 'jpeg'],
        },
        {
          name: 'code',
          thumb: codeThumb,
          datas: ['html', 'css', 'js', 'java', 'php'],
        },
        {
          name: 'folder',
          thumb: fileThumb,
          datas: ['folder'],
        },
      ],
      fileList: [],
    };
  }

  componentDidMount() {
    const {
      onRef,
      route,
      accessData: {
        params: { fileAddDtoList },
      },
    } = this.props;
    const { hasReceiveFiles } = this.state;
    if (route.name === 'managementUpdate' && !hasReceiveFiles) {
      if (fileAddDtoList && fileAddDtoList.length > 0) {
        const { fileTypes } = this.state;
        fileAddDtoList.map(item => {
          let flag = false;
          Object.defineProperty(item, 'name', {
            value: `${item.name}（${this.setFileSize(item.size)}）`,
          });
          for (let i = 0, len = fileTypes.length; i < len; i += 1) {
            if (fileTypes[i].datas.indexOf(item.type) !== -1) {
              flag = true;
              Object.defineProperty(item, 'thumbUrl', {
                value: fileTypes[i].thumb,
              });
              break;
            }
          }
          if (!flag) {
            Object.defineProperty(item, 'thumbUrl', {
              value: fileThumb,
            });
          }
          return item;
        });
        this.setState({
          fileList: fileAddDtoList,
          hasReceiveFiles: true,
        });
      }
    }
    onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    const { route, dataType } = this.props;
    const {
      accessData: { params },
    } = nextProps;
    const {
      hasReceiveFiles,
      hasSetRowKeys,
      selectedTableRowKeys,
      selectedRowKeys,
      hasSelectedRowKeys,
      hasSelectedTableRowKeys,
    } = this.state;
    if (route.name === 'managementUpdate' && !hasReceiveFiles) {
      const { fileAddDtoList } = nextProps.params;
      if (fileAddDtoList && fileAddDtoList.length > 0) {
        const { fileTypes } = this.state;
        fileAddDtoList.map(item => {
          let flag = false;
          Object.defineProperty(item, 'name', {
            value: `${item.name}（${this.setFileSize(item.size)}）`,
          });
          for (let i = 0, len = fileTypes.length; i < len; i += 1) {
            if (fileTypes[i].datas.indexOf(item.type) !== -1) {
              flag = true;
              Object.defineProperty(item, 'thumbUrl', {
                value: fileTypes[i].thumb,
              });
              break;
            }
          }
          if (!flag) {
            Object.defineProperty(item, 'thumbUrl', {
              value: fileThumb,
            });
          }
          return item;
        });
        this.setState({
          fileList: fileAddDtoList,
          hasReceiveFiles: true,
        });
      }
    }
    if (route.name === 'managementUpdate' && !hasSetRowKeys && dataType === 'db') {
      if (selectedTableRowKeys.length < 1 && params.tableName !== '') {
        selectedTableRowKeys.push(params.tableName);
        hasSelectedTableRowKeys.push(params.tableName);
      }
      if (selectedRowKeys.length < 1 && params.structAddDtoList.length > 0) {
        params.structAddDtoList.map(item => selectedRowKeys.push(item.columnName));
        params.structAddDtoList.map(item => hasSelectedRowKeys.push(item.columnName));
      }
      this.setState({
        hasSetRowKeys: true,
      });
    }
  }

  handleSubmit = () => {
    const {
      form,
      dispatch,
      match,
      route,
      accessData: { params, dataType, oldName },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const paramsValues = values;
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
            if (item.response) {
              return paramsFile.push(item.response.result.data);
            }
            return paramsFile.push({
              id: item.id,
              name: item.uname,
              size: item.size,
              type: item.type,
              uploadTime: item.uploadTime,
              path: item.path,
            });
          });
          paramsValues.fileAddDtoList = paramsFile;
        }

        dispatch({
          type: 'accessData/testName',
          payload: {
            values: paramsValues,
            dataType,
            oldName,
            routeName: route.name,
            id: match.params.id,
          },
        });
      }
      return false;
    });
  };

  changeDbName = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessData/updateParams',
      payload: {
        tableName: '',
        tableNote: '',
        structAddDtoList: [],
      },
    });
  };

  selectData = dbName => {
    const {
      accessData: { params },
    } = this.props;
    if (dbName === '') {
      message.destroy();
      return message.info('请先选择数据库！');
    }
    return this.showModal(dbName, params);
  };

  showModal = (dbName, params) => {
    const {
      dispatch,
      accessData: { alias },
    } = this.props;
    const { tableName, tableNote, structAddDtoList } = params;
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
    if (tableName !== '') {
      this.setState({
        tableName,
        tableNote,
        structAddDtoList: [...structAddDtoList],
      });
      dispatch({
        type: 'accessData/setColumnList',
        payload: {
          alias,
          db: dbName,
          table: tableName,
        },
      });
    }
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const {
      structAddDtoList,
      tableName,
      tableNote,
      selectedRowKeys,
      selectedTableRowKeys,
    } = this.state;
    dispatch({
      type: 'accessData/resetTableColumnList',
    });
    dispatch({
      type: 'accessData/updateParams',
      payload: {
        tableName,
        tableNote,
        structAddDtoList,
      },
    });
    this.setState({
      visible: false,
      page: 1,
      hasSelectedRowKeys: [...selectedRowKeys],
      hasSelectedTableRowKeys: [...selectedTableRowKeys],
      structAddDtoList: [],
      tableName: '',
      tableNote: '',
    });
  };

  handleCancel = () => {
    const { dispatch } = this.props;
    const { hasSelectedRowKeys, hasSelectedTableRowKeys } = this.state;
    this.setState({
      visible: false,
      page: 1,
      selectedRowKeys: [...hasSelectedRowKeys],
      selectedTableRowKeys: [...hasSelectedTableRowKeys],
      structAddDtoList: [],
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
      accessData: { alias, ip, port, username, password },
    } = this.props;
    const { dbName } = this.state;
    dispatch({
      type: 'accessData/updateParams',
      payload: {
        tableName: '',
        tableNote: '',
        structAddDtoList: [],
      },
    });
    dispatch({
      type: 'accessData/setColumnList',
      payload: {
        alias,
        addr: ip,
        port,
        username,
        password,
        db: dbName,
        table: selectedRows[0].name,
      },
    });
    this.setState({
      selectedRowKeys: [],
      selectedTableRowKeys: selectedRowKeys,
      structAddDtoList: [],
      tableName: selectedRows[0].name,
      tableNote: selectedRows[0].comment,
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleSelectColumn = (record, selected) => {
    const { structAddDtoList } = this.state;
    let pri;
    switch (record.indices) {
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
          return structAddDtoList.splice(index, 1);
        }
        return false;
      });
    }
    this.setState({
      structAddDtoList,
    });
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
        return structAddDtoList.push({
          columnName: item.name,
          columnType: item.type,
          note: item.comment,
          primaryKey: pri,
        });
      });
    } else {
      structAddDtoList.splice(0, structAddDtoList.length);
    }
    this.setState({
      structAddDtoList,
    });
  };

  setRowNum = (record, index) => {
    Object.defineProperty(record, 'index', { value: index + 1 });
    return record;
  };

  onLoadTreeData = treeNode => {
    const {
      dispatch,
      type,
      accessData: { ip, port, username, password },
    } = this.props;
    const { path, name, open, children } = treeNode.props.dataRef;
    return new Promise(resolve => {
      if (open && !children) {
        resolve(
          dispatch({
            type: 'accessData/setTreeList',
            payload: {
              params: {
                addr: ip,
                port,
                username,
                password,
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
        return addNodes.push(`${dataRef.path}${dataRef.name}`);
      }
      const newPath = path.substr(0, path.length - 1);
      if (halfCheckedKeys.indexOf(newPath) !== -1) {
        return addNodes.push(`${dataRef.path}${dataRef.name}`);
      }
      return false;
    });
    this.addFtpfileAddDtoList(addNodes, e.checkedNodes);
  };

  addFtpfileAddDtoList = (nodes, checkedNodes) => {
    const { dispatch } = this.props;
    const params = [];
    checkedNodes.map(item => {
      if (nodes.indexOf(item.key) !== -1) {
        return params.push({
          name: item.props.dataRef.name,
          open: item.props.dataRef.open,
          path: item.props.dataRef.path,
          type: item.props.dataRef.type,
          size: item.props.dataRef.size,
          time: item.props.dataRef.time,
        });
      }
      return false;
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

  uploadBefore = file =>
    new Promise((resolve, reject) => {
      const { fileList } = this.state;
      for (let i = 0, len = fileList.length; i < len; i += 1) {
        if (fileList[i].uname === file.name) {
          message.destroy();
          reject(message.error(`已上传名称为“${file.name}”的文件，请不要上传名称相同的文件！`));
        }
      }
      if (file.size > 52428800) {
        message.destroy();
        reject(message.error(`${file.name} 大于50M，停止上传！`));
      } else {
        resolve();
      }
    }).catch(error => {
      console.log(error);
    });

  addFileAddDtoList = info => {
    const { status, name, size } = info.file;
    const { fileTypes } = this.state;
    Object.defineProperty(info.file, 'name', {
      value: `${name}（${this.setFileSize(size)}）`,
    });
    if (!info.file.uname) {
      Object.defineProperty(info.file, 'uname', {
        value: `${name}`,
      });
    }
    if (status !== 'uploading') {
      if (info.fileList.length > 0) {
        const file = info.fileList[info.fileList.length - 1];
        if (file.response) {
          const { type } = file.response.result.data;
          for (let i = 0, len = fileTypes.length; i < len; i += 1) {
            if (fileTypes[i].datas.indexOf(type) !== -1) {
              Object.defineProperty(file, 'thumbUrl', {
                value: fileTypes[i].thumb,
              });
              break;
            }
          }
        }
      }
      this.setState({
        fileList: info.fileList,
      });
    }
    if (status === 'done') {
      message.success(`${name}上传成功！`);
    } else if (status === 'error') {
      message.error(`${name}上传失败！`);
    }
  };

  onPreview = () => false;

  setFileSize = size => {
    if (size === null || size === 0) {
      return '0 Bytes';
    }
    const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const srcSize = parseFloat(size);
    const index = Math.floor(Math.log(srcSize) / Math.log(1024));
    let powNum = 1;
    for (let i = 0, len = index; i < len; i += 1) {
      powNum *= 1024;
    }
    let newSize = srcSize / powNum;
    newSize = newSize.toFixed(2);
    return newSize + unitArr[index];
  };

  changePage = current => {
    this.setState({
      page: current,
    });
  };

  deepTree = treeList => {
    for (let i = 0, len = treeList.length; i < len; i += 1) {
      tree.push(treeList[i]);
      if (treeList[i].ftpFileList !== '') {
        this.deepTree(treeList[i].ftpFileList);
      }
    }
  };

  renderDbForm() {
    const {
      params,
      type,
      accessData: { dbList },
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
            <Select onChange={this.changeDbName}>
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
          })(
            <Fragment>
              <a onClick={() => this.selectData(getFieldValue('dbName'))}>选择数据</a>
              {params.structAddDtoList.length < 1 && (
                <Icon
                  style={{ color: '#F04458', marginLeft: 5 }}
                  type="close-circle"
                  theme="filled"
                />
              )}
              {params.structAddDtoList.length > 0 && (
                <Icon
                  style={{ color: '#19BB8F', marginLeft: 5 }}
                  type="check-circle"
                  theme="filled"
                />
              )}
            </Fragment>
          )}
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
            <TreeNode title={item.name} key={`${item.path}${item.name}`} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            icon={<Icon type="folder" theme="outlined" />}
            title={item.name}
            key={`${item.path}${item.name}`}
            dataRef={item}
          />
        );
      }
      let type = 'file';
      for (let i = 0, len = fileTypes.length; i < len; i += 1) {
        if (fileTypes[i].datas.indexOf(item.type) !== -1) {
          type = fileTypes[i].name;
          break;
        }
      }
      return (
        <TreeNode
          isLeaf
          icon={<Icon type={type} theme="outlined" />}
          title={item.name}
          key={`${item.path}${item.name}`}
          dataRef={item}
        />
      );
    });
  };

  renderAllTreeNodes = data => {
    const { fileTypes } = this.state;
    return data.map(item => {
      if (item.open) {
        if (item.ftpFileList.length > 0) {
          return (
            <TreeNode title={item.name} key={`${item.path}${item.name}`} dataRef={item}>
              {this.renderAllTreeNodes(item.ftpFileList)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            icon={<Icon type="folder" theme="outlined" />}
            title={item.name}
            key={`${item.path}${item.name}`}
            dataRef={item}
          />
        );
      }
      let type = 'file';
      for (let i = 0, len = fileTypes.length; i < len; i += 1) {
        if (fileTypes[i].datas.indexOf(item.type) !== -1) {
          type = fileTypes[i].name;
          break;
        }
      }
      return (
        <TreeNode
          isLeaf
          icon={<Icon type={type} theme="outlined" />}
          title={item.name}
          key={`${item.path}${item.name}`}
          dataRef={item}
        />
      );
    });
  };

  renderAsyncTree = treeList => {
    const {
      accessData: { checkedKeys },
    } = this.props;
    return (
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
    );
  };

  renderSyncTree = treeList => {
    this.deepTree(treeList);
    const {
      accessData: { checkedKeys, params },
    } = this.props;
    params.ftpfileAddDtoList.map(item => {
      for (let i = 0, len = tree.length; i < len; i += 1) {
        if (`${tree[i].path}${tree[i].name}` === `${item.path}${item.name}`) {
          Object.defineProperty(item, 'size', {
            value: tree[i].size,
            enumerable: true,
          });
          Object.defineProperty(item, 'time', {
            value: tree[i].time,
            enumerable: true,
          });
          break;
        }
      }
      return false;
    });
    return (
      <DirectoryTree
        className={styles.tree}
        checkable
        showIcon
        onCheck={this.checkTree}
        defaultCheckedKeys={checkedKeys}
        defaultExpandedKeys={checkedKeys}
      >
        {this.renderAllTreeNodes(treeList)}
      </DirectoryTree>
    );
  };

  renderFtpForm() {
    const {
      params,
      type,
      // route,
      accessData: { treeList },
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
            {treeList.length > 0 && (() => this.renderSyncTree(treeList))()}
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
    let fileTotal = 0;
    const {
      params,
      form: { getFieldDecorator },
    } = this.props;
    const { fileList } = this.state;
    const fileNums = fileList.length;
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
      defaultFileList: params.fileAddDtoList,
      listType: 'picture',
      onPreview: this.onPreview,
    };
    fileList.map(item => {
      fileTotal += parseInt(item.size, 10);
      return fileTotal;
    });
    return (
      <Fragment>
        <Dragger {...fileProps} className={styles.hiddenFiles}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">单击或拖动文件到该区域上传</p>
          <p className="ant-upload-hint">支持单个或批量上传</p>
          <p className="ant-upload-hint">最大上传文件大小：50 MB</p>
          <p className="ant-upload-hint">
            <span style={{ color: '#ed4014' }}>{fileNums}</span> 个文件上传已完成，共{' '}
            <span style={{ color: '#ed4014' }}>{this.setFileSize(fileTotal)}</span>
          </p>
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

  render() {
    const {
      dataType,
      loadingTable,
      loadingColumn,
      accessData: { tableList, columnList },
    } = this.props;
    const { selectedRowKeys, selectedTableRowKeys, page, modalTitle, visible } = this.state;
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: selectedTableRowKeys,
      onChange: this.handleSelectTable,
    };
    const columnRowSelection = {
      onSelect: this.handleSelectColumn,
      onSelectAll: this.handleSelectAllColumn,
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const paginationProps = {
      current: page,
      onChange: this.changePage,
      pageSize: 10,
    };
    const disabled = selectedRowKeys.length > 0 ? 0 : 1;
    const okButtonProps = { disabled };
    const tableLength = `数据表 共${tableList.length}张`;
    const columnLength = `数据项 共${columnList.length}项`;
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
            default:
              return '';
          }
        })()}
        <Modal
          title={modalTitle}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1200}
          maskClosable={false}
          okButtonProps={okButtonProps}
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
