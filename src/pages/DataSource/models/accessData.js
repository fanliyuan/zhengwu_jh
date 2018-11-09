import {
  connectBase,
  isSameNameData,
  viewDataSource,
  mysqlDbList,
  mysqlTableList,
  mysqlColumnList,
  accessDataSource,
  accessFtp,
  accessFile,
  ftpDataList,
  sftpDataList,
} from '@/services/dataSource/dataSource';
import { notification } from 'antd';

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
      stopNum: '5',
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
      stopNum: '5',
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
    treeList: [],
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
      if (response && response.code < 300) {
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
            title: 'file',
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
          return params;
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
      if (response && response.code < 300) {
        yield put({
          type: 'updateDbList',
          payload: response.result.datas,
        });
      }
    },
    *setTreeList({ payload }, { call, put }) {
      let callbackApi;
      if (payload.treeType === 'ftp') {
        callbackApi = ftpDataList;
      } else {
        callbackApi = sftpDataList;
      }
      const response = yield call(callbackApi, payload.params);
      if (response && response.code < 300) {
        if (payload.treeNode) {
          yield put({
            type: 'updateTreeList',
            payload: {
              data: response.result.datas,
              type: payload.type,
              treeNode: payload.treeNode,
            },
          });
        } else {
          yield put({
            type: 'updateTreeList',
            payload: {
              data: response.result.datas,
              type: payload.type,
            },
          });
        }
      }
    },
    *setTableList({ payload }, { call, put }) {
      const response = yield call(mysqlTableList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'updateTableList',
          payload: response.result.datas,
        });
      }
    },
    *setColumnList({ payload }, { call, put }) {
      const response = yield call(mysqlColumnList, payload);
      if (response && response.code < 300) {
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
      const treeType = payload.connectParams.type;
      if (response.code < 300) {
        if (payload.dataType === 'db') {
          yield put({
            type: 'setDbList',
            payload: {
              alias: alias,
            },
          });
        } else if (payload.dataType === 'ftp') {
          yield put({
            type: 'setTreeList',
            payload: {
              params: {
                alias: alias,
                path: '/',
              },
              type: 'create',
              treeType: treeType,
            },
          });
        }
      }
    },
    *submit({ payload }, { call, put }) {
      let callbackApi;
      if (payload.dataType === 'db') {
        callbackApi = accessDataSource;
      } else if (payload.dataType === 'ftp') {
        callbackApi = accessFtp;
      } else {
        callbackApi = accessFile;
      }
      const response = yield call(callbackApi, payload);
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
      const response = yield call(isSameNameData, { name: payload.values.name });
      if (response && response.result.data) {
        return notification.error({
          message: '数据名称重复！',
        });
      }
      yield put({
        type: 'updateParams',
        payload: payload.values,
      });
      if (payload.dataType !== 'file') {
        yield put({
          type: 'next',
          payload: payload.values,
        });
      } else {
        yield put({
          type: 'submit',
          payload: payload,
        });
      }
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
    updateTreeList(state, { payload }) {
      const { type } = payload;
      let { treeList } = state;
      if (type === 'create') {
        payload.data.map((item, index) => {
          item.key = index;
        });
        treeList = payload.data;
      } else {
        payload.data.map((item, index) => {
          item.key = `${payload.treeNode.props.eventKey}-${index}`;
        });
        payload.treeNode.props.dataRef.children = payload.data;
        treeList = [...treeList];
      }
      return {
        ...state,
        treeList: treeList,
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
    addFtpfileAddDtoList(state, { payload }) {
      state.params.ftpfileAddDtoList.splice(0, state.params.ftpfileAddDtoList.length);
      state.params.ftpfileAddDtoList = [...state.params.ftpfileAddDtoList, ...payload];
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
