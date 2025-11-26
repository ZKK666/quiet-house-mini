import { useEffect, useState } from 'react';
import { View, Text, Picker, ScrollView } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { fetchCities, fetchCompounds } from '../../services/city';
import { useAppStore, type NoiseFilter } from '../../store/appStore';
import NoiseLevelTag from '../../components/NoiseLevelTag';
import type { City, Compound } from '../../types';
import './index.less';

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(false);
  const currentCityId = useAppStore((s) => s.currentCityId);
  const setCityId = useAppStore((s) => s.setCityId);
  const noiseFilter = useAppStore((s) => s.noiseFilter);

  useLoad(() => {
    init();
  });

  useEffect(() => {
    if (currentCityId) {
      loadCompounds(currentCityId, noiseFilter);
    }
  }, [currentCityId, noiseFilter]);

  async function init() {
    try {
      const res = await fetchCities();
      setCities(res);
      if (res.length > 0) {
        setCityId(res[0].id);
      }
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载城市失败', icon: 'none' });
    }
  }

  async function loadCompounds(cityId: number, filter: NoiseFilter) {
    setLoading(true);
    try {
      const res = await fetchCompounds({ cityId, limit: 100 });
      setCompounds(res);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载小区失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }

  const pickerRange = cities.map((c) => c.name);
  const cityIndex = cities.findIndex((c) => c.id === currentCityId);

  return (
    <View className='page'>
      <View className='header'>
        <Text className='title'>QuietMap 安静小区雷达</Text>
        <Picker
          mode='selector'
          range={pickerRange}
          onChange={(e) => {
            const idx = Number(e.detail.value);
            const city = cities[idx];
            if (city) setCityId(city.id);
          }}
          value={cityIndex === -1 ? 0 : cityIndex}
        >
          <View className='picker'>当前城市：{cities[cityIndex]?.name || '未选择'}</View>
        </Picker>
      </View>

      <View className='section'>
        <Text className='section-title'>按视野展示（mock 数据，最多 100 条）</Text>
      </View>

      <ScrollView scrollY className='list'>
        {loading && <View className='hint'>加载中...</View>}
        {!loading && compounds.length === 0 && <View className='hint'>暂无小区数据</View>}
        {compounds.map((item) => (
          <View key={item.id} className='card' onClick={() => Taro.navigateTo({ url: `/pages/compound/index?id=${item.id}` })}>
            <View className='card-header'>
              <Text className='name'>{item.name}</Text>
              <NoiseLevelTag level={item.overallNoiseLevel} />
            </View>
            <View className='score'>综合分数：{item.overallNoiseScore}</View>
            <View className='meta'>模型版本：{item.modelMeta.modelVersion}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
