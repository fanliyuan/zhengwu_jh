import { message } from 'antd';

import {
  getInfoSrcDetail,
  viewDbDetail,
  viewFileDetail,
  viewFtpDetail,
  getSyncBasic,
} from '@/services/dataSource/dataSource';

export default {
  namespace: 'infoSource',
  state: {
    infoSourceDetail: {},
    refDetail: {},
  },
  effects: {
    *getInfoSrcDetail({ payload }, { call, put }) {
      try {
        // infoSrcCode, infoSrcName, infoSrcClassify, infoSrcProvider, infoSrcProviderCode, infoSrcProviderDepartment, updateCircle, pubDate, shareDate, infoSrcType, linkSrcCode, infoItem, infoSrcSummary
        const res = yield call(getInfoSrcDetail, payload);
        if (res.code === 200) {
          const {
            result: { data },
          } = res;
          const infoSourceDetail = {
            infoSrcCode: data.code,
            infoSrcName: data.name,
            infoSrcClassify: data.typeName,
            infoSrcProvider: data.providerName,
            infoSrcProviderCode: data.providerNo,
            infoSrcProviderDepartment: data.providerDept,
            updateCircle: data.updateCycle,
            pubDate: data.publishTime,
            shareDate: data.shareTime,
            infoSrcType: data.format,
            linkSrcCode: data.relateCode,
            infoItem: data.mountId,
            infoSrcSummary: data.summary,
          };
          yield put({
            type: 'saveInfoSourceDetail',
            payload: {
              infoSourceDetail,
            },
          });
        } else {
          message.error(res.message);
          throw res.message;
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
        yield put({
          type: 'saveInfoSourceDetail',
          payload: {
            infoSourceDetail: {},
          },
        });
      }
    },
    *getRefDetail({ payload }, { call, put }) {
      try {
        let res;
        if (payload.type === 'db') {
          res = yield call(viewDbDetail, payload.id);
        } else if (payload.type === 'file') {
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
  },
  reducers: {
    saveInfoSourceDetail(
      state,
      {
        payload: { infoSourceDetail },
      }
    ) {
      return {
        ...state,
        infoSourceDetail,
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
  },
};
