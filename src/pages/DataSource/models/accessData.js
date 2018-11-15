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
  viewDbDetail,
  viewFileDetail,
  viewFtpDetail,
  initFileList,
  initFtpList,
  updateDb,
  updateFile,
  updateFtp,
  searchTask,
} from '@/services/dataSource/dataSource';
import { notification, message } from 'antd';

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
    checkedKeys: [],
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
            oldName: '',
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
    *setDbList({ payload }, { call, put }) {
      const response = yield call(mysqlDbList, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'updateDbList',
          payload: response.result.datas,
        });
      }
    },
    *setTreeList({ payload, callback }, { call, put }) {
      let callbackApi;
      if (payload.treeType === 'ftp') {
        callbackApi = ftpDataList;
      } else {
        callbackApi = sftpDataList;
      }
      const response = yield call(callbackApi, payload.params);
      if (response && response.code < 300) {
        if (callback && typeof callback === 'function') {
          callback(response); // 返回结果
        }
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
      } else {
        message.error(`${response.message}，结构树加载失败！`);
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
              alias,
            },
          });
        } else if (payload.dataType === 'ftp') {
          yield put({
            type: 'setTreeList',
            payload: {
              params: {
                alias,
                path: '/',
              },
              type: 'create',
              treeType,
            },
          });
        }
      }
    },
    *submit({ payload }, { call, put }) {
      let callbackApi;
      if (payload.routeName && payload.routeName !== 'managementUpdate') {
        if (payload.dataType === 'db') {
          callbackApi = accessDataSource;
        } else if (payload.dataType === 'ftp') {
          callbackApi = accessFtp;
        } else {
          callbackApi = accessFile;
        }
      } else {
        if (payload.dataType === 'db') {
          callbackApi = updateDb;
        } else if (payload.dataType === 'ftp') {
          callbackApi = updateFtp;
        } else {
          callbackApi = updateFile;
        }
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
      if (payload.oldName && payload.oldName !== '' && payload.oldName === payload.values.name) {
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
      } else {
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
      }
    },
    *updateDetail({ payload }, { call, put }) {
      let callbackApi;
      const { dataType } = payload;
      if (dataType === 'db') {
        callbackApi = viewDbDetail;
      } else if (dataType === 'ftp') {
        callbackApi = viewFtpDetail;
      } else {
        callbackApi = viewFileDetail;
      }
      const response = yield call(callbackApi, payload.id);
      if (response && response.code < 300) {
        let params = {};
        switch (dataType) {
          case 'db':
            params = initDbParams();
            break;
          case 'ftp': {
            yield put({
              type: 'getCheckedKeys',
              payload: {
                params: response.result.data,
                dataType,
                type: response.result.data.datasourceDetailDto.type,
                alias: response.result.data.datasourceDetailDto.alias,
                oldName: response.result.data.name,
              },
            });
            break;
          }
          case 'file': {
            yield put({
              type: 'getFilelist',
              payload: {
                params: response.result.data,
                dataType,
                type: 'file',
                alias: '',
                oldName: response.result.data.name,
              },
            });
            break;
          }
        }
        //yield put({
        //  type: 'updateParams',
        //  payload: params,
        //});
        //yield put({
        //  type: 'updateDataType',
        //  payload: {
        //    dataType,
        //    type: 'file',
        //    alias: '',
        //    oldName: response.result.data.name,
        //  },
        //});
      }
    },
    *getFilelist({ payload }, { call, put }) {
      const response = yield call(initFileList, payload.params);
      if (response && response.code < 300) {
        let params = {};
        const fileAddDtoList = [];
        const { name, createUnit, describe, dutyName, dutyPhone, dutyPosition } = payload.params;
        response.result.datas.map(item => {
          return fileAddDtoList.push({
            id: item.id,
            uid: item.id,
            name: item.name,
            size: item.size,
            type: item.type,
            uploadTime: item.uploadTime,
            path: item.path,
          });
        });
        params = initFileParams();
        params = {
          ...params,
          name,
          createUnit,
          describe,
          dutyName,
          dutyPhone,
          dutyPosition,
          fileAddDtoList,
        };
        yield put({
          type: 'updateParams',
          payload: params,
        });
        yield put({
          type: 'updateDataType',
          payload: {
            dataType: payload.dataType,
            type: payload.type,
            alias: payload.alias,
            oldName: payload.oldName,
          },
        });
      }
    },
    *getCheckedKeys({ payload }, { call, put }) {
      const response = yield call(initFtpList, payload.params);
      if (response && response.code < 300) {
        const payloadParams = {
          checkedKeys: [],
          ftpfileAddDtoList: [],
        };
        response.result.datas.map(item => {
          const pathName = `${item.path}${item.name}`;
          payloadParams.checkedKeys.push(pathName);
          payloadParams.ftpfileAddDtoList.push({
            id: item.id,
            name: item.name,
            open: item.open,
            path: item.path,
            type: item.type,
          });
          return payloadParams;
        });
        yield put({
          type: 'connection',
          payload: {
            dataType: payload.dataType,
            connectParams: {
              type: payload.params.datasourceDetailDto.type,
              addr: payload.params.datasourceDetailDto.ip,
              port: payload.params.datasourceDetailDto.port,
              username: payload.params.datasourceDetailDto.username,
              password: payload.params.datasourceDetailDto.password,
            },
          },
        });
        yield put({
          type: 'addDefaultCheckedKeys',
          payload: payloadParams.checkedKeys,
        });
        yield put({
          type: 'setSyncPlans',
          payload: {
            ...payload,
            ftpfileAddDtoList: payloadParams.ftpfileAddDtoList,
          },
        });
      }
    },
    *setSyncPlans({ payload }, { call, put }) {
      const response = yield call(searchTask, payload);
      if (response && response.code < 300) {
        const { name, createUnit, describe, dutyName, dutyPhone, dutyPosition } = payload.params;
        const { stopNum, syncMode, syncRate, timeSet } = response.result.data;
        const params = {
          ...initFtpParams(),
          name,
          createUnit,
          describe,
          dutyName,
          dutyPhone,
          dutyPosition,
          ftpfileAddDtoList: payload.ftpfileAddDtoList,
          syncAddDto: {
            stopNum: JSON.stringify(stopNum),
            syncMode,
            syncRate,
            timeSet,
          },
        };
        yield put({
          type: 'updateParams',
          payload: params,
        });
        yield put({
          type: 'updateDataType',
          payload: {
            dataType: payload.dataType,
            type: payload.type,
            alias: payload.alias,
            oldName: payload.oldName,
          },
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
        stopNum: '5',
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
        oldName: payload.oldName,
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
        payload.data.map(item => {
          item.key = `${item.path}${item.name}`;
        });
        treeList = payload.data;
      } else {
        payload.data.map(item => {
          item.key = `${item.path}${item.name}`;
        });
        if (payload.treeNode.props) {
          payload.treeNode.props.dataRef.children = payload.data;
        } else {
          payload.treeNode.children = payload.data;
        }
        treeList = [...treeList];
      }
      console.log(treeList);
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
    addDefaultCheckedKeys(state, { payload }) {
      return {
        ...state,
        checkedKeys: [...payload],
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
