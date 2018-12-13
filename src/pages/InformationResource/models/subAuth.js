import { message } from 'antd';

import {
  getSubAuthList,
  setSubAuth,
  getSubAuthDetail,
} from '@/services/informationResource/informationResource';
import {
  viewDbDetail,
  viewFileDetail,
  viewFtpDetail,
  getSyncBasic,
} from '@/services/dataSource/dataSource';

export default {
  namespace: 'subAuth',
  state: {
    dataList: [],
    queryData: {},
    pagination: {},
    refDetail: {},
    subAuthDetail: {},
  },
  effects: {
    *getSubAuthList({ payload }, { call, put, select }) {
      if (payload && payload.params) {
        yield put({
          type: 'saveQueryData',
          payload: payload.params,
        });
      } else {
        // eslint-disable-next-line
        payload.params = yield select(state => state.subAuth.queryData);
      }
      let dataList = [];
      const pagination = {};
      try {
        const res = yield call(getSubAuthList, payload.params);
        if (+res.code === 200) {
          dataList = res.result.datas;
          pagination.total = res.result.totalCounts;
        }
      } catch (error) {
        console.log(error); // eslint-disable-line
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
            payload: {},
          });
        }
      } catch {
        message.error('操作失败');
      }
    },
    *getRefDetail({ payload }, { call, put }) {
      try {
        let res;
        if (payload.type === 'db') {
          res = yield call(viewDbDetail, payload.id);
        } else if (payload.dataType === 'file') {
          res = yield call(viewFileDetail, payload.id);
        } else {
          res = yield call(viewFtpDetail, payload.id);
        }
        const {
          result: {
            data: {
              name: dataTitle,
              id: dataId,
              type = 'ftp',
              datasourceDetailDto: { type: dataType } = {},
            } = {},
          } = {},
        } = res;
        const taskDetail = yield call(getSyncBasic, { dataType: type, id: payload.id });
        const {
          result: {
            data: {
              accessTime: insertTime,
              dataFileSize: dataSize,
              lastSyncTime: updateTime,
              syncMode,
              syncRate,
              timeSet,
            } = {},
          } = {},
        } = taskDetail;
        const refDetail = {
          dataTitle,
          dataType,
          insertTime,
          dataSize,
          updateTime,
          dataPubMode: `${syncMode}-${syncRate}-${timeSet}`,
          dataId: dataId || payload.id || 0,
        };
        yield put({
          type: 'saveRefDetail',
          payload: {
            refDetail,
          },
        });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
    *getSubAuthDetail({ payload }, { call, put }) {
      let subAuthDetail = {};
      try {
        const res = yield call(getSubAuthDetail, payload);
        if (res.code === 200) {
          subAuthDetail = res.result.datas;
        }
      } catch (error) {
        console.log(error); // eslint-disable-line
      } finally {
        yield put({
          type: 'saveSubAuthDetail',
          payload: subAuthDetail,
        });
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
    saveRefDetail(
      state,
      {
        payload: { refDetail },
      }
    ) {
      return {
        ...state,
        refDetail,
      };
    },
    saveSubAuthDetail(state, { payload: subAuthDetail }) {
      return {
        ...state,
        subAuthDetail,
      };
    },
  },
};
