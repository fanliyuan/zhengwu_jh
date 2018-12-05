import { stringify } from 'qs';
import request from '@/utils/request';

// 查询细目列表
export async function getSourceClassfiyList() {
  return request(`/api/api/v2/zhengwu/swap/resource/types`);
}

// 新建资源
export async function addResource(params) {
  return request('/api/api/v2/zhengwu/swap/resource', {
    method: 'POST',
    body: params,
  });
}

// 查询资源列表
export async function getResourceLists(params) {
  return request(`/api/api/v2/zhengwu/swap/resources?${stringify(params)}`);
}

// 查询资源名称重名
export async function checkIsSameName(params) {
  return request(`/api/api/v2/zhengwu/swap/resource/name?${stringify(params)}`);
}

// 开放门户得到回填数据
export async function openDataById(params) {
  return request(`/api/api/v2/zhengwu/swap/resource/${params}/shareopen`);
}

// 提交开放门户数据
export async function updateOpenData(params) {
  return request(`/api/api/v2/zhengwu/swap/resource/${params.id}/shareopen`, {
    method: 'PUT',
    body: params.shareopenEditDto,
  });
}

// 关联数据-得到资源信息
export async function getResourceDetail(params) {
  return request(`/api/api/v2/zhengwu/swap/resource/${params.id}`);
}

// 得到要挂接数据的列表
export async function getConnectList(params) {
  return request(`/api/api/v2/zhengwu/swap/datas?${stringify(params)}`);
}

// // 删除数据源
// export async function deleteDataSource(params) {
//   return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
//     method: 'DELETE',
//     body: params,
//   });
// }

// // 修改数据源
// export async function updateDataSource(params) {
//   return request(`/api/api/v2/zhengwu/swap/datasource/${params.id}`, {
//     method: 'PUT',
//     body: params,
//   });
// }
