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
      const response = yield call(roleList);
      if (response.code === 200) {
        yield put({
          type: 'setRoles',
          payload: response,
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
