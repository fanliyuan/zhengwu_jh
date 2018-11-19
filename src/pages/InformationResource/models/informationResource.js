// import { message } from 'antd';

// import apis from '../../../api'
import {
  getSourceClassfiyList,
  addResource,
} from '@/services/informationResource/informationResource';

// const { getSourceList, getDBInfo } = apis
export default {
  namespace: 'informationResource',

  state: {
    classfiyList: [],
  },

  effects: {
    *getClassfiyList(_, { call, put }) {
      const response = yield call(getSourceClassfiyList);
      try {
        if (+response.code === 200) {
          yield put({
            type: 'queryClassify',
            payload: response.result,
          });
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getDBInfo({ payload }, { call }) {
      const response = yield call(addResource, payload);
      try {
        console.log(response);
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
  },

  reducers: {
    queryClassify(state, { payload }) {
      return {
        ...state,
        classfiyList: payload,
      };
    },
    savaDataList(
      state,
      {
        payload: { dataList, pagination },
      }
    ) {
      return {
        ...state,
        dataList,
        pagination,
      };
    },
    saveDBInfo(
      state,
      {
        payload: { DBInfo },
      }
    ) {
      return {
        ...state,
        DBInfo,
      };
    },
  },
};
