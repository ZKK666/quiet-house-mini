import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useLoad, useRouter } from '@tarojs/taro';
import { fetchCompound, fetchBuildings } from '../../services/compound';
import NoiseLevelTag from '../../components/NoiseLevelTag';
import type { Compound, Building } from '../../types';
import './index.less';

export default function CompoundPage() {
  const [compound, setCompound] = useState<Compound | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const compoundId = Number(router.params.id);

  useLoad(() => {
    if (!compoundId) {
      Taro.showToast({ title: '缺少小区 id', icon: 'none' });
      return;
    }
    init(compoundId);
  });

  async function init(id: number) {
    try {
      const info = await fetchCompound(id);
      setCompound(info);
      loadBuildings(id);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载小区失败', icon: 'none' });
    }
  }

  async function loadBuildings(id: number) {
    setLoading(true);
    try {
      const list = await fetchBuildings({ compoundId: id });
      setBuildings(list);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载楼栋失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className='page'>
      {compound && (
        <View className='card'>
          <View className='card-header'>
            <Text className='name'>{compound.name}</Text>
            <NoiseLevelTag level={compound.overallNoiseLevel} />
          </View>
          <View className='meta'>综合分数：{compound.overallNoiseScore}</View>
          <View className='meta'>数据版本：{compound.modelMeta.dataVersion}</View>
        </View>
      )}

      <View className='section-title'>楼栋列表</View>
      <ScrollView scrollY className='list'>
        {loading && <View className='hint'>加载中...</View>}
        {!loading && buildings.length === 0 && <View className='hint'>暂无楼栋数据</View>}
        {buildings.map((b) => (
          <View key={b.id} className='card' onClick={() => Taro.navigateTo({ url: `/pages/building-detail/index?id=${b.id}` })}>
            <View className='card-header'>
              <Text className='name'>{b.name}</Text>
              <NoiseLevelTag level={b.noiseLevelOverall} />
            </View>
            <View className='meta'>综合分数：{b.noiseScoreOverall}</View>
            {b.recommendedFloors && (
              <View className='meta'>推荐楼层：{b.recommendedFloors.min} - {b.recommendedFloors.max}</View>
            )}
            {b.description && <View className='desc'>{b.description}</View>}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
