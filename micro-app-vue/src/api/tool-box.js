import request from '@/utils/request'

export function getTableNum(userIds) {
  return request({
    url: '/tc/getTableNum',
    method: 'get',
    params: { userIds }
  })
}

export function createOrderByUserId(data) {
  return request({
    url: '/tc/createOrder',
    method: 'post',
    data
  })
}

export function getAmortizeDBNum(payIds) {
  return request({
    url: '/amortize/getAmortizeDBNum',
    method: 'get',
    params: { payIds }
  })
}
