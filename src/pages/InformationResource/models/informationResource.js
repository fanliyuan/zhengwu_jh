import { message } from 'antd';
import { routerRedux } from 'dva/router';

// import apis from '../../../api'
import {
  getSourceClassfiyList,
  addResource,
  getResourceLists,
  checkIsSameName,
  openDataById,
  updateOpenData,
  getResourceDetails,
  getConnectList,
  getConnectFileList,
  saveMountData,
  getResourceItems,
  deleteresource,
  updateResource,
} from '@/services/informationResource/informationResource';

// const { getSourceList, getDBInfo } = apis
export default {
  namespace: 'informationResource',

  state: {
    classfiyList: [],
    resourceList: [],
    pagination: {},
    sameMsg: false,
    openData: {},
    DBInfo: {}, // 这个我也不知道有啥用，先放着吧
    resoutceDetail: {},
    connectList: [],
    connectPagination: {},
    connectFileList: [],
    connectFilePagination: {},
    itemList: [],
    connectItemList: [],
    resourceDetail: {},
    // forEditFile:[],
  },

  effects: {
    *getClassfiyList(_, { call, put }) {
      const response = yield call(getSourceClassfiyList);
      try {
        if (+response.code === 200) {
          yield put({
            type: 'queryClassify',
            payload: response.result,
          });
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *addResources({ payload }, { call, put }) {
      const response = yield call(addResource, payload);
      try {
        if (+response.code === 201) {
          message.success(response.message);
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *editResources({ payload }, { call, put }) {
      const response = yield call(updateResource, payload);
      try {
        if (+response.code === 201) {
          message.success(response.message);
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *deleteResources({ payload }, { call, put }) {
      let response = yield call(deleteresource, payload);
      response = JSON.parse(response);
      try {
        if (+response.code === 201) {
          message.success(response.message);
          yield put({
            type: 'getResourceList',
            payload: { pageNum: 1, pageSize: 10, mount: false },
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getResourceList({ payload }, { call, put }) {
      const response = yield call(getResourceLists, payload);
      try {
        if (+response.code === 200) {
          const pagination =
            response.result.totalCounts > 9
              ? {
                  current: payload.pageNum ? payload.pageNum : 1,
                  pageSize: payload.pageSize ? payload.pageSize : 10,
                  total: response.result.totalCounts,
                }
              : false;
          yield put({
            type: 'queryList',
            payload: { list: response.result.datas, pagination },
          });
        }
      } catch (err) {
        console.log(err); // eslint-disable-line
      }
    },
    *isNameSame({ payload }, { call, put }) {
      const response = yield call(checkIsSameName, payload);
      try {
        if (+response.code === 200) {
          console.log(response.message); // eslint-disable-line
          yield put({
            type: 'isSame',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *openShare({ payload }, { call, put }) {
      const response = yield call(openDataById, payload);
      try {
        if (+response.code === 200) {
          // message.success(response.message);
          yield put({
            type: 'getOpenData',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *submitOpenShare({ payload }, { call, put }) {
      const response = yield call(updateOpenData, payload);
      try {
        if (+response.code === 202) {
          message.success(response.message);
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else if (+response.code === 201) {
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getResourcesEdit({ payload }, { call, put }) {
      const response = yield call(getResourceDetails, payload);
      try {
        if (+response.code === 200) {
          yield put({
            type: 'getResourceDetail',
            payload: response.result.data,
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *reWriteItemList({ payload }, { call, put }) {
      const response = yield call(getResourceItems, payload);
      try {
        if (+response.code === 200) {
          yield put({
            type: 'getItemList',
            payload: response.result.datas,
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getResources({ payload }, { call, put }) {
      const response = yield call(getResourceDetails, payload);
      try {
        if (+response.code === 200) {
          if (response.result.data && response.result.data.mount) {
            if (response.result.data.mountType === 'ftp') {
              yield put({
                type: 'getFileList',
                payload: {
                  id: response.result.data.mountId,
                  pagination: { pageNum: 1, pageSize: 10 },
                  type: 'ftp',
                  type1: 'ftpfile',
                },
              });
              // yield put({
              //   type: 'getResourceDetail',
              //   payload: response.result.data,
              // });
            } else if (response.result.data.mountType === 'file') {
              yield put({
                type: 'getFileList',
                payload: {
                  id: response.result.data.mountId,
                  pagination: { pageNum: 1, pageSize: 10 },
                  type: 'file',
                  type1: 'file',
                },
              });
              // yield put({
              //   type: 'getResourceDetail',
              //   payload: response.result.data,
              // });
            } else if (response.result.data.mountType === 'db') {
              yield put({
                type: 'getFileList',
                payload: {
                  id: response.result.data.mountId,
                  pagination: { pageNum: 1, pageSize: 10 },
                  type: 'db',
                  type1: 'struct',
                },
              });
            }
            // yield put({
            //   type: 'reWriteItemList',
            //   payload: { id: payload.id, pageNum: 1, pageSzie: 10 },
            // });
            // yield put({
            //   type: 'getConnectItemList',
            //   payload: response.result.data,
            // });
          }
          yield put({
            type: 'getResourceDetail',
            payload: response.result.data,
          });
          yield put({
            type: 'reWriteItemList',
            payload: { id: payload.id }, // , pageNum: 1, pageSize: 10
          });
          // yield put({
          //   type: 'getConnectItemList',
          //   payload: response.result.data,
          // });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *saveMountData({ payload }, { call, put }) {
      const response = yield call(saveMountData, payload);
      try {
        if (+response.code === 201) {
          // yield put({
          //   type: 'getResourceDetail',
          //   payload: response.result.data,
          // });
          message.success(response.message);
          yield put(routerRedux.push('/informationResource/sourceManagement'));
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getFileList({ payload }, { call, put }) {
      const response = yield call(getConnectFileList, payload);
      try {
        if (+response.code === 200) {
          const pagination =
            response.result.totalCounts > 9
              ? {
                  current: payload.pageNum,
                  pageSize: payload.pageSize,
                  total: response.result.totalCounts,
                }
              : false;
          yield put({
            type: 'FileList',
            payload: { list: response.result.datas, pagination },
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
    *getConnectListss({ payload }, { call, put }) {
      const response = yield call(getConnectList, payload);
      try {
        if (+response.code === 200) {
          const pagination =
            response.result.totalCounts > 9
              ? {
                  current: response.result.number + 1,
                  pageSize: response.result.size,
                  total: response.result.totalCounts,
                }
              : false;
          yield put({
            type: 'getConnectLists',
            payload: { list: response.result.datas, pagination },
          });
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    },
  },

  reducers: {
    queryClassify(state, { payload }) {
      return {
        ...state,
        classfiyList: payload,
      };
    },
    queryList(
      state,
      {
        payload: { list, pagination },
      }
    ) {
      return {
        ...state,
        resourceList: list,
        pagination,
      };
    },
    isSame(state, { payload }) {
      return {
        ...state,
        sameMsg: payload,
      };
    },
    getOpenData(state, { payload }) {
      return {
        ...state,
        openData: payload,
      };
    },
    getResourceDetail(state, { payload }) {
      return {
        ...state,
        resourceDetail: payload,
      };
    },
    getConnectLists(state, { payload }) {
      return {
        ...state,
        connectList: payload.list,
        connectPagination: payload.pagination,
      };
    },
    FileList(state, { payload }) {
      return {
        ...state,
        connectFileList: payload.list,
        connectFilePagination: payload.pagination,
        // forEditFile:payload.forEdit,
      };
    },
    getItemList(state, { payload }) {
      return {
        ...state,
        itemList: payload,
      };
    },
    getConnectItemList(state, { payload }) {
      return {
        ...state,
        connectItemList: payload,
      };
    },
    reset(state) {
      return {
        ...state,
        classfiyList: [],
        resourceList: [],
        pagination: {},
        sameMsg: false,
        openData: {},
        DBInfo: {},
        resoutceDetail: {},
        connectList: [],
        connectPagination: {},
        connectFileList: [],
        connectFilePagination: {},
        itemList: [],
        connectItemList: [],
        resourceDetail: {},
      };
    },
  },
};
