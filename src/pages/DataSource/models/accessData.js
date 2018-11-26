import {
  isSameNameData,
  viewDataSource,
  mysqlDbList,
  mysqlTableList,
  mysqlColumnList,
  accessDataSource,
  accessFtp,
  accessFile,
  ftpDataList,
  ftpDataTree,
  sftpDataList,
  sftpDataTree,
  viewDbDetail,
  viewFileDetail,
  viewFtpDetail,
  initFileList,
  initFtpList,
  viewDbStruct,
  updateDb,
  updateFile,
  updateFtp,
  searchTask,
  viewDbDetailCurrent,
  viewDbStructCurrent,
  viewFtpDetailCurrent,
  initFtpListCurrent,
  getSyncBasic,
  viewFileDetailCurrent,
  initFileListCurrent,
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
    ip: '',
    port: '',
    username: '',
    password: '',
    oldName: '',
    status: '',
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
    currentDetail: {},
    currentSync: {},
    currentList: [],
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
              default:
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
            dataType,
            type,
            alias,
            ip,
            port,
            username,
            password,
            oldName: '',
          },
        });
        if (dataType !== 'file') {
          yield put({
            type: 'connection',
            payload: {
              dataType,
              connectParams: {
                type,
                addr: ip,
                port,
                username,
                password,
              },
            },
          });
        }
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
      } else {
        message.error(`${response.message}，结构树加载失败！`);
      }
    },
    *setTreeData({ payload }, { call, put }) {
      let callbackApi;
      if (payload.treeType === 'ftp') {
        callbackApi = ftpDataTree;
      } else {
        callbackApi = sftpDataTree;
      }
      const response = yield call(callbackApi, payload.params);
      if (response && response.code < 300) {
        yield put({
          type: 'updateTreeList',
          payload: {
            data: response.result.datas,
            type: payload.type,
          },
        });
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
    *reset({ payload }, { put }) {
      yield put({
        type: 'resetParams',
        payload,
      });
    },
    *connection({ payload }, { put }) {
      const treeType = payload.connectParams.type;
      if (payload.dataType === 'db') {
        yield put({
          type: 'setDbList',
          payload: {
            addr: payload.connectParams.addr,
            port: payload.connectParams.port,
            username: payload.connectParams.username,
            password: payload.connectParams.password,
          },
        });
      } else if (payload.dataType === 'ftp') {
        if (payload.getAllTree) {
          yield put({
            type: 'setTreeData',
            payload: {
              params: {
                addr: payload.connectParams.addr,
                port: payload.connectParams.port,
                username: payload.connectParams.username,
                password: payload.connectParams.password,
              },
              type: 'create',
              treeType,
            },
          });
        } else {
          yield put({
            type: 'setTreeList',
            payload: {
              params: {
                addr: payload.connectParams.addr,
                port: payload.connectParams.port,
                username: payload.connectParams.username,
                password: payload.connectParams.password,
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
      } else if (payload.routeName && payload.routeName === 'managementUpdate') {
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
      return false;
    },
    *testName({ payload }, { call, put }) {
      if (payload.oldName && payload.oldName !== '' && payload.oldName === payload.values.name) {
        if (payload.dataType !== 'file') {
          yield put({
            type: 'updateParams',
            payload: payload.values,
          });
          yield put({
            type: 'next',
            payload: payload.values,
          });
        } else {
          yield put({
            type: 'submit',
            payload,
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
            payload,
          });
        }
      }
      return false;
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
        yield put({
          type: 'updateStatus',
          payload: response.result.data.status,
        });
        switch (dataType) {
          case 'db':
            yield put({
              type: 'connection',
              payload: {
                dataType,
                connectParams: {
                  type: response.result.data.datasourceDetailDto.type,
                  addr: response.result.data.datasourceDetailDto.ip,
                  port: response.result.data.datasourceDetailDto.port,
                  username: response.result.data.datasourceDetailDto.username,
                  password: response.result.data.datasourceDetailDto.password,
                },
              },
            });
            yield put({
              type: 'getStructs',
              payload: {
                params: response.result.data,
                dataType,
                type: response.result.data.datasourceDetailDto.type,
                alias: response.result.data.datasourceDetailDto.alias,
                oldName: response.result.data.name,
              },
            });
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
          default:
            break;
        }
      }
    },
    *getFilelist({ payload }, { call, put }) {
      const response = yield call(initFileList, payload.params);
      if (response && response.code < 300) {
        let params = {};
        const fileAddDtoList = [];
        const { name, createUnit, describe, dutyName, dutyPhone, dutyPosition } = payload.params;
        response.result.datas.map(item =>
          fileAddDtoList.push({
            id: item.id,
            uid: item.id,
            name: item.name,
            uname: item.name,
            size: item.size,
            type: item.type,
            uploadTime: item.uploadTime,
            path: item.path,
          })
        );
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
            getAllTree: true,
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
    *getStructs({ payload }, { call, put }) {
      const response = yield call(viewDbStruct, payload.params);
      if (response && response.code < 300) {
        const payloadParams = {
          structAddDtoList: [],
        };
        response.result.datas.map(item => {
          payloadParams.structAddDtoList.push({
            id: item.id,
            columnName: item.columnName,
            columnType: item.columnType,
            note: item.note,
            primaryKey: item.primaryKey,
          });
          return payloadParams;
        });
        yield put({
          type: 'setSyncPlans',
          payload: {
            ...payload,
            structAddDtoList: payloadParams.structAddDtoList,
          },
        });
      }
    },
    *setSyncPlans({ payload }, { call, put }) {
      const { dataType } = payload;
      const response = yield call(searchTask, payload);
      if (response && response.code < 300) {
        let params;
        const { stopNum, syncMode, syncRate, timeSet } = response.result.data;
        if (dataType === 'ftp') {
          params = {
            ...initFtpParams(),
            name: payload.params.name,
            createUnit: payload.params.createUnit,
            describe: payload.params.describe,
            dutyName: payload.params.dutyName,
            dutyPhone: payload.params.dutyPhone,
            dutyPosition: payload.params.dutyPosition,
            ftpfileAddDtoList: payload.ftpfileAddDtoList,
            syncAddDto: {
              stopNum: JSON.stringify(stopNum),
              syncMode,
              syncRate,
              timeSet,
            },
          };
        } else {
          params = {
            ...initDbParams(),
            name: payload.params.name,
            createUnit: payload.params.createUnit,
            describe: payload.params.describe,
            dutyName: payload.params.dutyName,
            dutyPhone: payload.params.dutyPhone,
            dutyPosition: payload.params.dutyPosition,
            structAddDtoList: payload.structAddDtoList,
            appsysName: payload.params.appsysName,
            dbName: payload.params.dbName,
            tableName: payload.params.tableName,
            tableNote: payload.params.tableNote,
            syncAddDto: {
              stopNum: JSON.stringify(stopNum),
              syncMode,
              syncRate,
              timeSet,
            },
          };
        }
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
            ip: payload.params.datasourceDetailDto.ip,
            port: payload.params.datasourceDetailDto.port,
            username: payload.params.datasourceDetailDto.username,
            password: payload.params.datasourceDetailDto.password,
            oldName: payload.oldName,
          },
        });
      }
    },
    *getCurrentdetail({ payload }, { call, put }) {
      let callbackApi;
      const { dataType } = payload;
      if (dataType === 'db') {
        callbackApi = viewDbDetailCurrent;
      } else if (dataType === 'ftp') {
        callbackApi = viewFtpDetailCurrent;
      } else {
        callbackApi = viewFileDetailCurrent;
      }
      const response = yield call(callbackApi, payload.id);
      if (response && response.code < 300) {
        yield put({
          type: 'updateCurrentDetail',
          payload: response.result.data,
        });
      }
    },
    *getCurrentSync({ payload }, { call, put }) {
      const response = yield call(getSyncBasic, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'updateCurrentSync',
          payload: response.result.data,
        });
      }
    },
    *getCurrentList({ payload }, { call, put }) {
      let callbackApi;
      const { dataType } = payload;
      if (dataType === 'db') {
        callbackApi = viewDbStructCurrent;
      } else if (dataType === 'ftp') {
        callbackApi = initFtpListCurrent;
      } else {
        callbackApi = initFileListCurrent;
      }
      const response = yield call(callbackApi, payload);
      if (response && response.code < 300) {
        yield put({
          type: 'updateCurrentList',
          payload: response.result.datas,
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
      const syncAddDto = {
        stopNum: '5',
        syncMode: '增量',
        syncRate: '定时',
        timeSet: '-分钟',
      };
      return {
        ...state,
        params: {
          ...state.params,
          syncAddDto,
        },
        current: state.current - 1,
      };
    },
    updateCurrentDetail(state, { payload }) {
      return {
        ...state,
        currentDetail: payload,
      };
    },
    updateCurrentSync(state, { payload }) {
      return {
        ...state,
        currentSync: payload,
      };
    },
    updateCurrentList(state, { payload }) {
      return {
        ...state,
        currentList: payload,
      };
    },
    updateStatus(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
    updateDataType(state, { payload }) {
      return {
        ...state,
        dataType: payload.dataType,
        type: payload.type,
        alias: payload.alias,
        ip: payload.ip,
        port: payload.port,
        username: payload.username,
        password: payload.password,
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
        treeList = payload.data;
      } else {
        const treeNodes = payload.treeNode;
        treeNodes.props.dataRef.children = payload.data;
        treeList = [...treeList];
      }
      return {
        ...state,
        treeList,
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
      return {
        ...state,
        params: {
          ...state.params,
          structAddDtoList: payload,
        },
      };
    },
    addFtpfileAddDtoList(state, { payload }) {
      return {
        ...state,
        params: {
          ...state.params,
          ftpfileAddDtoList: payload,
        },
      };
    },
    addDefaultCheckedKeys(state, { payload }) {
      return {
        ...state,
        checkedKeys: [...payload],
      };
    },
    resetTableColumnList(state) {
      return {
        ...state,
        tableList: [],
        columnList: [],
      };
    },
    resetStructAddDtoList(state) {
      return {
        ...state,
        params: {
          ...state.params,
          structAddDtoList: [],
        },
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
