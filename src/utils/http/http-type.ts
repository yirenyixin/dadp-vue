// 请求参数类型
export interface HttpListQuery {
  pageNo?: number;
  pageSize?: number;
  [key: string]: any;
}
// 网络请求响应格式
export interface CustomSuccessData {
  code?: number;
  msg?: string;
  message?: string;
  data?: any;
  [keys: string]: any;
}

export interface Get {
  get(url: string, params?: any): Promise<CustomSuccessData>;
}

export interface Post {
  post(url: string, params?: any): Promise<CustomSuccessData>;
}
