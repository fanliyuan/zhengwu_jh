import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin } from '@/services/login/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    currentAuthority: 'guest',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 200) {
        reloadAuthorized();
        //const urlParams = new URL(window.location.href);
        //const params = getPageQuery();
        //let { redirect } = params;
        //if (redirect) {
        //  const redirectUrlParams = new URL(redirect);
        //  if (redirectUrlParams.origin === urlParams.origin) {
        //    redirect = redirect.substr(urlParams.origin.length);
        //    if (redirect.startsWith('/#')) {
        //      redirect = redirect.substr(2);
        //    }
        //  } else {
        //    window.location.href = redirect;
        //    return;
        //  }
        //}
        yield put(routerRedux.replace('/dashboard/analysis'));
      }
    },

    //*getCaptcha({ payload }, { call }) {
    //  yield call(getFakeCaptcha, payload);
    //},

    *logout(_, { put }) {
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
            //redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      let auth;
      if (payload.result) {
        auth = payload.result.data.roleEnNames[0];
      } else {
        auth = payload.currentAuthority;
      }
      setAuthority(auth);
      return {
        ...state,
        //status: auth,
        //type: payload.type,
      };
    },
  },
};
