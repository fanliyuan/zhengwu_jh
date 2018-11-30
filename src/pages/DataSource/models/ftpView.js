import { viewFtpDetailCurrent, initFtpListCurrent } from '@/services/dataSource/dataSource';

export default {
  namespace: 'ftpView',

  state: {
    dataList: {},
    fileInfo: {},
    page: 1,
  },

  effects: {
    *getFtpDetail({ payload }, { call, put }) {
      const response = yield call(viewFtpDetailCurrent, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveFtpInfo',
          payload: response.result.data,
        });
      }
    },
    *getFtpList({ payload }, { call, put }) {
      const response = yield call(initFtpListCurrent, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDataList',
          payload: response.result,
        });
        if (payload.page) {
          yield put({
            type: 'savePage',
            payload: payload.page,
          });
        }
      }
    },
  },

  reducers: {
    saveFtpInfo(state, { payload }) {
      return {
        ...state,
        fileInfo: payload,
      };
    },
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    savePage(state, { payload }) {
      return {
        ...state,
        page: payload,
      };
    },
    reset(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
