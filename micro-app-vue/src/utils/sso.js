import x2js from 'x2js'
import axios from 'axios'
const sysConfig = require('@/config/sysConfig')
import { getToken, setToken } from '@/utils/auth'
import { login, getInfo } from '@/api/user'
import store from '../store'
import router from '../router'
const casServerUrl = sysConfig.casServerUrl
const sysDomain = sysConfig.sysDomain
const casLoginUrl = `${casServerUrl}/login`
export default {

  enableCasAuth() {
    // const token = getToken()
    // if (token) {
    //   return
    // }

    if (this.isCasCallback()) {
      const ticket = this.getTicket()
      this.getAuthInfo(ticket).then(res => {
        // console.log(res)
        if (res.success) {
          const user_oa_name = res.username.__text
          localStorage.setItem('name', user_oa_name)
          this.login(user_oa_name)
        } else {
          return this.toAuth()
        }
      })
    } else {
      return this.toAuth()
    }
  },
  toAuth() {
    location.href = `${casLoginUrl}?service=${sysDomain}`
  },
  toIndex(path) {
    location.href = sysDomain + '/#/' + path
  },
  getTicket() {
    var reg = new RegExp('(^|&)ticket=([^&]*)(&|$)', 'i')
    // console.log(reg)
    var r = window.location.search.substr(1).match(reg)
    // todo
    // const url = window.location.search.substr(0).match(reg)
    // console.log(url)
    // window.location.href = '/'
    if (r != null) return unescape(r[2])
    return null
  },
  // delTickety(url) {
  //
  // }
  getAuthInfo(ticket) {
    return axios.get(`/cas/serviceValidate?service=${sysDomain}&ticket=${ticket}`).then(res => {
      // eslint-disable-next-line new-cap
      const x2j = new x2js()
      var info = x2j.xml2js(res.data)
      if (info.serviceResponse.authenticationSuccess) {
        return {
          'success': true,
          'username': info.serviceResponse.authenticationSuccess.user
        }
      } else {
        return {
          'success': false,
          'username': ''
        }
      }
    })
  },
  isCasCallback() {
    const url = window.location.href
    // eslint-disable-next-line eqeqeq
    return url.indexOf(sysDomain + '/?ticket=') != -1
    // console.log(url)
    // return url
  },
  logout() {
    location.href = `${casServerUrl}/logout?service=${sysDomain}`
  },
  getUserByUserOaName(user_oa_name) {
    // todo
    // return axios.post(`http://[后台服务地址]/user/token?userCode=${user_oa_name}`)
    // return axios.get(`http://localhost:8081/user/token`)
    return getInfo(user_oa_name)
    // 返回的结构大概想这样：
    // let data = {
    //   code: 1,
    //   token: 'admin-token'
    // }
  },
  login(user_oa_name) {
    // this.getUserByUserOaName(user_oa_name)
    // eslint-disable-next-line no-undef
    login(user_oa_name)
      .then(async(response) => {
        const data = response.data
        // console.log(data)
        // const data = {
        //   code: 1,
        //   token: 'admin-token'
        // }
        // eslint-disable-next-line eqeqeq
        if (data.code == 200) {
          const token = data.data.token
          setToken(token)
          axios.defaults.headers.common['token'] = getToken()
          store.commit('user/SET_TOKEN', token)
          store.commit('user/SET_NAME', user_oa_name)
          store.commit('user/SET_ROLES', 'admin')
          // const {
          //   roles
          // } = await store.dispatch('user/getInfo')
          // 为了方便，直接给予ADMIN权限
          const roles = ['admin']
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
        } else {
          router.push({
            path: '/401'
          })
        }
      })
  }
}

