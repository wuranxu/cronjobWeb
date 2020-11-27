import request from '@/utils/request';

const URL = "http://localhost:9999"

export async function fakeAccountLogin(params) {
  return request(`${URL}/api/login/account`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
