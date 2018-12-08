import { message } from 'antd';

import { getSubAuthList, setSubAuth } from '@/services/informationResource/informationResource';

export default {
  namespace: 'subAuth',
  state: {
    dataList: [],
    queryData: {},
    pagination: {},
  },
  effects: {
    *getSubAuthList({ payload: params }, { call, put }, select) {
      if (params) {
        yield put({
          type: 'saveQueryData',
          payload: params,
        });
      } else {
        params = yield select(state => state.subAuth.queryData);
      }
      let dataList = [];
      let pagination = {};
      try {
        res = yield call(getSubAuthList, params);
        if (+res.code === 200) {
          dataList = res.result.datas;
          pagination.total = res.result.totalCounts;
        }
      } catch (error) {
        pagination.total = 0;
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
    *setSubAuth({ payload: params }, { put, call }) {
      try {
        const res = yield call(setSubAuth, params);
        if (+res.code === 200) {
          message.success(res.msg || '操作成功');
          yield put({
            type: 'getSubAuthList',
          });
        }
      } catch {
        message.error('操作失败');
      }
    },
  },
  reducers: {
    saveQueryData(state, { payload }) {
      return {
        ...state,
        queryData: payload,
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
  },
};
