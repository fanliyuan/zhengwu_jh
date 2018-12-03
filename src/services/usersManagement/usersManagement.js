import { stringify } from 'qs';
import request from '@/utils/request';

// 获取用户列表
export async function userList(params) {
  return request(`/api/mgr/userList?${stringify(params)}`);
}

// 新建用户
export async function userAdd(params) {
  return request(`/api/mgr/add1`, {
    method: 'POST',
    body: params,
  });
}

// 启用用户
export async function userUnfreeze(params) {
  return request(`/api/mgr/unfreeze1/${params.id}`, {
    method: 'POST',
    body: params,
  });
}

// 冻结用户
export async function userFreeze(params) {
  return request(`/api/mgr/freeze1/${params.id}`, {
    method: 'POST',
    body: params,
  });
}

// 删除用户
export async function userDelete(params) {
  return request(`/api/mgr/delete1/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 用户详情
export async function userDetail(params) {
  return request(`/api/mgr/userInfo?${stringify(params)}`);
}

// 用户编辑
export async function userEdit(params) {
  return request(`/api/mgr/edit1`, {
    method: 'PUT',
    body: params,
  });
}

// 角色列表
export async function roleList() {
  return request(`/api/role/roleList`);
}

// 设置用户角色
export async function roleUpdate(params) {
  return request(`/mgr/setRole1`, {
    method: 'POST',
    body: params,
  });
}

// 重置密码
export async function resetPwd(params) {
  return request(`/api/mgr/resetPwd1/${params.id}`, {
    method: 'POST',
    body: params,
  });
}

// 修改密码
export async function changePwd(params) {
  return request(`/api/mgr/changePwd1`, {
    method: 'POST',
    body: params,
  });
}
