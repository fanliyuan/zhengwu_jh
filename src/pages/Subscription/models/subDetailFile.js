import { ftpFiles } from '@/services/subscription/index';

export default {
  namespace: 'subDetailFile',

  state: {
    dataList: {},
    fileInfo: {},
    page: 1,
  },

  effects: {
    *getFileDetail({ payload }, { call, put }) {
      const response = yield call(ftpFiles, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveTableInfo',
          payload: response.result.value,
        });
      }
    },
    *getDataList({ payload }, { call, put }) {
      const response = yield call(ftpFiles, payload);
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
    saveInfo(state, { payload }) {
      return {
        ...state,
        dbInfo: payload,
        tableList: {
          datas: [
            {
              ...state.tableList.datas[0],
              comment: payload.tableNote,
            },
          ],
        },
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
