import { View } from '@tarojs/components';
import type { NoiseLevel } from '../utils/noise';
import { levelLabel, levelColor } from '../utils/noise';
import './NoiseLevelTag.less';

type Props = { level: NoiseLevel };

export default function NoiseLevelTag({ level }: Props) {
  const color = levelColor(level);
  return (
    <View className='noise-tag' style={{ backgroundColor: `${color}15`, color }}>
      <View className='noise-dot' style={{ backgroundColor: color }} />
      {levelLabel(level)}
    </View>
  );
}
