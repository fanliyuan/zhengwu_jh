import {
  userList,
  userUnfreeze,
  userFreeze,
  userDelete,
  roleList,
} from '@/services/usersManagement/usersManagement';
import { message } from 'antd';

export default {
  namespace: 'usersManagement',

  state: {
    data: {},
    roleList: [],
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(userList, payload);
      if (response.code === 200) {
        yield put({
          type: 'queryList',
          payload: response,
        });
        yield put({
          type: 'setPage',
          payload,
        });
      } else {
        message.error(response.message);
      }
    },
    *getRoles({ payload }, { call, put }) {
      const response = yield call(roleList, payload);
      if (response.code === 200) {
        yield put({
          type: 'setRoles',
          payload: response,
        });
      } else {
        message.error(response.message);
      }
    },
    *enable({ payload, callback }, { call, put }) {
      const response = yield call(userUnfreeze, payload.item);
      callback(response);
      if (response.code < 300) {
        message.success(response.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(response.message);
      }
    },
    *disabled({ payload, callback }, { call, put }) {
      const response = yield call(userFreeze, payload.item);
      callback(response);
      if (response.code < 300) {
        message.success(response.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(response.message);
      }
    },
    *deleteItem({ payload, callback }, { call, put }) {
      const response = yield call(userDelete, payload.item);
      const jsonRes = JSON.parse(response);
      callback(jsonRes);
      if (jsonRes && jsonRes.code < 300) {
        message.success(jsonRes.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(jsonRes.message);
      }
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        data: payload.result,
      };
    },
    setRoles(state, { payload }) {
      return {
        ...state,
        roleList: payload.result.datas,
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
