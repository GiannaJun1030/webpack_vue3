import instance from './index';
import type { AxiosRequestConfig } from 'axios';
import type { RetryAdapterOption } from './retry';

export interface RequestConfig extends AxiosRequestConfig {
  url: NonNullable<AxiosRequestConfig['url']>;
  // 添加属性 自定义接口反馈信息
  desc?: string;
  // 通过notifyWhenFailure和notifyWhenSuccess强制开启或关闭成功失败时的反馈
  notifyWhenSuccess?: boolean;
  notifyWhenFailure?: boolean;
  // 替换url上面的占位符
  args?: Record<string, any>;
  // 限流的参数
  limit?: number;
  // 重试参数
  retry?: boolean | Partial<RetryAdapterOption>;
}

export interface BackendResultFormat<T = any> {
  code: number;
  data: T;
  message: string;
}

/**
 * payload - 返回的请求参数格式
 * Data - 是body请求参数格式
 * params - 是params请求参数格式
 * args - 替换url中的占位符
 */
interface MakeRequest {
  <Payload = any>(config: RequestConfig): (
    requestConfig?: Partial<RequestConfig>,
  ) => Promise<Payload>;
  <Payload, Data>(config: RequestConfig): (
    requestConfig: Partial<Omit<RequestConfig, 'data'>> & { data: Data },
  ) => Promise<Payload>;
  <Payload, Data, Params>(config: RequestConfig): (
    requestConfig: Partial<Omit<RequestConfig, 'data' | 'params'>> &
      (Data extends undefined ? { data?: undefined } : { data: Data }) & {
        params: Params;
      },
  ) => Promise<Payload>;
  // 加上如果带Args泛型参数的情况，同样的，如果指定Params或Data泛型参数为undefined，则可忽略不填
  <Payload, Data, Params, Args>(config: RequestConfig): (
    requestConfig: Partial<Omit<RequestConfig, 'data' | 'params' | 'args'>> &
      (Data extends undefined ? { data?: undefined } : { data: Data }) &
      (Params extends undefined
        ? { params?: undefined }
        : { params: Params }) & {
        args: Args;
      },
  ) => Promise<Payload>;
}

class CodeNoZeroErrer extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * 对请求封装一层
 * @param config - 配置时候传入的参数
 * @param requestConfig - 调用的时候传进的参数
 * @returns
 */
export const makeRequest: MakeRequest = <T>(config: RequestConfig) => {
  return async (requestConfig?: Partial<RequestConfig>) => {
    // 合并两个配置
    const mergedConfig = {
      ...config,
      ...requestConfig,
      // 是否重连，未设置的情况下返回true
      retry: config.retry ?? true,
      headers: {
        ...config.headers,
        ...requestConfig?.headers,
      },
    };

    try {
      const response = await instance.request<BackendResultFormat<T>>(
        mergedConfig,
      );
      const res = response.data;
      if (res.code !== 0) {
        return {
          data: null,
          err: new CodeNoZeroErrer(res.code, res.message),
          response,
        };
      }
      return { data: res.data, err: null, response };
    } catch (err) {
      return { data: null, err, response: null };
    }
  };
};

export const getEcharts = makeRequest<{ name: string; age: number }>({
  url: '/picc/echarts',
  limit: 3,
});

export const getEcharts2 = makeRequest<
  {
    name: string;
    age: number;
    weight: number;
  },
  { wojiushixiedaizaibodyde: string },
  { wojiushipingjiezaiurlde: string },
  { echarts: string }
>({
  url: '/picc/{echarts}',
  limit: 2,
  method: 'post',
});

export default makeRequest;
