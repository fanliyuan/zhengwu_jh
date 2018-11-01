import { initDataSource } from '@/services/dataSource/dataSource';

export default {
  namespace: 'dataSource',

  state: {
    data: {
      datas: [],
      totalCounts: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(initDataSource, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      console.log(payload);
      return {
        ...state,
        data: {
          datas: payload.result.datas,
          totalCounts: payload.result.totalCounts,
        },
      };
    },
  },
};
