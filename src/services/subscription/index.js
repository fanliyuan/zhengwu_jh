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
