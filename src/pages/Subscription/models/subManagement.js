/* eslint-disable no-param-reassign */
import { message } from 'antd';

import { getSubList, stopSubTask, runSubTask, getAssessLogs } from '@/services/subscription';

export default {
  namespace: 'subManagement',
  state: {
    queryData: {},
    dataList: [],
    pagination: {},
    assessLogs: [],
  },

  effects: {
    *getSubList({ payload: params }, { call, put, select }) {
      if (params) {
        yield put({
          type: 'saveQueryData',
          payload: params,
        });
      } else {
        params = yield select(state => state.subManagement.queryData);
      }
      let res;
      let dataList = [];
      const pagination = {};
      try {
        res = yield call(getSubList, params);
        if (+res.code === 200) {
          dataList = res.result.datas;
          pagination.total = res.result.totalCounts;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      } finally {
        yield put({
          type: 'saveDataList',
          payload: {
            dataList,
            pagination,
          },
        });
      }
    },
    *runSubTask({ payload: params }, { call, put }) {
      try {
        const res = yield call(runSubTask, params);
        if (+res.code === 200) {
          message.success(res.msg || '启动成功');
          yield put({
            type: 'getSubList',
          });
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    *stopSubTask({ payload: params }, { call, put }) {
      try {
        const res = yield call(stopSubTask, params);
        if (+res.code === 200) {
          message.success(res.msg || '停止成功');
          yield put({
            type: 'getSubList',
          });
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    *getAssessLogs({ payload: params }, { call, put }) {
      let assessLogs = {};
      try {
        const res = yield call(getAssessLogs, params);
        assessLogs = res.result.datas;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      } finally {
        yield put({
          type: 'saveAssessLogs',
          payload: [assessLogs],
        });
      }
    },
  },

  reducers: {
    saveQueryData(state, { payload }) {
      return {
        ...state,
        queryData: { ...payload },
      };
    },
    saveDataList(
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
    saveAssessLogs(state, { payload: assessLogs }) {
      return {
        ...state,
        assessLogs,
      };
    },
  },
};
