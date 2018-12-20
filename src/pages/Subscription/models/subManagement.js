/* eslint-disable no-param-reassign */
import { message } from 'antd';

import {
  getSubList,
  stopSubTask,
  runSubTask,
  getAssessLogs,
  getAllNode,
} from '@/services/subscription';

export default {
  namespace: 'subManagement',
  state: {
    queryData: {},
    dataList: [],
    pagination: {},
    assessLogs: [],
    nodeList: [],
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
    *startSubTask({ payload: params }, { call, put }) {
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
    *getAllNode(_, { call, put }) {
      let response;
      let dataList = [];
      try {
        response = yield call(getAllNode);
        // eslint-disable-next-line
        // const { datas, total = 0, pageSize = 10, pageNum: current = 1 } = response.result
        // const pagination = {total, pageSize, current}
        if (+response.code === 200) {
          dataList = response.result;
        } else {
          throw response.msg;
        }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line
          console.log(error);
        } else {
          message.error(error || '操作失败');
        }
      } finally {
        yield put({ type: 'saveNodeList', payload: dataList });
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
    saveNodeList(state, { payload: nodeList }) {
      return {
        ...state,
        nodeList,
      };
    },
  },
};
