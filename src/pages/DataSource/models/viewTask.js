import {
  viewDbDetailCurrent,
  viewFtpDetailCurrent,
  getSyncBasic,
  viewRunlog,
  viewSynclog,
} from '@/services/dataSource/dataSource';

export default {
  namescpace: 'viewTask',

  state: {
    runLogList: {},
    syncLogList: {},
    basicInfo: {},
    syncInfo: {},
    pageRun: 1,
    pageSync: 1,
  },

  effects: {
    *getDetail({ payload }, { call, put }) {
      const { dataType } = payload;
      let callbackApi;
      if (dataType === 'db') {
        callbackApi = viewDbDetailCurrent;
      } else {
        callbackApi = viewFtpDetailCurrent;
      }
      const response = yield call(callbackApi, payload.id);
      if (response && response.code < 300) {
        yield put({
          type: 'saveBasicInfo',
          payload: response.result.data,
        });
      }
    },
    *getSyncInfo({ payload }, { call, put }) {
      const response = yield call(getSyncBasic, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveSyncInfo',
          payload: response.result.data,
        });
      }
    },
    *getRunlog({ payload }, { call, put }) {
      const response = yield call(viewRunlog, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveRunlog',
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
    *getSynclog({ payload }, { call, put }) {
      const response = yield call(viewSynclog, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveSynclog',
          payload: response.result,
        });
        if (payload.page) {
          yield put({
            type: 'saveSyncPage',
            payload: payload.page,
          });
        }
      }
    },
  },

  reducers: {
    saveBasicInfo(state, { payload }) {
      return {
        ...state,
        basicInfo: payload,
      };
    },
    saveSyncInfo(state, { payload }) {
      return {
        ...state,
        syncInfo: payload,
      };
    },
    saveRunlog(state, { payload }) {
      return {
        ...state,
        runLogList: payload,
      };
    },
    saveSynclog(state, { payload }) {
      return {
        ...state,
        syncLogList: payload,
      };
    },
    savePage(state, { payload }) {
      return {
        ...state,
        pageRun: payload,
      };
    },
    saveSyncPage(state, { payload }) {
      return {
        ...state,
        pageSync: payload,
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
