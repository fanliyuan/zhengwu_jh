import {
  connectBase,
  addDataSource,
  updateDataSource,
  isSameNameSource,
} from '@/services/dataSource/dataSource';
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
    *connection({ payload }, { call, put }) {
      const response = yield call(connectBase, {
        type: payload.params.type,
        addr: payload.params.ip,
        port: payload.params.port,
        username: payload.params.username,
        password: payload.params.password,
      });
      message.destroy();
      if (response.code >= 300) {
        return message.error(response.message);
      }
      message.success(response.message);
      yield put({
        type: 'setAlias',
        payload: response,
      });
      if (payload.sub === 'sub') {
        yield put({
          type: 'testName',
          payload: payload.params,
        });
      }
    },
    *submit({ payload }, { call, put }) {
      let callbackApi;
      if (payload.id) {
        callbackApi = updateDataSource;
      } else {
        callbackApi = addDataSource;
      }
      const response = yield call(callbackApi, payload);
      if (response.code >= 300) {
        return notification.error({
          message: response.message,
        });
      }
      yield put({
        type: 'next',
      });
    },
    *testName({ payload }, { call, put }) {
      const response = yield call(isSameNameSource, { name: payload.name });
      if (response && response.result.data) {
        return notification.error({
          message: '数据源名称重复！',
        });
      }
      yield put({
        type: 'submit',
        payload: payload,
      });
    },
  },

  reducers: {
    next(state) {
      return {
        ...state,
        current: state.current + 1,
      };
    },
    prev(state) {
      return {
        ...state,
        current: state.current - 1,
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
