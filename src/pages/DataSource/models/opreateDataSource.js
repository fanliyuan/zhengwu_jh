import { connectBase, addDataSource, updateDataSource } from '@/services/dataSource/dataSource';
import { message, notification } from 'antd';
function initParams() {
  return {
    alias: '',
    describe: '',
    ip: '',
    name: '',
    password: '',
    port: '',
    type: '',
    username: '',
  };
}
export default {
  namespace: 'opreateDataSource',

  state: {
    current: 0,
    dataType: '',
    params: initParams(),
  },

  effects: {
    *setParams({ payload }, { call, put }) {
      yield put({
        type: 'updateParams',
        payload: payload,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'resetParams',
        payload: payload,
      });
    },
    *connection({ payload, callback }, { call, put }) {
      const response = yield call(connectBase, payload);
      message.destroy();
      if (response.code < 300) {
        message.success(response.message);
        yield put({
          type: 'setAlias',
          payload: response,
        });
      } else {
        message.error(response.message);
      }
      callback(response);
    },
    *submit({ payload, callback }, { call, put }) {
      let callbackApi;
      if (payload.id) {
        callbackApi = updateDataSource;
      } else {
        callbackApi = addDataSource;
      }
      const response = yield call(callbackApi, payload); // post
      callback(response);
      if (response.code >= 300) {
        notification.error({
          message: response.message,
        });
      }
    },
  },

  reducers: {
    next(state, { payload }) {
      console.log(state);
      console.log(payload);
      return {
        ...state,
        ...payload,
      };
    },
    prev(state, { payload }) {
      return {
        ...state,
        ...payload,
        params: {
          ...initParams(),
        },
      };
    },
    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    },
    resetParams(state, { payload }) {
      return {
        ...state,
        ...payload,
        params: {
          ...initParams(),
        },
      };
    },
    setAlias(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          alias: payload.result.data,
        },
      };
    },
  },
};
