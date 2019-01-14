import {
  tableDataList,
  tableStructureList,
  resourceBeanEntityInfo,
} from '@/services/subscription/index';

export default {
  namespace: 'subDetailDataBase',

  state: {
    tableList: {
      datas: [],
    },
    dataList: {},
    tableStruct: {},
    dbInfo: {},
  },

  effects: {
    *getDbDetail({ payload }, { call, put }) {
      const response = yield call(resourceBeanEntityInfo, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveTableInfo',
          payload: response.result.value,
        });
      }
    },
    *getDbList({ payload }, { put }) {
      yield put({
        type: 'saveTableList',
        payload: payload.tableName,
      });
      yield put({
        type: 'getDBTableStruct',
        payload: {
          tableName: payload.tableName,
          pageNum: 1,
          pageSize: 10,
        },
      });
      yield put({
        type: 'getDbTableList',
        payload: {
          tableName: payload.tableName,
          pageNum: 1,
          pageSize: 10,
        },
      });
    },
    *getDBTableStruct({ payload }, { call, put }) {
      const response = yield call(tableStructureList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveTabelStruct',
          payload: response.result,
        });
      }
    },
    *getDbTableList({ payload }, { call, put }) {
      const response = yield call(tableDataList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'saveDataList',
          payload: response.result,
        });
      }
    },
  },

  reducers: {
    saveTableInfo(state, { payload }) {
      return {
        ...state,
        dbInfo: payload,
        tableList: {
          datas: [
            {
              ...state.tableList.datas[0],
              comment: payload.tableNote,
            },
          ],
        },
      };
    },
    saveTableList(state, { payload }) {
      return {
        ...state,
        tableList: {
          datas: [
            {
              ...state.tableList.datas[0],
              name: payload,
            },
          ],
        },
      };
    },
    saveTabelStruct(state, { payload }) {
      return {
        ...state,
        tableStruct: payload,
      };
    },
    saveDataList(state, { payload }) {
      return {
        ...state,
        dataList: payload,
      };
    },
    reset(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
