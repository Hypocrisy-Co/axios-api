// api核心处理
import axios from 'axios';
import baseURL from '@/envconfig/envconfig';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 主要params参数
 * @params method {string} 方法名
 * @params url {string} 请求地址  例如：/login 配合baseURL组成完整请求地址
 * @params baseURL {string} 请求地址统一前缀 ***需要提前指定***  例如：http://cangdu.org
 * @params timeout {number} 请求超时时间 默认 30000
 * @params params {object}  get方式传参key值
 * @params headers {string} 指定请求头信息
 * @params withCredentials {boolean} 请求是否携带本地cookies信息默认开启
 * @params validateStatus {func} 默认判断请求成功的范围 200 - 300
 * @return {Promise}
 * 其他更多拓展参看axios文档后 自行拓展
 * 注意：params中的数据会覆盖method url 参数，所以如果指定了这2个参数则不需要在params中带入
*/
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;

  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};


export default class Server {
  request(method, url, data, newOptions = {}){
    return new Promise((resolve, reject) => {
      if(!!data){
        method === 'get'
        ? newOptions.params = data
        : newOptions.data = data
      }
      let _options = Object.assign({
          method,
          url,
          baseURL: baseURL,
          timeout: 3000,
          needCode: false,
          // withCredentials: true, //是否携带cookies发起请求
          validateStatus:(status)=>{
              return status >= 200 && status < 300;
          },
      }, newOptions)

      axios.request(_options).then(res => {
        try {
          checkStatus(res)
          let _data = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
          _data = _options.needCode ? _data : _data.data
          resolve(_data)
        } catch (err) {
          reject(err)
        }

      },error => {
        if(error.response){
            reject(error.response.data)
        }else{
            reject(error)
        }
      })
    })
  }
}
