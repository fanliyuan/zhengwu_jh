import { message } from 'antd';

const statusObject = {
  '-1': '待审核',
  '0': '已拒绝',
  '1': '已通过',
  '10': '修改已拒绝',
  '11': '修改已通过',
  '20': '删除已拒绝',
  '21': '删除已通过',
};

import {
  getAssessList,
  assessData,
  getAssessLog,
} from '@/services/sourceManagement/sourceManagement';

export default {
  namespace: 'assess',

  state: {
    assessList: [],
    pagination: { total: 0 },
    queryData: {},
    assessLog: [],
  },

  effects: {
    *getAssessList({ payload = {} }, { call, put, select }) {
      let assessList = [];
      let pagination = {};
      if (payload && payload.params) {
        yield put({
          type: 'saveQueryData',
          payload: {
            queryData: payload.params,
          },
        });
      } else {
        payload.params = yield select(state => state.assess.queryData);
      }
      try {
        const res = yield call(getAssessList, payload.params);
        if (res.code === 200) {
          assessList = res.result.datas;
          assessList.forEach((item, index) => (item.index = index));
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
    *assessData({ payload }, { call, put }) {
      yield put({
        type: 'getAssessList',
      });
      try {
        const res = yield call(assessData, {
          id: payload.id,
          type: payload.type,
          body: payload.body,
        });
        if (+res.code === 202 || res.code === 201) {
          message.success(res.msg || '提交成功');
          yield put({
            type: 'getAssessList',
          });
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    *getAssessLog({ payload }, { call, put }) {
      let datas = [];
      try {
        const res = yield call(getAssessLog, { type: payload.params.type, id: payload.params.id });
        if (res.code === 200) {
          datas = [
            {
              name: '申请人',
              value: res.result.datas[0].applyUsername || '未知',
            },
            {
              name: '申请时间',
              value: res.result.datas[0].applyTime || '未知',
            },
            {
              name: '审核人',
              value: res.result.datas[0].reviewUsername,
            },
            {
              name: '审核时间',
              value: res.result.datas[0].reviewTime,
            },
            {
              name: '审核结果',
              value: statusObject[res.result.datas[0].status] || '未知',
            },
          ];
          if (
            res.result.datas[0].status === 0 ||
            res.result.datas[0].status === 10 ||
            res.result.datas[0].status === 20
          ) {
            datas.push({
              name: '拒绝理由',
              value: res.result.datas[0].reason,
            });
          }
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      } finally {
        yield put({
          type: 'saveAssessLog',
          payload: {
            assessLog: datas,
          },
        });
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
    saveAssessLog(
      state,
      {
        payload: { assessLog },
      }
    ) {
      return {
        ...state,
        assessLog,
      };
    },
  },
};
