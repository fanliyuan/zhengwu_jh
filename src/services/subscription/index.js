import { stringify } from 'qs';
import request from '@/utils/request';

export async function getDBList(params) {
  return request(`/api/getDBList?${stringify(params)}`);
}

export async function getFileList(params) {
  return request(`/api/getFileList?${stringify(params)}`);
}
