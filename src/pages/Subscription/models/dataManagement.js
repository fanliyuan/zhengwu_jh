import { message } from 'antd';
import { getDBList, getFileList } from '@/services/subscription';
import { stat } from 'fs';

export default {
  namespace: 'dataManagement',

  state: {
    DBList: [],
    FileList: [],
  },

  effects: {
    *getDBList({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(getDBList, payload);
        const { datas, total = 0, pageSize = 10, pageNum: current = 1 } = response.result;
        const pagination = total > pageSize ? { total, pageSize, current } : false;
        if (+response.code === 0) {
          yield put({
            type: 'saveDbList',
            payload: datas,
          });
        } else {
          throw response.msg;
        }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line\
          console.log(error);
        } else {
          message.error(error || '操作失败');
        }
      }
    },
    *getFileList({ payload }, { call, put }) {
      const res = yield call(getFileList, payload);
      try {
        const { result: { datas } = {} } = res;
        if (+res.code === 0) {
          yield put({
            type: 'saveFileList',
            payload: datas,
          });
        } else {
          throw res.msg;
        }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line
          console.log(error);
        } else {
          message.error(error || '操作失败');
        }
      }
    },
  },
  reducers: {
    saveDbList(state, { payload }) {
      return {
        ...state,
        DBList: payload,
      };
    },
    saveFileList(state, { payload }) {
      return {
        ...state,
        FileList: payload,
      };
    },
  },
};
