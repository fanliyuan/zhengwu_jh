import { stringify } from 'qs';
import request from '@/utils/request';

// 搜索资源列表
export async function getSourceList(params) {
  return request(`/api/api/v2/zhengwu/swap/datasources?${stringify(params)}`);
}

// 新建数据源
export async function getDBInfo(params) {
  return request('/api/api/v2/zhengwu/swap/datasource', {
    method: 'POST',
    body: params,
  });
}

// 删除数据源
export async function deleteDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 修改数据源
export async function updateDataSource(params) {
  return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}
