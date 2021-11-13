import request from '@/utils/request'

// export function login(data) {
//   return request({
//     // url: '/vue-element-admin/user/login',
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }
export function login(userName) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/user/login',
    method: 'get',
    params: { userName }
  })
}

export function getInfo(userName) {
  return request({
    url: '/user/getUserInfo',
    method: 'get',
    params: { userName }
  })
}

export function getUserToken(userName) {
  return request({
    url: '/user/token',
    method: 'get',
    params: { userName }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    // method: 'post'
    method: 'get'
  })
}
