import { message } from 'antd';
import { routerRedux } from 'dva/router';

// import apis from '../../../api'
import {
  getSourceClassfiyList,
  addResource,
  getResourceLists,
  checkIsSameName,
} from '@/services/informationResource/informationResource';

// const { getSourceList, getDBInfo } = apis
export default {
  namespace: 'informationResource',

  state: {
    classfiyList: [],
    resourceList: [],
    pagination: {},
    sameMsg: false,
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
    *addResources({ payload }, { call, put }) {
      const response = yield call(addResource, payload);
      try {
        if (+response.code === 201) {
          message.success(response.message);
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getResourceList({ payload }, { call, put }) {
      const response = yield call(getResourceLists, payload);
      try {
        if (+response.code === 200) {
          const pagination =
            response.result.totalCounts > 9
              ? { current: 1, pageSize: 10, total: response.result.totalCounts }
              : false;
          yield put({
            type: 'queryList',
            payload: { list: response.result.datas, pagination },
          });
        }
      } catch (err) {
        console.log(err); // eslint-disable-line
      }
    },
    *isNameSame({ payload }, { call, put }) {
      const response = yield call(checkIsSameName, payload);
      try {
        if (+response.code === 200) {
          console.log(response.message); // eslint-disable-line
          yield put({
            type: 'isSame',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
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
    queryList(
      state,
      {
        payload: { list, pagination },
      }
    ) {
      return {
        ...state,
        resourceList: list,
        pagination,
      };
    },
    isSame(state, { payload }) {
      return {
        ...state,
        sameMsg: payload,
      };
    },
  },
};
