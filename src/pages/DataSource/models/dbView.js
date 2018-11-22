import {
  viewDbDetailCurrent,
  viewDbDataList,
  viewDbStructCurrent,
} from '@/services/dataSource/dataSource';

export default {
  namescpace: 'dbView',

  state: {
    tableList: [],
    dataList: {},
    tableStruct: [],
    dbInfo: {},
    page: 1,
  },

  effects: {
    *getDbDetail({ payload }, { call, put }) {
      const response = yield call(viewDbDetailCurrent, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveTableInfo',
          payload: response.result.data,
        });
      }
    },
    *getDBTableStruct({ payload }, { call, put }) {
      const response = yield call(viewDbStructCurrent, payload.id);
      if (response && response.code < 300) {
        yield put({
          type: 'saveTabelStruct',
          payload: response.result.datas,
        });
      }
    },
    *getDbTableList({ payload }, { call, put }) {
      const response = yield call(viewDbDataList, payload);
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
    saveTableInfo(state, { payload }) {
      return {
        ...state,
        tableList: [payload],
        dbInfo: payload,
      };
    },
    saveTabelStruct(state, { payload }) {
      return {
        ...state,
        tableStruct: payload,
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
