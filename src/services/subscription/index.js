import { stringify } from 'qs';
import request from '@/utils/request';

export async function getDBList(params) {
  return request(`/api/getDBList?${stringify(params)}`);
}

export async function getFileList(params) {
  return request(`/api/getFileList?${stringify(params)}`);
}

// 资源列表
export async function getResourceList(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/list?${stringify(params)}`);
}

// 获取所有发布节点
export async function getAllNode() {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/allNode`);
}

// 资源详细信息
export async function getResourceDetails(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/resourceDetails?${stringify(params)}`);
}

// 订阅操作
export async function subscribe(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/subscribe`, {
    method: 'POST',
    body: params,
  });
}
// 获取订阅列表
export async function getSubList(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/subscribeList?${stringify(params)}`);
}

// 停止订阅的 采集
export async function stopSubTask(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/stop`, {
    method: 'POST',
    body: params,
  });
}

// 启动订阅的 采集
export async function runSubTask(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/run`, {
    method: 'POST',
    body: params,
  });
}

// 获取 审核日志列表
export async function getAssessLogs(params) {
  return request(`/api/api/v2/zhengwu/swap/resourceBazaar/reviewLog?${stringify(params)}`);
}
