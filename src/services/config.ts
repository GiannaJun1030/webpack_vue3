import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import retryAdapter from './retry';
import type { AxiosAdapter } from 'axios';

// 基础配置
export const baseConfig = {
  baseURL:
    'https://www.fastmock.site/mock/4f4bf2d6580f9c40596b56d03545a605/san',
  timeout: 3000,
  adapter: cacheAdapterEnhancer(
    retryAdapter(axios.defaults.adapter as AxiosAdapter),
    {
      enabledByDefault: false,
    },
  ),
};
