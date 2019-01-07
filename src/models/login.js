import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, loginOut } from '@/services/login/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentAuthority: 'guest',
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response && response.code === 200) {
        localStorage.setItem('currentUser', JSON.stringify(response.result.data));
        yield put({
          type: 'saveCurrentUser',
          payload: response.result.data,
        });
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/dashboard/analysis'));
      } else {
        message.error(response.message);
      }
    },

    // *getCaptcha({ payload }, { call }) {
    //   yield call(getFakeCaptcha, payload);
    // },

    *logout(_, { call, put }) {
      yield call(loginOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            // redirect: window.location.href,
          }),
        })
      );
      localStorage.setItem('currentUser', '');
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      let auth;
      if (payload.result && payload.result !== '') {
        auth = payload.result.data.roleEnNames[0];
      } else {
        auth = payload.currentAuthority;
      }
      setAuthority(auth);
      return {
        ...state,
        // status: auth,
        // type: payload.type,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
