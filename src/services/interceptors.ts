import type { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import type { BackendResultFormat, RequestConfig } from './api';

type ResolveFn = (value: unknown) => void;
const records: Record<string, { count: number; queue: ResolveFn[] }> = {};
const generateKey = (config: RequestConfig) => `${config.url}-${config.method}`;

// 限流拦截器
const limitInterceptors = {
  request: {
    onFulfilled: async (config: AxiosRequestConfig) => {
      const { limit } = config as RequestConfig;
      if (typeof limit === 'number') {
        const key = generateKey(config as RequestConfig);
        if (!records[key]) {
          records[key] = {
            count: 0,
            queue: [],
          };
        }
        const record = records[key];
        record.count += 1;
        if (record.count <= limit) {
          return config;
        }
        await new Promise((resolve) => {
          record.queue.push(resolve);
        });
        return config;
      }
      return config;
    },
    onRejected: undefined,
  },
  response: {
    onFulfilled: (response: AxiosResponse<BackendResultFormat>) => {
      const config = response.config as RequestConfig;
      const { limit } = config;
      if (typeof limit === 'number') {
        const key = generateKey(config);
        const record = records[key];
        record.count -= 1;
        console.log(record, 999);
        if (record.queue.length) {
          record.queue.shift()!(null);
        }
      }
      return response;
    },
    onRejected: (error: AxiosError<BackendResultFormat>) => {
      const config = error.config as RequestConfig;
      const { limit } = config as RequestConfig;
      if (typeof limit === 'number') {
        const key = generateKey(config);
        const record = records[key];
        record.count -= 1;
        if (record.queue.length) {
          record.queue.shift()!(null);
        }
      }
      return error;
    },
  },
};

// 请求拦截器
const requestInterceptors = {
  onFulfilled: (config: AxiosRequestConfig) => {
    const { url, args } = config as RequestConfig;
    if (args) {
      const lostParams: string[] = [];
      const replacedUrl = url.replace(/\{([^}]+)\}/g, (res, arg: string) => {
        if (!args[arg]) {
          lostParams.push(arg);
        }
        return args[arg] as string;
      });
      if (lostParams.length) {
        return Promise.reject(new Error('在args中找不到对应的路径参数'));
      }
      return { ...config, url: replacedUrl };
    }
    return config;
  },
  onRejected: undefined,
};

// 响应期拦截器
const responseInterceptors = {
  onFulfilled: (response: AxiosResponse<BackendResultFormat>) => {
    const { code, message } = response.data;
    const { desc, notifyWhenFailure, notifyWhenSuccess, method } =
      response.config as RequestConfig;
    if (desc) {
      if (code === 0) {
        if (notifyWhenSuccess) {
          if (['delete', 'put', 'post'].includes(method?.toLowerCase() || '')) {
            console.log(`${desc}成功`);
          }
        }
      } else if (notifyWhenFailure) {
        console.log(`${desc}错误`, `原因${message}`);
      }
    }
    return response;
  },
  onRejected: (error: AxiosError<BackendResultFormat>) => {
    const { response, config } = error;
    const { url, desc } = config as RequestConfig;
    if (desc) {
      if (response?.status && response?.statusText) {
        console.log(`${desc}错误`);
      }
      // 这里处理相应失败的情况，并且可以对可能的情况做失败的反馈
      // 1、超时
      // 2、offline
      else {
        console.log(`${desc}失败`, `${error.message}路径${url}`);
      }
    }
    return error;
  },
};

export { responseInterceptors, requestInterceptors, limitInterceptors };
