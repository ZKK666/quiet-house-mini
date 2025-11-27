import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Picker, ScrollView, Map } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { fetchCities, fetchCompounds } from '../../services/city';
import { useAppStore, type NoiseFilter } from '../../store/appStore';
import NoiseLevelTag from '../../components/NoiseLevelTag';
import { levelColor, levelLabel } from '../../utils/noise';
import type { City, Compound } from '../../types';
import './index.less';

export default function HomePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompoundId, setSelectedCompoundId] = useState<number | undefined>();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const currentCityId = useAppStore((s) => s.currentCityId);
  const setCityId = useAppStore((s) => s.setCityId);
  const noiseFilter = useAppStore((s) => s.noiseFilter);
  const debounceRef = useRef<NodeJS.Timeout>();
  const lastBboxRef = useRef<string | undefined>();

  useLoad(() => {
    init();
  });

  useEffect(() => {
    if (currentCityId) {
      const city = cities.find((c) => c.id === currentCityId);
      if (city) {
        setMapCenter(city.center);
      }
      loadCompounds(currentCityId, noiseFilter, lastBboxRef.current);
    }
  }, [currentCityId, noiseFilter, cities]);

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

  async function loadCompounds(cityId: number, _filter: NoiseFilter, bbox?: string) {
    setLoading(true);
    try {
      const res = await fetchCompounds({ cityId, limit: 100, bbox });
      setCompounds(res);
    } catch (err: any) {
      Taro.showToast({ title: err.message || '加载小区失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  }

  function handleRegionChange(e: any) {
    if (e.type !== 'end' || !currentCityId) return;
    const region = e?.detail?.region;
    if (!region) return;
    const bbox = `${region.southwest.latitude},${region.southwest.longitude},${region.northeast.latitude},${region.northeast.longitude}`;
    lastBboxRef.current = bbox;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadCompounds(currentCityId, noiseFilter, bbox);
    }, 400);
  }

  const markers = useMemo(
    () =>
      compounds.map((item) => ({
        id: item.id,
        latitude: item.location.lat,
        longitude: item.location.lng,
        width: 30,
        height: 30,
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/markerDefault.png',
        label: {
          content: `${item.name}\n${levelLabel(item.overallNoiseLevel)} ${item.overallNoiseScore}`,
          color: '#ffffff',
          fontSize: 12,
          bgColor: levelColor(item.overallNoiseLevel),
          padding: 6,
          borderRadius: 8,
          textAlign: 'center',
        },
        callout: selectedCompoundId === item.id
          ? {
              content: `${item.name}\n噪音分：${item.overallNoiseScore}`,
              color: '#ffffff',
              bgColor: levelColor(item.overallNoiseLevel),
              padding: 10,
              borderRadius: 10,
              display: 'ALWAYS' as const,
              textAlign: 'center',
            }
          : undefined,
      })),
    [compounds, selectedCompoundId]
  );

  const selectedCompound = useMemo(
    () => compounds.find((c) => c.id === selectedCompoundId),
    [compounds, selectedCompoundId]
  );

  const pickerRange = cities.map((c) => c.name);
  const cityIndex = cities.findIndex((c) => c.id === currentCityId);

  return (
    <View className='page'>
      <View className='hero'>
        <View className='title-wrap'>
          <Text className='title'>QuietMap 安静小区雷达</Text>
          <Text className='subtitle'>一眼看懂小区噪音热度，先挑安静的地方看房</Text>
        </View>
        <Picker
          mode='selector'
          range={pickerRange}
          onChange={(e) => {
            const idx = Number(e.detail.value);
            const city = cities[idx];
            if (city) {
              setCityId(city.id);
              setSelectedCompoundId(undefined);
              setMapCenter(city.center);
            }
          }}
          value={cityIndex === -1 ? 0 : cityIndex}
        >
          <View className='city-picker'>
            <Text>当前城市</Text>
            <Text className='section-sub'>{cities[cityIndex]?.name || '未选择'}</Text>
          </View>
        </Picker>
      </View>

      <View className='section-head'>
        <View>
          <Text className='section-title'>地图视野加载小区</Text>
          <View className='section-sub'>mock 数据，最多 100 条；拖动/缩放自动刷新</View>
        </View>
        <View className='legend'>
          <View className='legend-item'>
            <View className='legend-dot' style={{ backgroundColor: levelColor('QUIET') }} />安静
          </View>
          <View className='legend-item'>
            <View className='legend-dot' style={{ backgroundColor: levelColor('NORMAL') }} />一般
          </View>
          <View className='legend-item'>
            <View className='legend-dot' style={{ backgroundColor: levelColor('NOISY') }} />嘈杂
          </View>
        </View>
      </View>

      <View className='map-wrapper'>
        {mapCenter && (
          <Map
            id='home-map'
            className='map'
            latitude={mapCenter.lat}
            longitude={mapCenter.lng}
            scale={12}
            markers={markers as any}
            onRegionChange={handleRegionChange}
            onMarkerTap={(e) => setSelectedCompoundId(e.detail.markerId)}
            show-location
          />
        )}
        {!mapCenter && <View className='hint'>正在获取城市坐标...</View>}
        <View className='map-hint'>
          拖动地图以刷新视野小区，点击标记查看卡片并进入楼栋热力图。
        </View>
      </View>

      <ScrollView scrollY className='list'>
        {loading && <View className='hint'>加载中...</View>}
        {!loading && compounds.length === 0 && <View className='hint'>暂无小区数据</View>}
        {compounds.map((item) => (
          <View
            key={item.id}
            className={`card ${selectedCompoundId === item.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCompoundId(item.id);
              Taro.navigateTo({ url: `/pages/compound/index?id=${item.id}` });
            }}
          >
            <View className='card-header'>
              <Text className='name'>{item.name}</Text>
              <NoiseLevelTag level={item.overallNoiseLevel} />
            </View>
            <View className='score'>综合分数：{item.overallNoiseScore}</View>
            <View className='muted'>模型版本：{item.modelMeta.modelVersion}</View>
            {item.tags && item.tags.length > 0 && (
              <View className='tag-row'>
                {item.tags.map((tag) => (
                  <View key={tag} className='legend-item'>
                    <View className='legend-dot' style={{ backgroundColor: '#d1d9f0' }} />
                    {tag}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {selectedCompound && (
        <View className='floating-card'>
          <View className='floating-header'>
            <Text className='name'>{selectedCompound.name}</Text>
            <NoiseLevelTag level={selectedCompound.overallNoiseLevel} />
          </View>
          <View className='score'>综合分数：{selectedCompound.overallNoiseScore}</View>
          <View className='muted'>数据版本：{selectedCompound.modelMeta.dataVersion}</View>
          <View
            className='btn'
            onClick={() => Taro.navigateTo({ url: `/pages/compound/index?id=${selectedCompound.id}` })}
          >
            查看小区楼栋噪音
          </View>
        </View>
      )}
    </View>
  );
}
