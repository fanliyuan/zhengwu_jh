import React, { Component } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Card,
  Checkbox,
  DatePicker,
  Popconfirm,
  message,
  Cascader,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';

import styles from './SourceManagement.less';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
// import { format0, format24 } from '../../utils/utils'

const { Option } = Select;
const { RangePicker } = DatePicker;
const { isMoment } = moment;
@connect(({ informationResource }) => ({
  informationResource,
  // loading:loading.effects.
}))
export default class SourceManagement extends Component {
  state = {
    queryData: {
      name: '',
      code: '',
      beginTime: '',
      endTime: '',
      mount: false,
      status: '-2',
      typeId: '',
    },
    classfiyValue: [],
    timeValue: [],
  };

  componentDidMount() {
    // this.setState({
    //   isNodeOperator: Cookies.get(['antd-pro-authority']) === 'operator-n',
    // })
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/getResourceList',
      payload: { pageNum: 1, pageSize: 10, mount: false },
    });
    dispatch({
      type: 'informationResource/getClassfiyList',
    });
  }

  nameChange = e => {
    const { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        name: e.target.value.trim(),
      },
    });
  };

  codeChange = e => {
    const { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        code: e.target.value,
      },
    });
  };

  handleIsRelated = e => {
    const { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        mount: e.target.checked,
      },
    });
  };

  // dataTypeChange = val => {
  //   const { queryData } = this.state;
  //   this.setState({
  //     queryData: {
  //       ...queryData,
  //       dataType: val === '' ? undefined : val,
  //     },
  //     // isChanged: true,
  //   });
  // };

  // nodeChange = (val, params) => {
  //   const { queryData } = this.state;
  //   this.setState({
  //     queryData: {
  //       ...queryData,
  //       nodeId: val[0] && +[...val].pop(),
  //       nodeName: params[0] && params[0].label,
  //     },
  //     isChanged: true,
  //   });
  // };

  statusChange = val => {
    const { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        status: val,
      },
      // isChanged: true,
    });
  };

  timeChange = val => {
    const { queryData } = this.state;
    const timeArr = val.map(item => {
      if (isMoment(item)) {
        return item.format('YYYY-MM-DD');
      } else {
        // eslint-disable-line
        return ''; // eslint-disable-line
      }
    });
    this.setState({
      queryData: {
        ...queryData,
        beginTime: timeArr[0], //  ? timeArr[0]+' 00:59:59' : ''
        endTime: timeArr[1], // ? timeArr[1]+' 00:59:59' : ''
      },
      timeValue: val,
      // isChanged: true,
    });
  };

  tableChange = pagination => {
    this.searchHandle(pagination);
  };

  searchHandle = ({ pageSize, current }) => {
    // const { isChanged } = this.state;
    // if (!isChanged && flag) return null;
    const {
      queryData: { name, code, beginTime, endTime, mount, status, typeId },
    } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/getResourceList',
      payload: {
        // body: {
        pageSize: pageSize || 10,
        pageNum: current || 1,
        name: name || undefined,
        code: code || undefined,
        beginTime: beginTime || undefined,
        endTime: endTime || undefined,
        mount,
        status: +status === -2 ? undefined : +status,
        typeId: typeId || undefined,
        // },
      },
    });
    // this.setState({
    //   isChanged: false,
    // });
  };

  handleSource = id => {
    const { dispatch } = this.props;
    // if (row.dataType === 'file') {
    //   dispatch(routerRedux.push('/dataSourceManagement/fileSource', { mountResourceId: row.id }))
    // } else {
    //   dispatch(routerRedux.push('/dataSourceManagement/dataBaseSource', { mountResourceId: row.id }))
    // }
    dispatch(routerRedux.push(`/informationResource/viewDirectory/${id}`));
  };

  // handleSource1 = () => {
  //   const { dispatch } = this.props
  //   dispatch(routerRedux.push('/dataSourceManagement/fileSource'))
  // }

  // handleTask = () => {
  //   const { dispatch } = this.props
  //   dispatch(routerRedux.push('/dataSourceManagement/task'))
  // }

  handleEdit = row => {
    const { dispatch } = this.props;
    message.destroy();
    if (row.mount) {
      message.error('数据已关联不可修改!');
      return;
    }
    dispatch(
      routerRedux.push({
        pathname: '/informationResource/editMenu/one',
        state: { editId: row.id },
      })
    );
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'informationResource/deleteResources',
      payload: { id },
    });
  };

  handleCatalog = () => {
    // const { dispatch } = this.props;
    // dispatch(routerRedux.push('/dataSourceManagement/catalog'))
    // dispatch(routerRedux.push('/dataSourceManagement/viewDirectory', { resourceId: row.resourceId }))
  };

  handlerelatedData = id => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/informationResource/resourceConnection',
        state: { routeId: id },
      })
    );
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/informationResource/newMenu/one'));
  };

  handleOpen = id => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/informationResource/openShare',
        state: { openId: id },
      })
    );
  };

  handleInput = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/informationResource/inputDirectory'));
  };

  handleCheckLog = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/informationResource/audit/auditLog/${id}`));
  };

  handleClassfiy = val => {
    const { queryData } = this.state;
    let ids;
    if (val.length === 0) {
      ids = '';
    } else if (val.length === 1) {
      ids = val[0]; // eslint-disable-line
    } else {
      ids = val.join('-');
    }
    this.setState({
      queryData: {
        ...queryData,
        typeId: ids,
      },
      classfiyValue: val,
    });
  };

  handleReset = async () => {
    const { queryData } = this.state;
    await this.setState({
      queryData: {
        ...queryData,
        name: '',
        code: '',
        beginTime: '',
        endTime: '',
        mount: false,
        status: '-2',
        typeId: '',
      },
      classfiyValue: [],
      timeValue: [],
    });
    this.searchHandle({});
  };

  render() {
    const that = this;
    // const { isNodeOperator } = this.state
    const {
      informationResource: { resourceList, pagination, classfiyList },
    } = this.props;
    // const parentNodeList = [];
    // const dataList = [];
    // const pagination = false;
    // const options = [
    //   {
    //     value: '0-0',
    //     label: '北京国土局',
    //     children: [
    //       {
    //         value: '0-0-1',
    //         label: '海淀国土局',
    //         // children: [{
    //         //   value: 'xihu',
    //         //   label: 'West Lake',
    //         // }],
    //       },
    //     ],
    //   },
    //   {
    //     value: '0-1',
    //     label: '河北国土局',
    //     children: [
    //       {
    //         value: '0-1-0',
    //         label: '保定国土局',
    //         // children: [{
    //         //   value: 'zhonghuamen',
    //         //   label: 'Zhong Hua Men',
    //         // }],
    //       },
    //     ],
    //   },
    // ]
    // const data = [
    //   { value: '', id: -1, label: '资源属性分类' },
    //   { value: '数据库', id: 0, label: '数据库' },
    //   { value: '文件', id: 1, label: '文件' },
    //   { value: 'FTP', id: 2, label: 'FTP' },
    // ];
    // const selectData = data.map(item => (
    //   <Option value={item.value} key={item.id} title={item.label}>
    //     {item.label}
    //   </Option>
    // ));
    // const data1 = [{ value: '0', id: 0, label: '节点' }, { value: '1', id: 1, label: '节点1' }]
    // const selectData1 = data1.map(item => {
    //   return (
    //     <Option value={item.value} key={item.id} title={item.label}>
    //       {item.label}
    //     </Option>
    //   )
    // })
    // const data2 = [
    //   { value: '0', id: 0, label: '所属机构' },
    //   { value: '1', id: 1, label: 'XXX机构' },
    // ]
    // const selectData2 = data2.map(item => {
    //   return (
    //     <Option value={item.value} key={item.id} title={item.label}>
    //       {item.label}
    //     </Option>
    //   )
    // })
    const data4 = [
      { value: '-2', label: '全部审核状态' },
      { value: '0', label: '已拒绝' },
      { value: '1', label: '已通过' },
      { value: '-1', label: '待审核' },
    ];
    const selectData4 = data4.map(item => (
      <Option value={item.value} key={item.value} title={item.label}>
        {item.label}
      </Option>
    ));
    const columns = [
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      // },
      {
        title: '信息资源代码',
        dataIndex: 'code',
      },
      {
        title: '信息资源名称',
        dataIndex: 'name',
      },
      {
        title: '资源属性分类',
        dataIndex: 'typeName',
        render: text => text.slice(text.lastIndexOf('-') + 1),
      },
      // {
      //   title: '数据类型',
      //   dataIndex: 'dataType',
      //   // render(text) {
      //   //   return text === 'db' ? '数据库' : text
      //   // },
      // },
      // {
      //   title: '所属节点',
      //   dataIndex: 'node',
      // },
      // {
      //   title: '所属机构',
      //   dataIndex: 'institution',
      // },
      // {
      //   title: '应用系统名称',
      //   dataIndex: 'applicationSystemName',
      // },
      {
        title: '发布日期',
        dataIndex: 'publishTime',
        // render(text) {
        //   return moment(text).format('lll');
        // },
      },
      {
        title: '数据已关联',
        dataIndex: 'mount',
        render: text => (text ? '是' : '否'),
      },
      {
        title: '信息项',
        dataIndex: 'infoCount',
      },
      {
        title: '订阅数',
        dataIndex: 'subCount',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        render(text) {
          //eslint-disable-line
          switch (
            +text //eslint-disable-line
          ) {
            case -1:
              return '待审核';
            case 0:
              return '已拒绝';
            case 1:
              return '已通过';
          }
        },
      },
      {
        title: '操作',
        render: (text, row) => {
          if (+row.status === -1) {
            return (
              <div>
                <span className={styles.clickBtn} onClick={that.handleEdit.bind(null, row)}>
                  修改
                </span>
                <Popconfirm
                  title={`确认删除${row.name}?`}
                  onConfirm={() => this.handleDelete(row.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            );
          }
          if (+row.status === 0) {
            return (
              <div>
                <span className={styles.clickBtn} onClick={this.handleCheckLog.bind(null, row.id)}>
                  审核日志
                </span>
                <Popconfirm
                  title={`确认删除${row.name}?`}
                  onConfirm={() => this.handleDelete(row.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              </div>
            );
          }
          return (
            <div>
              {row.ck && (
                <span className={styles.clickBtn} onClick={() => that.handleSource(row.id)}>
                  查看
                </span>
              )}
              {row.glsj && (
                <span className={styles.clickBtn} onClick={() => that.handlerelatedData(row.id)}>
                  关联数据
                </span>
              )}
              {row.gxkf && (
                <span className={styles.clickBtn} onClick={that.handleOpen.bind(null, row.id)}>
                  共享开放
                </span>
              )}
              <span className={styles.clickBtn} onClick={that.handleEdit.bind(null, row)}>
                修改
              </span>
              {row.sc && (
                <Popconfirm
                  title={`确认删除${row.name}?`}
                  onConfirm={() => this.handleDelete(row.id)}
                >
                  <a style={{ display: row.mount ? 'none' : 'inine-block' }}>删除</a>
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ];
    columns.forEach(item => {
      item.align = 'center'; // eslint-disable-line
    });
    // const list = [
    //   {
    //     id: 0,
    //     name: '城市低保标准表(各市第1季度)',
    //     dataType: 'Mysql',
    //     node: '石家庄民政部',
    //     institution: '石家庄民政部',
    //     applicationSystemName: '统计系统',
    //     createTime: 233435354,
    //     lastUpdataTime: 343435354,
    //     subscription: 2,
    //     status: '0',
    //   },
    //   {
    //     id: 1,
    //     name: '农村低保标准表(各市第1季度)',
    //     dataType: 'Mysql',
    //     node: '石家庄民政部',
    //     institution: '石家庄民政部',
    //     applicationSystemName: '统计系统',
    //     createTime: 233435354,
    //     lastUpdataTime: 343435354,
    //     subscription: 1,
    //     status: '1',
    //   },
    //   {
    //     id: 2,
    //     name: '人口普查数据',
    //     dataType: '文件',
    //     node: '石家庄民政部',
    //     institution: '石家庄民政部',
    //     applicationSystemName: '统计系统',
    //     createTime: 233435354,
    //     lastUpdataTime: 343435354,
    //     subscription: 5,
    //     status: '2',
    //   },
    // ];
    // const rowSelection = {
    // onChange: selectedRows => {
    // },
    // getCheckboxProps: record => ({
    //   disabled: record.name === 'Disabled User',
    //   name: record.name,
    // }),
    // };
    // if (!isNodeOperator) {
    //   rowSelection = null
    //   columns.splice(2,0,{
    //     title: '节点名称',
    //     dataIndex: 'nodeName',
    //     align: 'center',
    //   })
    // }
    const {
      queryData: { name, code, mount, status }, // beginTime, endTime,, typeId
      classfiyValue,
      timeValue,
    } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.form}>
            <Input
              placeholder="信息资源代码"
              style={{ width: 150, marginRight: 20 }}
              value={code}
              onChange={this.codeChange}
            />
            <Input
              placeholder="信息资源名称"
              style={{ width: 150, marginRight: 20 }}
              value={name}
              onChange={this.nameChange}
            />
            <Cascader
              options={classfiyList}
              fieldNames={{ label: 'name', value: 'id' }}
              style={{ width: 300, marginRight: 20 }}
              onChange={this.handleClassfiy}
              placeholder="资源属性分类"
              value={classfiyValue}
              changeOnSelect
            />
            {/* <Select
              style={{ marginRight: 20, width: 120 }}
              defaultValue=""
              onChange={this.dataTypeChange}
            >
              {selectData}
            </Select> */}
            <Select
              style={{ marginRight: 20, width: 120 }}
              // defaultValue="-2"
              value={status}
              // placeholder="审核状态"
              onChange={this.statusChange}
            >
              {selectData4}
            </Select>
            <RangePicker
              style={{ marginRight: 20, width: 210 }}
              onChange={this.timeChange}
              value={timeValue}
            />
            <Checkbox onChange={this.handleIsRelated} checked={mount}>
              数据已关联
            </Checkbox>
            <Button type="primary" onClick={() => this.searchHandle({})}>
              搜索
            </Button>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleReset}>
              重置
            </Button>
          </div>
          <div className={styles.createBtn}>
            <Button
              icon="plus"
              type="primary"
              onClick={this.handleAdd}
              style={{ marginRight: '20px' }}
            >
              新建
            </Button>
            <Button type="primary" onClick={this.handleInput}>
              导入
            </Button>
          </div>
          <div>
            <Table
              // loading={loading}
              columns={columns}
              dataSource={resourceList}
              pagination={
                pagination && {
                  ...pagination,
                  showQuickJumper: true,
                  showTotal: total =>
                    `共 ${Math.ceil(total / pagination.pageSize)}页 / ${total}条 数据`,
                }
              }
              rowKey="id"
              // rowSelection={rowSelection}
              bordered
              onChange={this.tableChange}
            />
          </div>
          {/* <div className={styles.allDeleteBtn}>
            <Button type="primary">删除</Button>
          </div> */}
        </Card>
      </PageHeaderLayout>
    );
  }
}
