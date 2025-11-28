import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useLoad, useRouter } from '@tarojs/taro';
import { fetchBuildingDetail } from '../../services/building';
import NoiseLevelTag from '../../components/NoiseLevelTag';
import type { BuildingDetailResponse } from '../../types';
import './index.less';

export default function BuildingDetailPage() {
  const [detail, setDetail] = useState<BuildingDetailResponse | null>(null);
  const router = useRouter();
  const id = Number(router.params.id);

  useLoad(() => {
    if (!id) {
      Taro.showToast({ title: '缺少楼栋 id', icon: 'none' });
      return;
    }
    fetchData(id);
  });

  async function fetchData(buildingId: number) {
    try {
      const res = await fetchBuildingDetail(buildingId);
      setDetail(res);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载失败', icon: 'none' });
    }
  }

  if (!detail) {
    return <View className='page'>加载中...</View>;
  }

  const { building, noiseDetail, noiseFactors } = detail;

  return (
    <View className='page'>
      <View className='card'>
        <View className='card-header'>
          <Text className='name'>{building.name}</Text>
          <NoiseLevelTag level={building.noiseLevelOverall} />
        </View>
        <View className='meta'>综合分数：{building.noiseScoreOverall}</View>
        {building.recommendedFloors && (
          <View className='meta'>推荐楼层：{building.recommendedFloors.min} - {building.recommendedFloors.max}</View>
        )}
        {building.description && <View className='desc'>{building.description}</View>}
      </View>

      {noiseDetail && (
        <View className='card'>
          <View className='section-title'>楼层噪音趋势</View>
          {noiseDetail.floorNoiseList.map((f) => (
            <View key={f.floor} className='row'>
              <Text className='label'>第 {f.floor} 层</Text>
              <Text className='value'>{f.noiseScore}</Text>
            </View>
          ))}
        </View>
      )}

      {noiseFactors && (
        <View className='card'>
          <View className='section-title'>噪音影响因素</View>
          {noiseFactors.distanceToMainRoad && (
            <View className='row'>
              <Text className='label'>距主干道</Text>
              <Text className='value'>{noiseFactors.distanceToMainRoad} 米</Text>
            </View>
          )}
          {noiseFactors.distanceToSubwayStation && (
            <View className='row'>
              <Text className='label'>距地铁站</Text>
              <Text className='value'>{noiseFactors.distanceToSubwayStation} 米</Text>
            </View>
          )}
          {noiseFactors.shieldingLevel && (
            <View className='row'>
              <Text className='label'>遮挡等级</Text>
              <Text className='value'>{noiseFactors.shieldingLevel}</Text>
            </View>
          )}
          <View className='desc'>{noiseFactors.summary}</View>
        </View>
      )}
    </View>
  );
}
