import axios from 'axios';
import {
  responseInterceptors,
  requestInterceptors,
  limitInterceptors,
} from './interceptors';

// 导入config配置
import { baseConfig } from './config';

// 1、实例化axios
const instance = axios.create(baseConfig);

// 2、添加拦截器 - 限流拦截器
instance.interceptors.request.use(
  limitInterceptors.request.onFulfilled,
  limitInterceptors.request.onRejected,
);

instance.interceptors.response.use(
  limitInterceptors.response.onFulfilled,
  limitInterceptors.response.onRejected,
);

// 3、添加拦截器 请求拦截器
instance.interceptors.request.use(
  requestInterceptors.onFulfilled,
  requestInterceptors.onRejected,
);

// 4、添加拦截器 相应拦截器
instance.interceptors.response.use(
  responseInterceptors.onFulfilled,
  responseInterceptors.onRejected,
);

export default instance;
