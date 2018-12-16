import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login1', {
    method: 'POST',
    body: params,
  });
}

export async function loginOut() {
  return request(`/api/logout1`);
}
