import {
  initDataSourceManagement,
  deleteDataSourceManagement,
} from '@/services/dataSource/dataSource';
import { message } from 'antd';

export default {
  namespace: 'dataSourceManagement',

  state: {
    data: {
      datas: [],
      totalCounts: 0,
    },
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(initDataSourceManagement, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'setPage',
        payload,
      });
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteDataSourceManagement, payload.item);
      const jsonRes = JSON.parse(response);
      console.log(jsonRes);
      if (jsonRes && jsonRes.code < 300) {
        message.success(jsonRes.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      }
    },
  },

  reducers: {
    queryList(state, { payload }) {
      if (payload && payload.result) {
        return {
          ...state,
          data: {
            ...payload.result,
          },
        };
      }
      return {
        ...state,
        data: {
          ...payload,
        },
      };
    },
    setPage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
  },
};
