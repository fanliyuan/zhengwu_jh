/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/20
 *
 * 描述 ：api请求组件
 */
import axios from 'axios'
import { Notice } from 'iview';

const root = process.env.API_HOST;
const generateApiMap = (map) => {
  let facade = {}
  _.forEach(map, function (value, key) {
    facade[key] = toMethod(value)
  })
  return facade
}

const toMethod = (options) => {
  options.method = options.method || 'post';
  return (params = {}, attachedParams, config = {}) => {
    params = _.extend(params, attachedParams)
    return sendApiInstance(options.method, options.url, params, config)
  }
}

// 创建axios实例
const createApiInstance = (config = {}) => {
  const _config = {
    withCredentials: true, // 跨域
    baseURL: root
  }
  config = _.merge(_config, config)
  return axios.create(config)
}

const err_check = (code, msg, data) => {
  if (code === 0) {
    return true
  }
  return false
}

const sendApiInstance = (method, url, params, config = {}) => {
  if(!url){
    return
  }
  if (url.indexOf('{id}') !== -1) {
    url = url.replace('{id}', params.id);
  }
  if (url.indexOf('{type}') !== -1) {
    url = url.replace('{type}', params.type);
  }
  let instance = createApiInstance(config)

  instance.interceptors.response.use(response => {
      let code = response.data.code;
      let msg = response.data.message;
      let data = response.data.result;
      if (err_check(code, msg, data)) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(data)
      }
    },
    error => {
      Notice.warning({
        title: '',
        desc: '请求数据时出错！',
        duration: 5
      })
      return Promise.reject(error).catch(res => {
        console.log(res)
      })
    }
  )
  if (typeof params === Array.isArray([]) && method === 'post') {
    params = {
      params: params
    }
  }
  // if (typeof params === 'object' && Object.prototype.toString.call(params) === '[object Array]') {
  //   params = {
  //     data: params
  //   }
  // }

  if (method === 'get' && !params.ID) {
    params = {
      params: params
    }
  }
  if (params && params.ID) {
    url = url + '/' + params.ID;
  }

  return instance[method](url, params, config)
}

export default {
  generateApiMap
}
