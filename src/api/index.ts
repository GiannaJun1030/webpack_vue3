import { makeRequest } from '@/services/api';

/**
 * 泛型输入
 * 1、返回数据中的格式
 * 2、请求中body参数的格式
 * 3、请求中params参数的格式
 * 4、替换url中指定的占位符中的约束
 */
export const getEcharts = makeRequest<
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
// 上面接口的使用案例
// import { getEcharts2 } from '@/services/api';
// getEcharts2({
//   data: { wojiushixiedaizaibodyde: '2' },
//   params: { wojiushipingjiezaiurlde: '2' },
//   args: { echarts: 'zhende1' },
// });
