import {
  getResourceLists,
  getSourceClassfiyList,
  review,
  reviewLog,
} from '@/services/informationResource/informationResource';
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

export default {
  namespace: 'resourceAudit',

  state: {
    dataList: {},
    sourceClassfiyList: [],
    auditLog: [],
    page: 1,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getResourceLists, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDataList',
          payload: response.result,
        });
        if (payload.page) {
          yield put({
            type: 'savePage',
            payload: payload,
          });
        }
      }
    },
    *getSourceClassfiyList({ payload }, { call, put }) {
      const response = yield call(getSourceClassfiyList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveSourceClassfiyList',
          payload: response.result,
        });
      }
    },
    *audit({ payload, callback }, { call, put }) {
      const response = yield call(review, payload.item);
      callback(response);
      if (response && response.code < 300) {
        message.success(response.message);
        yield put({
          type: 'fetch',
          payload: payload.values,
        });
      } else {
        message.error(response.message);
      }
    },
    *auditLog({ payload }, { call, put }) {
      let datas = [];
      const response = yield call(reviewLog, payload);
      if (response && response.code < 300) {
        datas = [
          {
            name: '申请人',
            value: response.result.datas[0].applyUsername || '未知',
          },
          {
            name: '申请时间',
            value: response.result.datas[0].applyTime || '未知',
          },
          {
            name: '审核人',
            value: response.result.datas[0].reviewUsername,
          },
          {
            name: '审核时间',
            value: response.result.datas[0].reviewTime,
          },
          {
            name: '审核结果',
            value: statusObject[response.result.datas[0].status] || '未知',
          },
        ];
        if (
          response.result.datas[0].status === 0 ||
          response.result.datas[0].status === 10 ||
          response.result.datas[0].status === 20
        ) {
          datas.push({
            name: '拒绝理由',
            value: response.result.datas[0].reason,
          });
        }
        yield put({
          type: 'saveAuditLog',
          payload: datas,
        });
      }
    },
  },

  reducers: {
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    saveAuditLog(state, { payload }) {
      return {
        ...state,
        auditLog: payload,
      };
    },
    saveSourceClassfiyList(state, { payload }) {
      return {
        ...state,
        sourceClassfiyList: payload,
      };
    },
    savePage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
    resetAuditLog(state) {
      return {
        ...state,
        auditLog: [],
      };
    },
  },
};
