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
        let dataType = '';
        const { type, name } = response.result.data;
        const typeData = [
          {
            title: 'mysql',
            type: 'db',
          },
          {
            title: 'sqlserver',
            type: 'db',
          },
          {
            title: 'oracle',
            type: 'db',
          },
          {
            title: 'dm',
            type: 'db',
          },
          {
            title: 'kingbase',
            type: 'db',
          },
          {
            title: 'ftp',
            type: 'ftp',
          },
          {
            title: 'sftp',
            type: 'sftp',
          },
          {
            title: '本地文件上传',
            type: 'file',
          },
        ];
        typeData.map(item => {
          if (item.title === type) {
            dataType = item.type;
          }
        });
        yield put({
          type: 'updateParams',
          payload: {
            dataType: dataType,
            oldName: name,
            params: response.result.data,
          },
        });
      }
    },
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
      payload.params.alias = response.result.data;
      if (payload.sub === 'sub') {
        if (payload.oldName !== '' && payload.oldName === payload.params.name) {
          yield put({
            type: 'submit',
            payload: payload.params,
          });
        } else {
          yield put({
            type: 'testName',
            payload: payload.params,
          });
        }
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
      if (response && response.code >= 300) {
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
