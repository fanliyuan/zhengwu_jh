import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Divider } from 'antd';

import styles from './ViewDirectory.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCard from '@/components/ViewCard';
import FilterRowForm from '@/components/FilterRowForm';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;

@connect(({ viewDirectory, loading }) => ({
  viewDirectory,
  loading: loading.effects['viewDirectory/fetch'],
  loadingDetail: loading.effects['viewDirectory/getSourceDetail'],
}))
class ViewDirectory extends Component {
  columns = [
    {
      title: '信息项名称',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      align: 'center',
      dataIndex: 'dataType',
    },
    {
      title: '数据长度',
      align: 'center',
      dataIndex: 'dataLength',
    },
    {
      title: '共享类型',
      align: 'center',
      dataIndex: 'shareType',
    },
    {
      title: '共享条件',
      align: 'center',
      dataIndex: 'shareCondition',
    },
    {
      title: '共享方式',
      align: 'center',
      dataIndex: 'shareMode',
    },
    {
      title: '是否向社会开放',
      align: 'center',
      dataIndex: 'openType',
    },
    {
      title: '开放条件',
      align: 'center',
      dataIndex: 'openCondition',
    },
  ];

  componentDidMount() {
    const { dispatch, match } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    formValues = {};
    dispatch({
      type: 'viewDirectory/fetch',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
          ...formValues,
        },
      },
    });
    dispatch({
      type: 'viewDirectory/getSourceDetail',
      payload: {
        id: match.params.id,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'viewDirectory/reset',
    });
  }

  handleSearch = fieldsForm => {
    const { dispatch, match } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    formValues = { ...fieldsForm };
    dispatch({
      type: 'viewDirectory/fetch',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
          ...fieldsForm,
        },
      },
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch, match } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'viewDirectory/fetch',
      payload: {
        id: match.params.id,
        query: {
          ...paramsPage,
          ...formValues,
        },
      },
    });
  };

  back() {
    const { history } = this.props;
    history.goBack();
  }

  renderViewCard() {
    const {
      viewDirectory: { detail },
    } = this.props;
    const viewData = {
      title: '核心元数据',
      col: 3,
      data: [
        {
          key: '信息资源代码',
          value: detail.code,
        },
        {
          key: '信息资源名称',
          value: detail.name,
        },
        {
          key: '信息资源属性分类',
          value: detail.typeName,
        },
        {
          key: '信息资源提供方',
          value: detail.providerName,
        },
        {
          key: '提供方代码',
          value: detail.providerNo,
        },
        {
          key: '提供方内部部门',
          value: detail.providerDept,
        },
        {
          key: '更新周期',
          value: detail.updateCycle,
        },
        {
          key: '发布日期',
          value: detail.publishTime,
        },
        {
          key: '共享日期',
          value: detail.shareTime,
        },
        {
          key: '信息资源格式',
          value: detail.format,
        },
        {
          key: '关联资源代码',
          value: detail.relateCode,
        },
        {
          key: '信息项',
          value: detail.infoCount,
        },
        {
          key: '信息资源摘要',
          value: detail.summary,
          fullWidth: true,
          lines: 3,
        },
      ],
    };
    return <ViewCard data={viewData} />;
  }

  renderForm() {
    const formData = {
      md: 8,
      lg: 24,
      xl: 48,
      data: [
        {
          key: 1,
          data: [
            {
              prop: 'name',
              label: '信息项名称',
              typeOptions: {
                placeholder: '请输入信息项名称',
                maxLength: 50,
              },
            },
            {
              type: 'Select',
              prop: 'dataType',
              label: '数据类型',
              typeOptions: {
                placeholder: '请选择数据类型',
              },
              options: [
                { key: '全部', value: '' },
                { key: '字符型C', value: '字符型C' },
                { key: '数值型N', value: '数值型N' },
                { key: '货币型Y', value: '货币型Y' },
                { key: '日期型D', value: '日期型D' },
                { key: '日期时间型T', value: '日期时间型T' },
                { key: '逻辑型L', value: '逻辑型L' },
                { key: '备注型M', value: '备注型M' },
                { key: '通用型G', value: '通用型G' },
                { key: '双精度型B', value: '双精度型B' },
                { key: '整型I', value: '整型I' },
                { key: '浮点型F', value: '浮点型F' },
                { key: '自定义', value: '自定义' },
              ],
            },
            {
              type: 'Select',
              prop: 'shareType',
              label: '共享类型',
              typeOptions: {
                placeholder: '请选择共享类型',
              },
              options: [
                { key: '全部', value: '' },
                { key: '有条件共享', value: '有条件共享' },
                { key: '无条件共享', value: '无条件共享' },
                { key: '不予共享', value: '不予共享' },
              ],
            },
          ],
        },
      ],
    };
    const actions = {
      handleSearch: this.handleSearch,
    };
    const data = {
      ...formValues,
    };
    return <FilterRowForm formData={formData} actions={actions} data={data} />;
  }

  render() {
    const {
      viewDirectory: { dataList, detail, page },
      loadingDetail,
      loading,
    } = this.props;
    const keyArr = Object.keys(detail);
    const buttonList = (
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Button type="primary" onClick={() => this.back()}>
          返回
        </Button>
      </div>
    );
    const paginationProps = {
      showQuickJumper: true,
      total: dataList.totalCounts,
      current: page,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的数据源',
    };
    return (
      <PageHeaderWrapper action={buttonList}>
        <Card loading={loadingDetail} bordered={false}>
          {keyArr.length > 0 && this.renderViewCard()}
          <Divider style={{ marginBottom: 32, marginTop: 0 }} />
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey="id"
              bordered
              columns={this.columns}
              dataSource={dataList.datas}
              pagination={paginationProps}
              locale={locale}
              loading={loading}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ViewDirectory;
