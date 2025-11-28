import { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { request } from '../../services/request';
import './index.less';

type AboutModel = {
  title: string;
  content: string;
};

export default function AboutModelPage() {
  const [data, setData] = useState<AboutModel | null>(null);

  useLoad(() => {
    load();
  });

  async function load() {
    try {
      const res = await request<AboutModel>({ url: '/about/model' });
      setData(res);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载失败', icon: 'none' });
    }
  }

  return (
    <View className='page'>
      <View className='card'>
        <View className='card-header'>
          <Text className='name'>{data?.title || '噪音模型说明'}</Text>
        </View>
        <View className='desc'>{data?.content || '后端 mock 数据，描述噪音模型考虑因素。'}</View>
      </View>
    </View>
  );
}
