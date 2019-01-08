import { loginLog } from '@/services/audit/audit';

export default {
  namespace: 'loginLog',

  state: {
    loginDataList: {},
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(loginLog, { ...payload });
        if (response.code < 300) {
          yield put({
            type: 'queryList',
            payload: response.result,
          });
          yield put({
            type: 'setPage',
            payload,
          });
        }
      } catch (error) {
        console.log(error);
        yield put({
          type: 'queryList',
          payload: {
            dataList: [],
          },
        });
      }
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        loginDataList: payload,
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
