import Cookies from 'js-cookie'
import { login } from '@/api/user'
const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

// 调用后端接口拿到access_token
export function getAccessToken(params) {
  return login(params)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
