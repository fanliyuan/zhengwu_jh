/*
 * @Author: ChouEric
 * @Date: 2018-07-05 17:20:24
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-19 15:14:05
 * @描述: 这里要做到和表单验证一样的效果,很复杂.暂时不实现,只做简单的验证;
*/
import React, { PureComponent, Fragment } from 'react';
import { Table, Input, Popconfirm, Divider, Tooltip, Select, InputNumber } from 'antd';

// eslint-disable-next-line
import styles from './index.less';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      // target: {},
      enAble: true,
      nameError: false,
      dataTypeError: false,
      dataLengthError: false,
      shareTypeError: false,
      shareModeError: false,
      shareConditionError: false,
      openTypeError: false,
      openConditionError: false,
    };
    // 原始数据的的缓存 -- 其实是每行点击编辑的时候,会把当前行的数据记录下来
    this.cacheOriginData = {};
    this.index = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (sessionStorage.getItem('itemData')) {
      this.setState({
        enAble: false,
      });
    } else {
      this.setState({
        enAble: true,
      });
    }
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }

  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  // 这里是表格单元格的编辑功能
  handleFieldChang = (value, dataIndex, key) => {
    switch (dataIndex) {
      case 'name':
        this.setState({
          nameError: value.length > 50 || value.length < 1,
        });
        break;
      case 'dataLength':
        this.setState({
          dataLengthError: Number.isInteger(value) && value > 0,
        });
        break;
      case 'shareCondition':
        this.setState({
          shareConditionError: value.length > 50 || value.length < 1,
        });
        break;
      case 'openCondition':
        this.setState({
          openConditionError: value.length > 50 || value.length < 1,
        });
        break;
      default:
        break;
    }
    const newData = JSON.parse(JSON.stringify(this.state.data));
    const row = this.getRowByKey(key, newData);
    if (row) {
      row[dataIndex] = value.trim();
      this.setState({
        data: newData,
      });
    }
  };

  toggleEditable = (e, key) => {
    e.preventDefault();
    const newData = JSON.parse(JSON.stringify(this.state.data));
    // console.log(newData)
    const target = this.getRowByKey(key, newData);
    // console.log("target",target)
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  saveRow = (e, key) => {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const row = this.getRowByKey(key) || {};
      // if (!row.infoCode) {
      //   message.error('信息项代码必填');
      //   e.target.focus();
      //   this.setState({
      //     loading: false,
      //   });
      //   return false;
      // }
      delete row.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
      this.setState({
        loading: false,
      });
    }, 200);
    // this.props.handleChange(this.state.data)
  };

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item })); // eslint-disable-line
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key); // eslint-disable-line
    // console.log(newData)
    this.setState({ data: newData });
    this.props.onChange(newData);
  }

  render() {
    const { disabled = false } = this.props;
    const {
      data,
      loading,
      enAble,
      nameError,
      dataTypeError,
      dataLengthError,
      shareTypeError,
      shareConditionError,
      shareModeError,
      openTypeError,
      openConditionError,
    } = this.state;
    const dataType = [
      { id: 1, label: '字符型C', value: 'C' },
      { id: 2, label: '数值型N', value: 'N' },
      { id: 3, label: '货币型Y', value: 'Y' },
      { id: 4, label: '日期型D', value: 'D' },
      { id: 5, label: '日期时间型T', value: 'T' },
      { id: 6, label: '逻辑型L', value: 'L' },
      { id: 7, label: '备注型M', value: 'M' },
      { id: 8, label: '通用型G', value: 'G' },
      { id: 9, label: '双精度型B', value: 'B' },
      { id: 10, label: '整型I', value: 'I' },
      { id: 11, label: '浮点型F', value: 'F' },
      { id: 12, label: '自定义' },
    ];
    const dataTypeOption = dataType.map(item => {
      return (
        <Select.Option value={item.label} key={item.id}>
          {item.label}
        </Select.Option>
      );
    });
    const shareType = [
      { id: 1, label: '共享平台' },
      { id: 2, label: '邮件' },
      { id: 3, label: '拷盘' },
      { id: 4, label: '介质交换（纸质报表）' },
      { id: 5, label: '介质交换（电子文档）' },
      { id: 6, label: '自定义' },
    ];
    const shareTypeOption = shareType.map(item => {
      return (
        <Select.Option value={item.label} key={item.id}>
          {item.label}
        </Select.Option>
      );
    });
    const columns = [
      {
        title: '信息项名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={nameError ? 'has-error' : 'has-success'}>
                  <Input
                    value={text}
                    onChange={e => this.handleFieldChang(e.target.value, 'name', row.key)}
                  />
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={dataTypeError ? 'has-error' : ''}>
                  <Select value={text}>{dataTypeOption}</Select>
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '数据长度',
        dataIndex: 'dataLength',
        key: 'dataLength',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={dataLengthError ? 'has-error' : ''}>
                  <InputNumber
                    value={text}
                    onChange={e => this.handleFieldChang(e, 'dataLength', row.key)}
                  />
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '共享类型',
        dataIndex: 'shareType',
        key: 'shareType',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={shareTypeError ? 'has-error' : ''}>
                  <Select
                    value={text}
                    onChange={e => this.handleFieldChang(e, 'shareType', row.key)}
                  >
                    <Select.Option value="有条件共享">有条件共享</Select.Option>
                    <Select.Option value="无条件共享">无条件共享</Select.Option>
                    <Select.Option value="不予共享">不予共享</Select.Option>
                  </Select>
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '共享条件',
        dataIndex: 'shareCondition',
        key: 'shareCondition',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={shareConditionError ? 'has-error' : ''}>
                  <Input
                    value={text}
                    onChange={e => this.handleFieldChang(e.target.value, 'shareCondition', row.key)}
                  />
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '共享方式',
        dataIndex: 'shareMode',
        key: 'shareMode',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={shareModeError ? 'has-error' : ''}>
                  <Select
                    value={text}
                    onChange={e => this.handleFieldChang(e, 'shareMode', row.key)}
                  >
                    {shareTypeOption}
                  </Select>
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '是否向社会开放',
        dataIndex: 'openType',
        key: 'openType',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={openTypeError ? 'has-error' : ''}>
                  <Select
                    value={text}
                    onChange={e => this.handleFieldChang(e, 'openType', row.key)}
                  >
                    <Select.Option value="是">是</Select.Option>
                    <Select.Option value="否">否</Select.Option>
                  </Select>
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
      {
        title: '开放条件',
        dataIndex: 'openCondition',
        key: 'openCondition',
        render: (text, row) => {
          if (row.editable) {
            return (
              <Tooltip title={text || ''}>
                <div className={openConditionError ? 'has-error' : ''}>
                  <Input
                    value={text}
                    onChange={e => this.handleFieldChang(e.target.value, 'openCondition', row.key)}
                  />
                </div>
              </Tooltip>
            );
          }
          return text;
        },
      },
    ];
    if (!disabled && enAble) {
      columns.push({
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, row) => {
          if (row.editable) {
            if (row.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, row.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(row.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, row.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, row.key)}>取消</a>
              </span>
            );
          }
          return (
            <span style={{ display: enAble ? 'inline-block' : 'none' }}>
              <a onClick={e => this.toggleEditable(e, row.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(row.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      });
    }
    columns.forEach(item => {
      item.align = 'center';
      item.width = '9%';
    });
    // const { loading } = this.props
    return (
      <Fragment>
        <Table columns={columns} dataSource={data} loading={loading} bordered pagination={false} />
      </Fragment>
    );
  }
}
