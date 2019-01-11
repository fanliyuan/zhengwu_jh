import {
  getResourceDetail,
  getInfoItems,
} from '@/services/informationResource/informationResource';

export default {
  namespace: 'viewDirectory',

  state: {
    dataList: {},
    detail: {},
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getInfoItems, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDataList',
          payload: response.result,
        });
        if (payload.page) {
          yield put({
            type: 'savePage',
            payload: payload,
          });
        }
      }
    },
    *getSourceDetail({ payload }, { call, put }) {
      const response = yield call(getResourceDetail, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDetail',
          payload: response.result.data,
        });
      }
    },
  },

  reducers: {
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    savePage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
    reset(state) {
      return {
        ...state,
        dataList: {},
        detail: {},
        page: 1,
      };
    },
  },
};
