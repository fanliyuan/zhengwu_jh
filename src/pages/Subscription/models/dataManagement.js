import { managementList, getAllNode } from '@/services/subscription';
import { getSourceClassfiyList } from '@/services/informationResource/informationResource';

import { message } from 'antd';

export default {
  namespace: 'dataManagement',

  state: {
    dbList: {},
    fileList: {},
    sourceClassfiyList: [],
    pubNodes: [],
    pageDb: 1,
    pageFile: 1,
  },

  effects: {
    *getDBList({ payload }, { call, put }) {
      const response = yield call(managementList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDbList',
          payload: response.result,
        });
        yield put({
          type: 'setPage',
          payload,
        });
      }
    },
    *getFileList({ payload }, { call, put }) {
      const response = yield call(managementList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveFileList',
          payload: response.result,
        });
        yield put({
          type: 'setPageFile',
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
      } else {
        message.error(response.message);
      }
    },
    *getNodes({ payload }, { call, put }) {
      const response = yield call(getAllNode, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveNodes',
          payload: response.result,
        });
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    saveDbList(state, { payload }) {
      return {
        ...state,
        dbList: payload,
      };
    },
    saveFileList(state, { payload }) {
      return {
        ...state,
        fileList: payload,
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
        pageDb: payload.pageNum,
      };
    },
    setPageFile(state, { payload }) {
      return {
        ...state,
        pageFile: payload.pageNum,
      };
    },
  },
};
