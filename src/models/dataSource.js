import { initDataSource, deleteDataSource } from '@/services/dataSource/dataSource';
import { message, notification } from 'antd';

export default {
  namespace: 'dataSource',

  state: {
    data: {
      datas: [],
      totalCounts: 0,
    },
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(initDataSource, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
      yield put({
        type: 'setPage',
        payload: payload,
      });
    },
    *deleteItem({ payload }, { call, put }) {
      const response = yield call(deleteDataSource, payload.item);
      let jsonRes = JSON.parse(response);
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
      } else {
        return {
          ...state,
          data: {
            ...payload,
          },
        };
      }
    },
    setPage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
  },
};
