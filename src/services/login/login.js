import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login1', {
    method: 'POST',
    body: params,
  });
}
