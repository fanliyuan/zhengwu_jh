import {
  connectBase,
  isSameNameData,
  viewDataSource,
  mysqlDbList,
  mysqlTableList,
  mysqlColumnList,
  accessDataSource,
} from '@/services/dataSource/dataSource';
import { message, notification } from 'antd';
function initDbParams() {
  return {
    appsysName: '',
    createUnit: '',
    dbName: '',
    describe: '',
    dutyName: '',
    dutyPhone: '',
    dutyPosition: '',
    name: '',
    structAddDtoList: [],
    syncAddDto: {
      stopNum: '0',
      syncMode: '增量',
      syncRate: '定时',
      timeSet: '-分钟',
    },
    tableName: '',
    tableNote: '',
  };
}
function initFtpParams() {
  return {
    createUnit: '',
    desc: '',
    dutyName: '',
    dutyPhone: '',
    dutyPosition: '',
    ftpfileAddDtoList: [],
    name: '',
    syncAddDto: {
      stopNum: 0,
      syncMode: '增量',
      syncRate: '定时',
      timeSet: '-分钟',
    },
  };
}
function initFileParams() {
  return {
    createUnit: '',
    describe: '',
    dutyName: '',
    dutyPhone: '',
    dutyPosition: '',
    fileAddDtoList: [],
    name: '',
  };
}
export default {
  namespace: 'accessData',

  state: {
    current: 0,
    dataType: '',
    type: '',
    alias: '',
    oldName: '',
    dbList: [],
    tableList: [],
    columnList: [],
    syncModeList: [
      {
        key: '增量',
        value: '增量',
      },
      {
        key: '全量',
        value: '全量',
      },
    ],
    syncRateList: [
      {
        key: '定时',
        value: '定时',
      },
      {
        key: '实时',
        value: '实时',
      },
    ],
    timeList: [
      {
        key: '分钟',
        value: '分钟',
      },
      {
        key: '小时',
        value: '小时',
      },
      {
        key: '周',
        value: '周',
      },
      {
        key: '天',
        value: '天',
      },
      {
        key: '月',
        value: '月',
      },
    ],
    params: {},
  },

  effects: {
    *detail({ payload }, { call, put }) {
      const response = yield call(viewDataSource, payload);
      if (response.code < 300) {
        let dataType = '';
        let params = {};
        const { type, alias, ip, port, username, password } = response.result.data;
        const typeData = [
          {
            title: 'mysql',
            type: 'db',
          },
          {
            title: 'sqlserver',
            type: 'db',
          },
          {
            title: 'oracle',
            type: 'db',
          },
          {
            title: 'dm',
            type: 'db',
          },
          {
            title: 'kingbase',
            type: 'db',
          },
          {
            title: 'ftp',
            type: 'ftp',
          },
          {
            title: 'sftp',
            type: 'ftp',
          },
          {
            title: '本地文件上传',
            type: 'file',
          },
        ];
        typeData.map(item => {
          if (item.title === type) {
            dataType = item.type;
            switch (dataType) {
              case 'db':
                params = initDbParams();
                break;
              case 'ftp':
                params = initFtpParams();
                break;
              case 'file':
                params = initFileParams();
                break;
            }
          }
        });
        yield put({
          type: 'updateParams',
          payload: params,
        });
        yield put({
          type: 'updateDataType',
          payload: {
            dataType: dataType,
            type: type,
            alias: alias,
          },
        });
        yield put({
          type: 'connection',
          payload: {
            dataType: dataType,
            connectParams: {
              type: type,
              addr: ip,
              port: port,
              username: username,
              password: password,
            },
          },
        });
      }
    },
    *setDataType({ payload }, { call, put }) {
      yield put({
        type: 'updateDataType',
        payload: payload,
      });
    },
    *setDbList({ payload }, { call, put }) {
      const response = yield call(mysqlDbList, payload);
      if (response.code < 300) {
        yield put({
          type: 'updateDbList',
          payload: response.result.datas,
        });
      }
    },
    *setTableList({ payload }, { call, put }) {
      const response = yield call(mysqlTableList, payload);
      if (response.code < 300) {
        yield put({
          type: 'updateTableList',
          payload: response.result.datas,
        });
      }
    },
    *setColumnList({ payload }, { call, put }) {
      const response = yield call(mysqlColumnList, payload);
      if (response.code < 300) {
        yield put({
          type: 'updateColumnList',
          payload: response.result.datas,
        });
      }
    },
    *setParams({ payload }, { call, put }) {
      yield put({
        type: 'updateDataType',
        payload: payload,
      });
    },
    *reset({ payload }, { call, put }) {
      yield put({
        type: 'resetParams',
        payload: payload,
      });
    },
    *connection({ payload }, { call, put }) {
      const response = yield call(connectBase, payload.connectParams);
      const alias = response.result.data;
      if (response.code < 300) {
        if (payload.dataType === 'db') {
          yield put({
            type: 'setDbList',
            payload: {
              alias: alias,
            },
          });
        }
      }
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(accessDataSource, payload);
      if (response && response.code >= 300) {
        return notification.error({
          message: response.message,
        });
      }
      yield put({
        type: 'next',
      });
    },
    *testName({ payload }, { call, put }) {
      const response = yield call(isSameNameData, { name: payload.name });
      if (response && response.result.data) {
        return notification.error({
          message: '数据名称重复！',
        });
      }
      yield put({
        type: 'updateParams',
        payload: payload,
      });
      yield put({
        type: 'next',
        payload: payload,
      });
    },
  },

  reducers: {
    next(state) {
      return {
        ...state,
        current: state.current + 1,
      };
    },
    prev(state) {
      state.params.syncAddDto = {
        stopNum: '0',
        syncMode: '增量',
        syncRate: '定时',
        timeSet: '-分钟',
      };
      return {
        ...state,
        current: state.current - 1,
      };
    },
    updateDataType(state, { payload }) {
      return {
        ...state,
        dataType: payload.dataType,
        type: payload.type,
        alias: payload.alias,
      };
    },
    updateDbList(state, { payload }) {
      return {
        ...state,
        dbList: payload,
      };
    },
    updateTableList(state, { payload }) {
      return {
        ...state,
        tableList: payload,
      };
    },
    updateColumnList(state, { payload }) {
      return {
        ...state,
        columnList: payload,
      };
    },
    updateParams(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    },
    addStructAddDtoList(state, { payload }) {
      state.params.structAddDtoList.splice(0, state.params.structAddDtoList.length);
      state.params.structAddDtoList = [...state.params.structAddDtoList, ...payload];
      return {
        ...state,
      };
    },
    resetTableColumnList(state, { payload }) {
      state.tableList.splice(0, state.tableList.length);
      state.columnList.splice(0, state.columnList.length);
      return {
        ...state,
      };
    },
    resetStructAddDtoList(state, { payload }) {
      state.params.structAddDtoList.splice(0, state.params.structAddDtoList.length);
      return {
        ...state,
      };
    },
    resetParams(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
