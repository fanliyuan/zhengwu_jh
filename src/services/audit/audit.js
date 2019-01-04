import { stringify } from 'qs';
import request from '@/utils/request';

// 查询登录审计
export async function loginAudit(params) {
  return request(`/api/loginAudit1?${stringify(params)}`);
}

// 查询登录日志
export async function loginLog(params) {
  return request(`/api/loginLog1?${stringify(params)}`);
}

// 查询操作日志
export async function operateAudit(params) {
  return request(`/api/operateAudit1?${stringify(params)}`);
}
