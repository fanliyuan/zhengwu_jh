import { getResourceDetails, resourceBeanEntityInfo } from '@/services/subscription/index';
import { message } from 'antd';

export default {
  namespace: 'infoResource',

  state: {
    dataDetail: {},
    resourceDetail: {},
  },

  effects: {
    *getDataDetail({ payload }, { call, put }) {
      const response = yield call(resourceBeanEntityInfo, { ...payload });
      if (response.code === 200) {
        yield put({
          type: 'saveDataDetail',
          payload: response.result,
        });
      } else {
        message.error(response.message);
      }
    },
    *getResourceDetail({ payload }, { call, put }) {
      const response = yield call(getResourceDetails, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'saveResourceDetail',
          payload: response.result,
        });
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    saveDataDetail(state, { payload }) {
      return {
        ...state,
        dataDetail: payload,
      };
    },
    saveResourceDetail(state, { payload }) {
      return {
        ...state,
        resourceDetail: payload,
      };
    },
    reset(state) {
      return {
        ...state,
        dataDetail: {},
        resourceDetail: {},
      };
    },
  },
};
