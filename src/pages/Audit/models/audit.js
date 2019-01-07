import { operateAudit, loginAudit } from '@/services/audit/audit';
import { message } from 'antd';

export default {
  namespace: 'audit',

  state: {
    loginDataList: {},
    page: 1,
    operationDataList: {},
    pageOperation: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(loginAudit, { ...payload });
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
    *getOperationDataList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(operateAudit, { ...payload });
        if (response.code < 300) {
          yield put({
            type: 'queryListOperation',
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
          type: 'queryListOperation',
          payload: {
            operationDataList: {},
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
    queryListOperation(state, { payload }) {
      return {
        ...state,
        operationDataList: payload,
      };
    },
    setPage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
    setPageOperation(state, { payload }) {
      return {
        ...state,
        pageOperation: payload.pageNum,
      };
    },
  },
};
