import type { AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import type { RequestConfig } from './api';
import { AxiosError } from 'axios';

// 定义配置的声明类型
export interface RetryAdapterOption {
  // 重试次数
  retryTimes: number;
  // 重试间隔时间
  retryInterval: number;
}

// 判断错误的方法，如果错误符合条件则重试
// 下面逻辑中，如果错误是超时或网络错误，则返回true
const judgeError = (error: any) => {
  return (
    error instanceof AxiosError &&
    (error.message.startsWith('timeout') ||
      error.message.startsWith('Network Error'))
  );
};

const retryAdapter = (
  adapter: AxiosAdapter,
  retryAdapterOption?: Partial<RetryAdapterOption>,
) => {
  // retryTimes即重复请求次数默认为3次
  const retryTimes =
    retryAdapterOption?.retryTimes === undefined
      ? 3
      : retryAdapterOption?.retryTimes;
  // retryInterval即重复请求时间间隔默认为500
  const retryInterval =
    retryAdapterOption?.retryInterval === undefined
      ? 500
      : retryAdapterOption?.retryInterval;
  return (config: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
    const { retry } = config as RequestConfig;
    // 如果config.retry被定义，则启用重试机制
    if (retry) {
      let count = 0;
      let finalRetryTimes = retryTimes;
      let finalRetryInterval = retryInterval;
      if (typeof retry === 'object') {
        finalRetryTimes =
          typeof retry.retryTimes === 'number' ? retry.retryTimes : retryTimes;
        finalRetryInterval =
          typeof retry.retryInterval === 'number'
            ? retry.retryInterval
            : retryInterval;
      }
      // 核心函数，如果报错且错误符合条件，则调用自身
      const request = async (): Promise<AxiosResponse<any>> => {
        try {
          return await adapter(config);
        } catch (err) {
          if (!judgeError(err)) {
            return Promise.reject(err);
          }
          count++;
          if (count > finalRetryTimes) {
            return Promise.reject(err);
          }
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(null);
            }, finalRetryInterval);
          });
          return request();
        }
      };
      return request();
    } else {
      return adapter(config);
    }
  };
};

export default retryAdapter;
