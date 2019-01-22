import React, { Component, Fragment } from 'react';
import { Tabs, Table, Divider, Card } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';
import styles from './DataManagement.less';

const { TabPane } = Tabs;
let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;
let paramsPageFile = { pageNum: 1, pageSize: 10 };
let formValuesFile;
let formTimeFile;

@connect(({ dataManagement, loading }) => ({
  dataManagement,
  loadingDb: loading.effects['dbView/getDBList'],
  loadingFile: loading.effects['dbView/getFileList'],
}))
class DataManagement extends Component {
  columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text, record, index) => {
        const { dataManagement } = this.props;
        return `${index + 1 + (dataManagement.pageDb - 1) * 10}`;
      },
    },
    {
      title: '订阅名称',
      align: 'center',
      dataIndex: 'subscribeName',
    },
    {
      title: '信息资源名称',
      align: 'center',
      dataIndex: 'dsName',
    },
    {
      title: '数据条数',
      align: 'center',
      dataIndex: 'dataNum',
    },
    {
      title: '资源属性分类',
      align: 'center',
      dataIndex: 'directoryName',
    },
    {
      title: '发布节点',
      align: 'center',
      dataIndex: 'publishNode',
    },
    {
      title: '最近更新时间',
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() =>
              router.push(
                `/subscribe/dataManagement/subInfoResource/${record.resourceId}/${
                  record.mountResourceId
                }`
              )
            }
          >
            信息资源
          </a>
          <Divider type="vertical" />
          {record.dataType === 0 && (
            <a
              onClick={() =>
                router.push(
                  `/subscribe/dataManagement/subDetailDataBase/${record.id}/${
                    record.mountResourceId
                  }/${record.tableName}`
                )
              }
            >
              数据
            </a>
          )}
          {record.dataType === 1 && (
            <a onClick={() => router.push(`/subscribe/dataManagement/subDetailFile/${record.id}`)}>
              文件
            </a>
          )}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    let fields;
    let fieldsFile;
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = {};
      formTime = {};
      paramsPageFile = { pageNum: 1, pageSize: 10 };
      formValuesFile = {};
      formTimeFile = {};
      fields = { ...formValues };
      fieldsFile = { ...formValuesFile };
    } else {
      fields = { ...formValues };
      fieldsFile = { ...formValuesFile };
      Object.defineProperty(fields, 'date', {
        value: ``,
      });
      Object.defineProperty(fieldsFile, 'date', {
        value: ``,
      });
    }
    dispatch({
      type: 'dataManagement/getNodes',
    });
    dispatch({
      type: 'dataManagement/getSourceClassfiyList',
    });
    dispatch({
      type: 'dataManagement/getDBList',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
        dataType: 0,
      },
    });
    dispatch({
      type: 'dataManagement/getFileList',
      payload: {
        ...paramsPageFile,
        ...fieldsFile,
        ...formTimeFile,
        dataType: 1,
      },
    });
  }

  componentWillUnmount() {
    const { route } = this.props;
    sessionStorage.setItem('currentList', route.name);
  }

  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    const fields = fieldsForm;
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.catalogId) {
      Object.defineProperty(fields, 'catalogId', {
        value: fields.catalogId[3],
        enumerable: true,
      });
    }
    formValues = { ...fieldsForm };
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
      dataType: 0,
    };
    dispatch({
      type: 'dataManagement/getDBList',
      payload: values,
    });
  };

  handleSearchFile = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPageFile = { pageNum: 1, pageSize: 10 };
    const fields = fieldsForm;
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.catalogId) {
      Object.defineProperty(fields, 'catalogId', {
        value: fields.catalogId[3],
        enumerable: true,
      });
    }
    formValuesFile = { ...fieldsForm };
    formTimeFile = paramsTime;
    const values = {
      ...fields,
      ...paramsPageFile,
      ...paramsTime,
      dataType: 1,
    };
    dispatch({
      type: 'dataManagement/getFileList',
      payload: values,
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'dataManagement/getDBList',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
        dataType: 0,
      },
    });
  };

  changePageFile = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPageFile = { pageNum, pageSize };
    dispatch({
      type: 'dataManagement/getFileList',
      payload: {
        ...paramsPageFile,
        ...formValuesFile,
        ...formTimeFile,
        dataType: 1,
      },
    });
  };

  renderForm(type) {
    let actions;
    let data;
    const {
      dataManagement: { sourceClassfiyList, pubNodes },
    } = this.props;
    const nodes = [
      {
        key: '全部',
        value: '',
      },
    ];
    pubNodes.map(item =>
      nodes.push({
        key: item.nodeName,
        value: item.nodeName,
      })
    );
    const formData = {
      md: 8,
      lg: 24,
      xl: 48,
      data: [
        {
          key: 1,
          data: [
            {
              prop: 'subscribeName',
              label: '订阅名称',
              typeOptions: {
                placeholder: '请输入订阅名称',
                maxLength: 50,
              },
            },
            {
              prop: 'dsName',
              label: '信息资源名称',
              typeOptions: {
                placeholder: '请输入信息资源名称',
                maxLength: 50,
              },
            },
            {
              type: 'Cascader',
              prop: 'catalogId',
              label: '资源属性分类',
              typeOptions: {
                options: sourceClassfiyList,
                fieldNames: { label: 'name', value: 'id' },
                placeholder: '请选择资源属性分类',
              },
            },
          ],
        },
        {
          key: 2,
          data: [
            {
              type: 'Select',
              prop: 'publishNode',
              label: '发布节点',
              typeOptions: {
                placeholder: '请选择发布节点',
              },
              options: nodes,
            },
            {
              type: 'RangePicker',
              prop: 'date',
              label: '最近更新时间',
            },
          ],
        },
      ],
    };
    if (type === 'db') {
      actions = {
        handleSearch: this.handleSearch,
      };
      data = {
        ...formValues,
      };
    } else {
      actions = {
        handleSearch: this.handleSearchFile,
      };
      data = {
        ...formValuesFile,
      };
    }
    return <FilterRowForm formData={formData} actions={actions} data={data} />;
  }

  render() {
    const {
      dataManagement: { dbList, fileList, pageDb, pageFile },
      loadingDb,
      loadingFile,
    } = this.props;
    const paginationProps = {
      showQuickJumper: true,
      total: dbList.totalCounts,
      current: pageDb,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const paginationPropsFile = {
      showQuickJumper: true,
      total: fileList.totalCounts,
      current: pageFile,
      onChange: this.changePageFile,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的文件',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="数据库" key="1">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm('db')}</div>
                <Table
                  rowKey="id"
                  bordered
                  pagination={paginationProps}
                  dataSource={dbList.datas}
                  columns={this.columns}
                  loading={loadingDb}
                  locale={locale}
                />
              </div>
            </TabPane>
            <TabPane tab="文件" key="2">
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderForm('file')}</div>
                <Table
                  rowKey="id"
                  bordered
                  pagination={paginationPropsFile}
                  dataSource={fileList.datas}
                  columns={this.columns}
                  loading={loadingFile}
                  locale={locale}
                />
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DataManagement;
