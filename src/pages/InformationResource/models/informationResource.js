import { message } from 'antd';
import { routerRedux } from 'dva/router';

// import apis from '../../../api'
import {
  getSourceClassfiyList,
  addResource,
  getResourceLists,
  checkIsSameName,
  openDataById,
  updateOpenData,
} from '@/services/informationResource/informationResource';

// const { getSourceList, getDBInfo } = apis
export default {
  namespace: 'informationResource',

  state: {
    classfiyList: [],
    resourceList: [],
    pagination: {},
    sameMsg: false,
    openData: {},
    DBInfo: {},
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
              ? {
                  current: payload.pageNum ? payload.pageNum : 1,
                  pageSize: payload.pageSize ? payload.pageSize : 10,
                  total: response.result.totalCounts,
                }
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
    *openShare({ payload }, { call, put }) {
      const response = yield call(openDataById, payload);
      try {
        if (+response.code === 200) {
          // message.success(response.message);
          yield put({
            type: 'getOpenData',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *submitOpenShare({ payload }, { call }) {
      const response = yield call(updateOpenData, payload);
      try {
        if (+response.code === 202) {
          message.success(response.message);
          // yield put(routerRedux.push('/informationResource/sourceManagement'));
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
    getOpenData(state, { payload }) {
      return {
        ...state,
        openData: payload,
      };
    },
  },
};
