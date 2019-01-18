import { message } from 'antd';

import { getAllNode } from '@/services/subscription/index';
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
import { getResourceDetails } from '@/services/subscription';

export default {
  namespace: 'subAuth',
  state: {
    dataList: {},
    pubNodes: [],
    page: 1,
    resourceDetail: {},
    refDetail: {},
    subAuthDetail: {},
  },
  effects: {
    *getSubAuthList({ payload }, { call, put }) {
      try {
        const response = yield call(getSubAuthList, payload);
        if (+response.code === 200) {
          yield put({
            type: 'queryList',
            payload: response.result,
          });
          yield put({
            type: 'setPage',
            payload,
          });
        }
      } catch (error) {
        console.log(error);
        yield put({
          type: 'queryList',
          payload: {
            dataList: {},
          },
        });
      }
    },
    *setSubAuth({ payload, callback }, { put, call }) {
      try {
        const res = yield call(setSubAuth, payload.item);
        callback(res);
        if (+res.code === 200) {
          yield put({
            type: 'getSubAuthList',
            payload: payload.values,
          });
          message.success(res.message || '操作成功');
        } else {
          message.error(res.message || '操作失败');
        }
      } catch (error) {
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
    *getResourceDetail({ payload }, { call, put }) {
      try {
        const response = yield call(getResourceDetails, payload);
        if (response.code === 0) {
          yield put({
            type: 'saveResourceDetail',
            payload: response.result,
          });
        }
      } catch (error) {
        console.log(error); // eslint-disable-line
        yield put({
          type: 'saveResourceDetail',
          payload: {},
        });
      }
    },
    *getNodes({ payload }, { call, put }) {
      const response = yield call(getAllNode, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveNodes',
          payload: response.result,
        });
      }
    },
  },
  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    saveNodes(state, { payload }) {
      return {
        ...state,
        pubNodes: payload,
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
    saveResourceDetail(state, { payload }) {
      return {
        ...state,
        resourceDetail: payload,
      };
    },
    setPage(state, { payload }) {
      return {
        ...state,
        page: payload.pageNum,
      };
    },
  },
};
