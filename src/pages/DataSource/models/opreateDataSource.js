import {
  connectBase,
  addDataSource,
  updateDataSource,
  isSameNameSource,
  viewDataSource,
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
    oldName: '',
    params: initParams(),
  },

  effects: {
    *detail({ payload }, { call, put }) {
      const response = yield call(viewDataSource, payload);
      if (response.code < 300) {
        const { type, name } = response.result.data;
        const typeData = {
          mysql: 'db',
          sqlserver: 'db',
          oracle: 'db',
          dm: 'db',
          kingbase: 'db',
          ftp: 'ftp',
          sftp: 'ftp',
          本地文件上传: 'file',
        };
        const dataType = typeData[type];
        yield put({
          type: 'updateParams',
          payload: {
            dataType,
            oldName: name,
            params: response.result.data,
          },
        });
      }
    },
    *setParams({ payload }, { put }) {
      yield put({
        type: 'updateParams',
        payload,
      });
    },
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetParams',
        payload,
      });
    },
    *connection({ payload }, { call, put }) {
      const payloads = payload;
      const response = yield call(connectBase, {
        type: payloads.params.type,
        addr: payloads.params.ip,
        port: payloads.params.port,
        username: payloads.params.username,
        password: payloads.params.password,
      });
      message.destroy();
      if (response.code >= 300) {
        return message.error(response.message);
      }
      payloads.params.alias = response.result.data;
      if (payloads.sub === 'sub') {
        if (payloads.oldName !== '' && payloads.oldName === payloads.params.name) {
          yield put({
            type: 'submit',
            payload: payloads.params,
          });
        } else {
          yield put({
            type: 'testName',
            payload: payloads.params,
          });
        }
      }
      return message.success(response.message);
    },
    *submit({ payload }, { call, put }) {
      let callbackApi;
      if (payload.id) {
        callbackApi = updateDataSource;
      } else {
        callbackApi = addDataSource;
      }
      const response = yield call(callbackApi, payload);
      if (response && response.code >= 300) {
        return notification.error({
          message: response.message,
        });
      }
      return yield put({
        type: 'next',
      });
    },
    *testName({ payload }, { call, put }) {
      if (payload.subType === 'file') {
        if (payload.oldName !== '' && payload.oldName === payload.params.name) {
          yield put({
            type: 'submit',
            payload: payload.params,
          });
        } else {
          const response = yield call(isSameNameSource, { name: payload.params.name });
          if (response && response.result.data) {
            return notification.error({
              message: '数据源名称重复！',
            });
          }
          yield put({
            type: 'submit',
            payload: payload.params,
          });
        }
      } else {
        const response = yield call(isSameNameSource, { name: payload.name });
        if (response && response.result.data) {
          return notification.error({
            message: '数据源名称重复！',
          });
        }
        yield put({
          type: 'submit',
          payload,
        });
      }
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
        dataType: payload.dataType,
        oldName: payload.oldName,
        params: {
          ...state.params,
          ...payload.params,
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
  },
};
