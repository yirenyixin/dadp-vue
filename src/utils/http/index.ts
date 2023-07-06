import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { CustomSuccessData, Get, Post } from './http-type';
import { getToken } from './auth';
import { showLoading, hideLoading } from './loading';

// 接口类型和方法
interface BaseType {
  baseURL: string;
  getConfigParams(isRepeatStop: boolean): any;
  interceptors(instance: AxiosInstance, url: string | number | undefined): any;
  request(options: AxiosRequestConfig, isRepeatStop: boolean): any;
}

interface AxiosRequestType {
  baseURL?: string;
  url?: string | undefined;
  data?: any;
  params?: any;
  method?: string;
  headers?: any;
  timeout?: number;
  value?: any;
  cancelToken?: any;
}

// 取消重复请求
const CancelToken = axios.CancelToken;
// 用于存储每个请求的取消函数以及对应标识
const sources: any = [];

// 取消函数
const removeSource = (config: any) => {
  if (config)
    for (const item in sources) {
      if (sources[item].umet === config.url + '&' + config.method) {
        sources[item].cancel('已取消重复请求，请勿重复请求');
        sources.splice(item, 1);
      }
    }
};

class AxiosHttpRequest implements BaseType, Get, Post {
  baseURL: string;
  timeout: number;
  loading?: any;
  constructor() {
    this.baseURL = process.env.VUE_APP_BASE_API as string;
    this.timeout = 300000;
  }
  // 配置参数
  getConfigParams(isRepeatStop: boolean) {
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin-Type': '*',
        isRepeatStop: isRepeatStop
      }
    };
    return config;
  }
  //get链接请求格式化
  getConfigFn(config: AxiosRequestType) {
    let url = config.url + '?';
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName];
      const part = encodeURIComponent(propName) + '=';
      if (value !== null && typeof value !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            const params = propName + '[' + key + ']';
            const subPart = encodeURIComponent(params) + '=';
            url += subPart + encodeURIComponent(value[key]) + '&';
          }
        } else {
          url += part + encodeURIComponent(value) + '&';
        }
      }
    }
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
    return config;
  }
  // 拦截设置
  interceptors(instance: AxiosInstance, url: string | number | undefined) {
    // 请求拦截
    instance.interceptors.request.use(
      (config: AxiosRequestType) => {
        if (config.headers.isRepeatStop) {
          // 取消重复请求
          removeSource(config);
          config.cancelToken = new CancelToken((c) => {
            // 将取消函数存起来
            sources.push({ umet: config.url + '&' + config.method, cancel: c });
          });
        }
        showLoading();
        const token = getToken();
        token ? (config.headers['Authorization'] = token) : '';
        config.method === 'get' && config.params
          ? (config = this.getConfigFn(config))
          : '';
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截
    instance.interceptors.response.use(
      (res: any) => {
        // 取消重复请求
        removeSource(res.config);
        setTimeout(() => {
          hideLoading();
        }, 200);

        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        let msg = res.data['msg'] || '未知错误，请联系管理员';
        switch (code) {
          case 401:
            msg = '认证失败，无法访问系统资源';
            break;
          case 403:
            msg = '当前操作没有权限';
            break;
          case 404:
            msg = '访问资源不存在';
            break;
          case 'default':
            msg = '系统未知错误，请反馈给管理员';
            break;
        }
        if (code === 200) {
          return Promise.resolve(res);
        } else {
          ElMessage.error(msg);
          return Promise.reject(res);
        }
      },
      (error: any) => {
        setTimeout(() => {
          hideLoading();
        }, 200);
        let { message } = JSON.parse(JSON.stringify(error));
        if (message == 'Network Error') {
          message = '后端接口连接异常';
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时';
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常';
        }
        ElMessage.error({
          message: message,
          duration: 5 * 1000
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * 外部调用方法
   * @param options axios请求参数
   * @param isRepeatStop 是否取消重复请求(统一接口多次请求)
   * @returns 实例
   */
  request(options: AxiosRequestConfig, isRepeatStop = true) {
    const instance = axios.create({});
    options = Object.assign(this.getConfigParams(isRepeatStop), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
  async get(url: string, params?: any): Promise<CustomSuccessData> {
    const response = await this.request({
      url: url,
      method: 'get',
      params
    });
    return Promise.resolve(response.data);
  }

  async post(
    url: string,
    params?: any,
    isRepeatStop = true
  ): Promise<CustomSuccessData> {
    const response = await this.request(
      {
        url: url,
        method: 'post',
        data: params
      },
      isRepeatStop
    );
    return Promise.resolve(response.data);
  }

  async download(url: string, params?: any): Promise<CustomSuccessData> {
    const response = await this.request({
      url: url,
      method: 'post',
      data: params,
      responseType: 'blob'
    });
    return Promise.resolve(response);
  }
  async upLoadFile(url: string, params?: any): Promise<CustomSuccessData> {
    const response = await this.request({
      url: url,
      method: 'post',
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: getToken() as string
      }
    });
    return Promise.resolve(response.data);
  }
}

// 实例化请求类
const $http = new AxiosHttpRequest();

export default $http;
