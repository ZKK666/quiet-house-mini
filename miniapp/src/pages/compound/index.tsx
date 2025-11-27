import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Map } from '@tarojs/components';
import Taro, { useLoad, useRouter } from '@tarojs/taro';
import { fetchCompound, fetchBuildings } from '../../services/compound';
import NoiseLevelTag from '../../components/NoiseLevelTag';
import { useAppStore } from '../../store/appStore';
import { levelColor, levelLabel } from '../../utils/noise';
import type { Compound, Building } from '../../types';
import './index.less';

export default function CompoundPage() {
  const [compound, setCompound] = useState<Compound | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>();
  const router = useRouter();
  const compoundId = Number(router.params.id);
  const noiseFilter = useAppStore((s) => s.noiseFilter);

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

  const filteredBuildings = useMemo(() => {
    const filtered = buildings.filter((b) => noiseFilter.levels.includes(b.noiseLevelOverall));
    if (noiseFilter.recommendTopN) {
      return [...filtered].sort((a, b) => b.noiseScoreOverall - a.noiseScoreOverall).slice(0, noiseFilter.recommendTopN);
    }
    return filtered;
  }, [buildings, noiseFilter]);

  const markers = useMemo(
    () =>
      filteredBuildings.map((b) => ({
        id: b.id,
        latitude: b.location.lat,
        longitude: b.location.lng,
        width: 30,
        height: 30,
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/markerDefault.png',
        label: {
          content: `${b.name}\n${levelLabel(b.noiseLevelOverall)} ${b.noiseScoreOverall}`,
          color: '#ffffff',
          fontSize: 12,
          bgColor: levelColor(b.noiseLevelOverall),
          padding: 6,
          borderRadius: 8,
          textAlign: 'center',
        },
        callout: selectedBuildingId === b.id
          ? {
              content: `${b.name}\n噪音分：${b.noiseScoreOverall}`,
              color: '#ffffff',
              bgColor: levelColor(b.noiseLevelOverall),
              padding: 10,
              borderRadius: 10,
              display: 'ALWAYS' as const,
              textAlign: 'center',
            }
          : undefined,
      })),
    [filteredBuildings, selectedBuildingId]
  );

  const polygons = useMemo(() => {
    if (!compound?.bounds || compound.bounds.length === 0) return [];
    return [
      {
        points: compound.bounds.map((p) => ({ latitude: p.lat, longitude: p.lng })),
        strokeColor: '#5c6cff',
        strokeWidth: 2,
        fillColor: '#5c6cff33',
      },
    ];
  }, [compound]);

  const selectedBuilding = useMemo(
    () => filteredBuildings.find((b) => b.id === selectedBuildingId),
    [filteredBuildings, selectedBuildingId]
  );

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
          {compound.tags && compound.tags.length > 0 && (
            <View className='meta'>标签：{compound.tags.join(' / ')}</View>
          )}
        </View>
      )}

      <View className='section-title'>楼栋热力视图</View>
      <View className='map-wrapper'>
        {compound && (
          <Map
            id='compound-map'
            className='map'
            latitude={compound.location.lat}
            longitude={compound.location.lng}
            scale={16}
            polygons={polygons as any}
            markers={markers as any}
            onMarkerTap={(e) => setSelectedBuildingId(e.detail.markerId)}
            show-location
          />
        )}
        {!compound && <View className='hint'>正在加载小区坐标...</View>}
        <View className='map-hint'>
          点击楼栋标记查看分数与推荐楼层；当前筛选：
          {noiseFilter.levels.join(' / ')}
          {noiseFilter.recommendTopN ? ` · 仅推荐 Top${noiseFilter.recommendTopN}` : ''}
        </View>
      </View>

      <View className='section-title'>楼栋列表</View>
      <ScrollView scrollY className='list'>
        {loading && <View className='hint'>加载中...</View>}
        {!loading && filteredBuildings.length === 0 && <View className='hint'>暂无楼栋数据（可能被筛选规则过滤）</View>}
        {filteredBuildings.map((b) => (
          <View
            key={b.id}
            className={`card ${selectedBuildingId === b.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedBuildingId(b.id);
              Taro.navigateTo({ url: `/pages/building-detail/index?id=${b.id}` });
            }}
          >
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

      {selectedBuilding && (
        <View className='floating-card'>
          <View className='floating-header'>
            <Text className='name'>{selectedBuilding.name}</Text>
            <NoiseLevelTag level={selectedBuilding.noiseLevelOverall} />
          </View>
          <View className='meta'>综合分数：{selectedBuilding.noiseScoreOverall}</View>
          {selectedBuilding.recommendedFloors && (
            <View className='meta'>推荐楼层：{selectedBuilding.recommendedFloors.min}-{selectedBuilding.recommendedFloors.max}</View>
          )}
          {selectedBuilding.description && <View className='desc'>{selectedBuilding.description}</View>}
          <View
            className='btn'
            onClick={() => Taro.navigateTo({ url: `/pages/building-detail/index?id=${selectedBuilding.id}` })}
          >
            查看楼栋详情
          </View>
        </View>
      )}
    </View>
  );
}
