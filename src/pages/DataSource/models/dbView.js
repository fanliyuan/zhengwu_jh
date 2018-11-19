import { getDBTableStruct } from '@/services/dataSource/dataSource';
export default {
  namescpace: 'dbView',
  state: {
    tablePagination: {},
    dataPagination: {},
    tableList: [],
    dataList: [],
    tableStruct: [],
    dbInfo: {},
  },
  effects: {
    *getDBTableStruct({ payload }, { call, put }) {
      try {
        const res = yield call(getDBTableStruct, { path: payload.path, query: payload.query });
        const {
          coede,
          result: { datas, totalCounts },
        } = res;
        if (coede === 200) {
          yield put({
            type: 'saveTableStruc',
            payload: {
              tableStruct: datas,
            },
          });
        }
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },
  },
  redueces: {
    saveTableStruc(
      state,
      {
        payload: { tableStruct },
      }
    ) {
      return {
        ...state,
        tableStruct,
      };
    },
  },
};
