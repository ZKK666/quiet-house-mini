import { PropsWithChildren, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './app.less';

function App({ children }: PropsWithChildren) {
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: 'QuietMap 安静小区雷达' });
  }, []);

  return children as any;
}

export default App;
