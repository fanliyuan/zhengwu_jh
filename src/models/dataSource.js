import { initDataSource } from '@/services/dataSource/dataSource';

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
