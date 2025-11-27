import Taro from '@tarojs/taro';

const DEFAULT_BASE_URL = 'http://localhost:3000';

export async function request<T>(options: {
  url: string;
  method?: 'GET' | 'POST';
  data?: any;
  mockScene?: 'normal' | 'empty' | 'error';
}): Promise<T> {
  const { url, method = 'GET', data, mockScene } = options;
  const fullUrl = `${DEFAULT_BASE_URL}${url}`;

  const res = await Taro.request({
    url: fullUrl,
    method,
    data: mockScene ? { ...data, mockScene } : data,
    header: { 'Content-Type': 'application/json' }
  });

  if (res.statusCode !== 200) {
    throw new Error('网络错误');
  }

  const payload = res.data as any;
  if (payload.code !== 0) {
    throw new Error(payload.msg || '请求失败');
  }

  return payload.result as T;
}
