/*
 * @Author: ChouEric
 * @Date: 2018-12-25 11:29:13
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-25 14:49:24
 * @Description: 描述 操作审计
 */
import React, { PureComponent } from 'react';
import { Table, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Bind, Throttle } from 'lodash-decorators';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import FilterRowForm from '@/components/FilterRowForm';

import styles from './Audit.less';

let paramsPage = { pageNum: 1, pageSize: 10 };
let formValues;
let formTime;

const xj = {
  label: '新建',
  value: '新建',
};
const xg = {
  label: '修改',
  value: '修改',
};
const sc = {
  label: '删除',
  value: '删除',
};
const menus = [
  {
    label: '机构用户管理',
    value: '机构用户管理',
    children: [xj, xg, sc],
  },
  {
    label: '政务信息资源目录',
    value: '政务信息资源目录',
    children: [
      xj,
      xg,
      sc,
      { label: '关联数据', value: '关联数据' },
      { label: '共享开放', value: '共享开放' },
      { label: '资源审核', value: '资源审核' },
    ],
  },
  {
    label: '数据发布管理',
    value: '数据发布管理',
    children: [
      xj,
      xg,
      sc,
      { label: '接入数据', value: '接入数据' },
      { label: '数据审核', value: '数据审核' },
    ],
  },
  {
    label: '数据订阅管理',
    value: '数据订阅管理',
    children: [xj, xg, sc],
  },
  {
    label: '监控告警',
    value: '监控告警',
    children: [xg],
  },
];

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/getOperationDataList'],
}))
export default class OperationAudit extends PureComponent {
  columns = [
    {
      dataIndex: 'useraccount',
      title: '用户名',
    },
    {
      dataIndex: 'username',
      title: '姓名',
    },
    {
      dataIndex: 'logtype',
      title: '所属模块',
    },
    {
      dataIndex: 'logname',
      title: '操作类型',
    },
    {
      dataIndex: 'createtime',
      title: '操作时间',
    },
    {
      dataIndex: 'logip',
      title: '操作IP',
    },
    {
      dataIndex: 'message',
      title: '行为记录',
    },
  ];

  componentDidMount() {
    let fields;
    const routeName = sessionStorage.getItem('currentList');
    const { dispatch, route } = this.props;
    if (routeName && routeName !== route.name) {
      paramsPage = { pageNum: 1, pageSize: 10 };
      formValues = {};
      formTime = {};
      fields = { ...formValues };
    } else {
      fields = { ...formValues };
      Object.defineProperty(fields, 'date', {
        value: ``,
      });
    }
    dispatch({
      type: 'audit/getOperationDataList',
      payload: {
        ...paramsPage,
        ...fields,
        ...formTime,
      },
    });
  }

  componentWillUnmount() {
    const { route } = this.props;
    sessionStorage.setItem('currentList', route.name);
  }

  @Bind()
  @Throttle(800, { trailing: true })
  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    formValues = { ...fieldsForm };
    const fields = fieldsForm;
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    if (fields.logOps) {
      const typeArr = ['logtype', 'logname'];
      fields.logOps.map((item, index) =>
        Object.defineProperty(fields, typeArr[index], {
          value: item,
          enumerable: true,
        })
      );
      Object.defineProperty(fields, 'logOps', {
        value: ``,
      });
    }
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
    };
    dispatch({
      type: 'audit/getOperationDataList',
      payload: values,
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'audit/getOperationDataList',
      payload: {
        ...paramsPage,
        ...formValues,
        ...formTime,
      },
    });
  };

  renderForm() {
    const formData = {
      md: 6,
      lg: 24,
      xl: 48,
      data: [
        {
          key: 1,
          data: [
            {
              prop: 'useraccount',
              label: '用户名',
              typeOptions: {
                placeholder: '请输入用户名',
                maxLength: 50,
              },
            },
            {
              type: 'Cascader',
              prop: 'logOps',
              label: '所属模块和操作类型',
              typeOptions: {
                options: menus,
                placeholder: '请输入所属模块和操作类型',
                changeOnSelect: true,
              },
            },
            {
              prop: 'ip',
              label: 'IP地址',
              typeOptions: {
                placeholder: '请输入IP地址',
                maxLength: 50,
                rules: [
                  {
                    pattern: /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/g,
                    message: formatMessage({ id: 'validation.ip.pattern' }),
                  },
                ],
              },
            },
            {
              type: 'RangePicker',
              prop: 'date',
              label: '操作时间',
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
      audit: { operationDataList, pageOperation },
      loading,
    } = this.props;
    const paginationProps = {
      showQuickJumper: true,
      total: operationDataList.totalCounts,
      current: pageOperation,
      onChange: this.changePage,
      pageSize: 10,
      showTotal(total) {
        return `共${Math.ceil(total / 10)}页 / ${total}条数据`;
      },
    };
    const locale = {
      emptyText: '很遗憾，没有搜索到匹配的操作日志',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey="id"
              bordered
              columns={this.columns}
              dataSource={operationDataList.datas}
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
