import { initDataSource, deleteDataSource } from '@/services/dataSource/dataSource';
import { message } from 'antd';

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
        payload,
      });
    },
    *deleteItem({ payload, callback }, { call, put }) {
      const response = yield call(deleteDataSource, payload.item);
      const jsonRes = JSON.parse(response);
      callback(jsonRes);
      if (jsonRes && jsonRes.code < 300) {
        message.success(jsonRes.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(jsonRes.message);
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
