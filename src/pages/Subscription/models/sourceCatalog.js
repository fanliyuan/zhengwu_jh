import { getResourceList, getAllNode } from '@/services/subscription/index';
import { getSourceClassfiyList } from '@/services/informationResource/informationResource';

export default {
  namespace: 'sourceCatalog',

  state: {
    dataList: {},
    sourceClassfiyList: [],
    pubNodes: [],
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getResourceList, payload);
      if (response.code === 0) {
        yield put({
          type: 'queryList',
          payload: response.result,
        });
        yield put({
          type: 'setPage',
          payload,
        });
      }
    },
    *getSourceClassfiyList({ payload }, { call, put }) {
      const response = yield call(getSourceClassfiyList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveSourceClassfiyList',
          payload: response.result,
        });
      }
    },
    *getNodes({ payload }, { call, put }) {
      const response = yield call(getAllNode, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveNodes',
          payload: response.result,
        });
      }
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    saveSourceClassfiyList(state, { payload }) {
      return {
        ...state,
        sourceClassfiyList: payload,
      };
    },
    saveNodes(state, { payload }) {
      return {
        ...state,
        pubNodes: payload,
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
