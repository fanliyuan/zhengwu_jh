import { getResourceList, getAllNode, subscribe } from '@/services/subscription/index';
import { getSourceClassfiyList } from '@/services/informationResource/informationResource';

import { message } from 'antd';

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
    *subscribe({ payload, callback }, { call, put }) {
      const response = yield call(subscribe, payload.item);
      callback(response);
      if (response && response.code < 300 && response.code >= 0) {
        message.success(response.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(response.message);
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
