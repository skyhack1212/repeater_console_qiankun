import request from '@/utils/request'

// export function login(data) {
//   return request({
//     // url: '/vue-element-admin/user/login',
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

export function getProducts(userName) {
  return request({
    url: '/product/list',
    method: 'get',
    params: { userName }
  })
}

export function getServices(productIds) {
  return request({
    url: '/service/list',
    method: 'get',
    params: { productIds }
  })
}

export function getInterfaces(serviceIds) {
  return request({
    url: '/interface/list',
    method: 'get',
    params: { serviceIds }
  })
}

export function getFunctions(interfaceIds) {
  return request({
    url: '/function/list',
    method: 'get',
    params: { interfaceIds }
  })
}

export function getProductList(data) {
  return request({
    url: '/product/pageList',
    method: 'post',
    data
  })
}
export function getServiceList(data) {
  return request({
    url: '/service/pageList',
    method: 'post',
    data
  })
}
export function getInterfaceList(data) {
  return request({
    url: '/interface/pageList',
    method: 'post',
    data
  })
}
export function getFunctionList(data) {
  return request({
    url: '/function/pageList',
    method: 'post',
    data
  })
}

export function getProductById(id) {
  return request({
    url: '/product/detail',
    method: 'get',
    params: { id }
  })
}
export function getServiceById(id) {
  return request({
    url: '/service/detail',
    method: 'get',
    params: { id }
  })
}
export function getInterfaceById(id) {
  return request({
    url: '/interface/detail',
    method: 'get',
    params: { id }
  })
}
export function getFunctionById(id) {
  return request({
    url: '/function/detail',
    method: 'get',
    params: { id }
  })
}

export function addOrUpdateProduct(data) {
  return request({
    url: '/product/addOrUpdate',
    method: 'post',
    data
  })
}
export function addOrUpdateService(data) {
  return request({
    url: '/service/addOrUpdate',
    method: 'post',
    data
  })
}
export function addOrUpdateInterface(data) {
  return request({
    url: '/interface/addOrUpdate',
    method: 'post',
    data
  })
}
export function addOrUpdateFunction(data) {
  return request({
    url: '/function/addOrUpdate',
    method: 'post',
    data
  })
}

export function deleteProduct(id) {
  return request({
    url: '/product/delete',
    method: 'get',
    params: { id }
  })
}

export function deleteService(id) {
  return request({
    url: '/service/delete',
    method: 'get',
    params: { id }
  })
}

export function deleteInterface(id) {
  return request({
    url: '/interface/delete',
    method: 'get',
    params: { id }
  })
}

export function deleteFunction(id) {
  return request({
    url: '/function/delete',
    method: 'get',
    params: { id }
  })
}
