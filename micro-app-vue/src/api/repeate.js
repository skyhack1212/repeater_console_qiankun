import request from '@/utils/request'

export function online_search (parameter) {
  return request({
    url:  '/es/searchList',
    method: 'post',
    data: parameter
  })
}

export function online_replay (parameter) {
  return request({
    url:  '/online/replay',
    method: 'post',
    data: parameter
  })
}

export function online_detail(parameter) {
  return request({
    url: '/es/searchById',
    method: 'get',
    params: parameter
  })
}

export function config_search(parameter) {
  return request({
    url: '/config/search',
    method: 'post',
    data: parameter
  })
}

export function config_add(parameter) {
  return request({
    url: '/config/add',
    method: 'post',
    data: parameter
  })
}

export function config_update(parameter) {
  return request({
    url: '/config/update',
    method: 'post',
    data: parameter
  })
}

export function config_detail(parameter) {
  return request({
    url: '/config/detail',
    method: 'get',
    params: parameter
  })
}

export function config_push(parameter) {
  return request({
    url: '/config/push',
    method: 'post',
    data: parameter
  })
}

export function module_search(parameter) {
  return request({
    url: '/module/search',
    method: 'post',
    data: parameter
  })
}

export function module_search_by_appNameAndIp(parameter) {
  return request({
    url: '/module/searchByAppNameAndIp',
    method: 'post',
    data: parameter
  })
}

export function module_frozen(parameter) {
  return request({
    url: '/module/frozen',
    method: 'get',
    params: parameter
  })
}

export function module_active(parameter) {
  return request({
    url: '/module/active',
    method: 'get',
    params: parameter
  })
}

export function module_reload(parameter) {
  return request({
    url: '/module/reload',
    method: 'get',
    params: parameter
  })
}

export function module_add(parameter) {
  return request({
    url: '/module/add',
    method: 'post',
    data: parameter
  })
}

export function scfRepeaterCliHandle(parameter) {
  return request({
    url: '/module/scfRepeaterCliHandle',
    method: 'post',
    data: parameter
  })
}

export function module_update(parameter) {
  return request({
    url: '/module/update',
    method: 'post',
    data: parameter
  })
}

export function module_detail(parameter) {
  return request({
    url: '/module/detail',
    method: 'get',
    params: parameter
  })
}