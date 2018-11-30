import { viewFileDetailCurrent, initFileListCurrent } from '@/services/dataSource/dataSource';

export default {
  namespace: 'fileView',

  state: {
    dataList: {},
    fileInfo: {},
    page: 1,
  },

  effects: {
    *getFileDetail({ payload }, { call, put }) {
      const response = yield call(viewFileDetailCurrent, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveFileInfo',
          payload: response.result.data,
        });
      }
    },
    *getFileList({ payload }, { call, put }) {
      const response = yield call(initFileListCurrent, payload);
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
    saveFileInfo(state, { payload }) {
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
