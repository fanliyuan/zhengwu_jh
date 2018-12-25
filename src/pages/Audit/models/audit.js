import { message } from 'antd';
// import apis from '@/services/'

// const {  } = apis

// FIXME: 假数据,需要删除
const loginDataListFakeer = [
  {
    userName: 'zhangsan',
    realName: '张三',
    loginTime: '2018-12-12 12:12:12',
    loginIpAddress: '233.233.223.223',
    result: 1,
    index: 1,
  },
];

const getLoginDataList = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(loginDataListFakeer);
    }, 1000);
  });

const operationDataListFaker = [
  {
    userName: 'lisisi',
    realName: '李四四',
    module: 'node',
    operationType: 'add',
    time: '2018-11-11 12:12:12',
    ipAddress: '212.212.122.122',
    detail: '李四四 新建了 税务局节点',
    index: 1,
  },
];

const getOperationDataList = async () => {
  await setTimeout(() => {}, 1000);
  return operationDataListFaker;
};

export default {
  namespace: 'audit',

  state: {
    loginDataList: [],
    loginPagination: {},
    operationDataList: [],
    operationPagination: {},
  },

  effects: {
    *getLoginDataList({ payload = {} }, { call, put }) {
      // eslint-disable-line
      let response;
      let loginDataList = [];
      try {
        response = yield call(getLoginDataList, {});
        loginDataList = response;
        // TODO: 这里用 用参数 调用查询方法
        // const { datas, total = 0, pageSize = 10, pageNum: current = 1 } = response.result
        // const pagination = {total, pageSize, current}
        // if (+response.code === 0) {
        //   loginDataList = datas
        // } else {
        //   throw response.msg
        // }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line
          console.log(error);
        } else {
          message.error(error || '操作失败');
        }
      } finally {
        yield put({ type: 'saveLoginDataList', payload: loginDataList });
      }
    },
    *getOperationDataList({ payload = {} }, { call, put }) {
      // eslint-disable-line
      let response;
      let operationDataList = [];
      try {
        response = yield call(getOperationDataList, {});
        operationDataList = response;
        // TODO: 这里用 用参数 调用查询方法
        // const { datas, total = 0, pageSize = 10, pageNum: current = 1 } = response.result
        // const pagination = {total, pageSize, current}
        // if (+response.code === 0) {
        //   dataList = datas
        // } else {
        //   throw response.msg
        // }
      } catch (error) {
        if (error instanceof Error) {
          // eslint-disable-next-line
          console.log(error);
        } else {
          message.error(error || '操作失败');
        }
      } finally {
        yield put({ type: 'saveOperationDataList', payload: operationDataList });
      }
    },
  },

  reducers: {
    saveLoginDataList(state, { payload: loginDataList }) {
      return {
        ...state,
        loginDataList,
      };
    },
    saveOperationDataList(state, { payload: operationDataList }) {
      return {
        ...state,
        operationDataList,
      };
    },
  },
};
