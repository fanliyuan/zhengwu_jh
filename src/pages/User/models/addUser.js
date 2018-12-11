import { routerRedux } from 'dva/router';
import { userDetail, userAdd, userEdit } from '@/services/usersManagement/usersManagement';
import { message } from 'antd';

function initAddParams() {
  return {
    account: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    status: 1,
  };
}

function initUpdateParams() {
  return {
    account: '',
    name: '',
    phone: '',
    email: '',
    status: '',
  };
}

export default {
  namespace: 'addUser',

  state: {
    params: {},
  },

  effects: {
    *detail({ payload }, { call, put }) {
      let params = {};
      if (payload.routeName === 'usersUpdate') {
        params = initUpdateParams();
        yield put({
          type: 'setParams',
          payload: params,
        });
        const response = yield call(userDetail, { userId: payload.userId });
        if (response.code < 300) {
          yield put({
            type: 'updateParams',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
      } else {
        params = initAddParams();
        yield put({
          type: 'setParams',
          payload: params,
        });
      }
    },
    *submit({ payload }, { call, put }) {
      let callbackApi;
      if (payload.routeName === 'usersUpdate') {
        callbackApi = userEdit;
      } else {
        callbackApi = userAdd;
      }
      const response = yield call(callbackApi, payload.params);
      if (response.code < 300) {
        message.success(response.message);
        yield put(routerRedux.replace('/users/usersManagement'));
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    setParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...payload,
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
  },
};
