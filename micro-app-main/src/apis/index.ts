import axios from "axios";
axios.defaults.withCredentials = true; //设置cookie验证
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; //使用XMLHttpRequest方式请求

const instance = axios.create({
  baseURL: "http://xxx.xx.xx",
});

instance.interceptors.response.use(reply => reply.data);

/**
 * 快速登录
 */
export const ApiLoginQuickly = () => {
  return instance.post("/member", {
    query: "{ loginQuickly { token } }",
  });
};

//请求拦截器的处理, 用于处理config
axios.interceptors.request.use(function (config) {
  let moreConfig = {
    crossDomain: true, //支持跨域配置
  }
  config = Object.assign(config, moreConfig);
  console.log("请求跨域配置数据: " + JSON.stringify(config))
  return config
}, function (error) { //错误拦截处理
  console.error("请求错误处理: " + JSON.stringify(error))
  return Promise.reject(error);
});

//响应拦截处理, 两个入参, 第一个是响应处理, 第二个是 错误处理
axios.interceptors.response.use(
    response => {//不做任何处理, 直接返回
      console.log('正确数据: ' + JSON.stringify(response))
      return response
    },
    err => {//仅处理302错误, 其他不做处理
      console.error("错误数据: " + JSON.stringify(err))
      return Promise.reject(err.response).catch(err=>{//通过Promise 异步处理302错误
        console.error("Promis 错误: " + JSON.stringify(err))
        if(err.status!=undefined&&err.status==302) {
          let currentPath = document.location.href
              .replace('#', 'sqc-hash')
              .replace('?', 'sqc-ques')
              .replace(/=/g, 'sqc-eqs')
              .replace(/&/g, 'sqc-and')
              .replace('https', 'sqc-hps')
              .replace('http', 'sqc-hp');
          location.href = 'https://xxx.xx.xx/gsso/login?service='
              + encodeURIComponent( 'http://xxx.xx.xx:8088/home/login?redirectPage=' + currentPath);

        }
      })
    }
)

const CancelToken = axios.CancelToken;
// @ts-ignore
let httpRequestList = [];
const sysConfig = require('@/config/sysConfig')
const casServerUrl = sysConfig.casServerUrl
const sysDomain = sysConfig.sysDomain

export default {
  // const ticket = this.getTicket()
  // this.getAuthInfo(ticket).then(res => {
  //   // console.log(res)
  //   if (res.success) {
  //     const user_oa_name = res.username.__text
  //     localStorage.setItem('name', user_oa_name)
  //     this.login(user_oa_name)
  //   } else {
  //     // @ts-ignore
  //     return this.toAuth()
  //   }
  // }),
  toAuth() {
    location.href = `${casServerUrl}?service=${sysDomain}`
  }
}

//post请求处理, data用qs.stringify()序列化
// @ts-ignore
export const postRequest = ({url,tag = "",params = {},config = {}}) => {
  if (!url) return;
  let realUrl = url;
  let defaultConfig = {
    method: 'post',
    url: realUrl + (tag ? `/${tag}` : '') ,
    data: params,
    cancelToken: new CancelToken(function executor(c){
      httpRequestList.push(c);
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  };
  config = Object.assign(defaultConfig, {
    errorTip: false
  }, config);
  console.log("postRequest config: " + JSON.stringify(config))
  return axios(config)
}

//post请求处理, 原生传入
// @ts-ignore
export const postBodyRequest = ({url, tag = "", params = {}, config = {}}) => {
  if (!url) return;
  let realUrl = url;
  let defaultConfig = {
    method: 'post',
    url: realUrl + (tag ? `/${tag}` : ''),
    data: params,
    cancelToken: new CancelToken(function executor(c) {
      httpRequestList.push(c);
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };
  config = Object.assign(defaultConfig, {
    errorTip: false
  }, config);
  console.log("PostBody请求配置信息: " + JSON.stringify(config))
  return axios(config)
}

//get请求方式,
// @ts-ignore
export const getRequest = ({url, tag = "", params = {}, config = {}}) => {
  if (!url) return;
  let realUrl = url;
  let defaultConfig = {
    method: 'get',
    params: params,
    cancelToken: new CancelToken(function executor(c) {
      httpRequestList.push(c);
    }),
    url: realUrl + (tag ? `/${tag}` : '')
  };
  config = Object.assign(defaultConfig,{
    errorTip: false
  },config);
  console.log("Request请求配置信息: " + JSON.stringify(config))
  return axios(config)

}
// 请求列表  用于页面跳转的时候取消当前为pending状态的请求
const clearHttpRequestList = () => {
  if (httpRequestList.length > 0) {
    // @ts-ignore
    httpRequestList.forEach( (item) => {
      item();
    } )
    httpRequestList = [];
  }
}
