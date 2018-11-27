import { message } from 'antd';

import { getAssessList, assessData } from '@/services/sourceManagement/sourceManagement';

export default {
  namespace: 'assess',

  state: {
    assessList: [],
    pagination: { total: 0 },
    queryData: {},
  },

  effects: {
    *getAssessList({ payload }, { call, put }) {
      let assessList = [];
      let pagination = {};
      if (payload && payload.params) {
        yield put({
          type: 'saveQueryData',
          payload: {
            params: payload.params,
          },
        });
      } else {
        payload = yield select(state => state.assess.queryData);
      }
      try {
        const res = yield call(getAssessList, payload.params);
        if (res.code === 200) {
          assessList = res.result.datas;
          pagination = {
            total: res.result.totalCounts,
            current: payload.params.pageNum,
            pageSize: payload.params.pageSize,
          };
        } else {
          throw res.msg;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        pagination = {
          total: 0,
        };
      } finally {
        yield put({
          type: 'saveAssessList',
          payload: {
            assessList,
            pagination,
          },
        });
      }
    },
    *assessData({ payload }, { call }) {
      try {
        const res = yield call(assessData, {
          id: payload.id,
          type: payload.type,
          body: payload.body,
        });
        if (+res.code === 0) {
          message.success(res.msg || '提交成功');
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
  },

  reducers: {
    saveAssessList(
      state,
      {
        payload: { assessList, pagination },
      }
    ) {
      return {
        ...state,
        assessList,
        pagination,
      };
    },
    saveQueryData(
      state,
      {
        payload: { queryData },
      }
    ) {
      return {
        ...state,
        queryData,
      };
    },
  },
};
