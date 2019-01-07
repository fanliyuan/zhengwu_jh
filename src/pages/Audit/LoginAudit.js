/*
 * @Author: ChouEric
 * @Date: 2018-12-25 11:29:02
 * @Last Modified by: ChouEric
 * @Last Modified time: 2018-12-25 15:03:56
 * @Description: 描述 登录审计
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

@connect(({ audit, loading }) => ({
  audit,
  loading: loading.effects['audit/fetch'],
}))
export default class LoginAudit extends PureComponent {
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
      dataIndex: 'createtime',
      title: '登录时间',
    },
    {
      dataIndex: 'ip',
      title: ' 登录IP',
    },
    {
      dataIndex: 'message',
      title: '登录结果',
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
      type: 'audit/fetch',
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
  @Throttle(800, { trailing: false })
  handleSearch = (fieldsForm, paramsTime) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum: 1, pageSize: 10 };
    formValues = { ...fieldsForm };
    const fields = fieldsForm;
    Object.defineProperty(fields, 'date', {
      value: ``,
    });
    formTime = paramsTime;
    const values = {
      ...fields,
      ...paramsPage,
      ...paramsTime,
    };
    dispatch({
      type: 'audit/fetch',
      payload: values,
    });
  };

  changePage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    paramsPage = { pageNum, pageSize };
    dispatch({
      type: 'audit/fetch',
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
            {
              type: 'Select',
              prop: 'result',
              label: '结果',
              typeOptions: {
                placeholder: '请选择结果',
              },
              options: [
                {
                  key: '全部',
                  value: '',
                },
                {
                  key: '登录成功',
                  value: '登录成功',
                },
                {
                  key: '登录失败',
                  value: '登录失败',
                },
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
      audit: { loginDataList, page },
      loading,
    } = this.props;
    const paginationProps = {
      showQuickJumper: true,
      total: loginDataList.totalCounts,
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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey="id"
              bordered
              columns={this.columns}
              dataSource={loginDataList.datas}
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
