import * as React from 'react';
import { View } from 'react-native';
import Svg, {Rect} from 'react-native-svg';

export default function App() {

  return (
    <View style={{flex: 1}}>
      <Svg width="100%" height="100%" viewBox="0 0 56 56" color="red">
          <Rect width="20" height="20" rx="4" fill="currentColor" opacity={0.2} />
          <Rect x="0" y="25" width="20" height="20" rx="4" fill="red" opacity={0.2} />
          <Rect x="25" y="0" width="20" height="20" rx="4" fill="red" />
          <Rect x="25" y="25" width="20" height="20" rx="4" fill="blue" fillOpacity="0.2"  />
        </Svg>
      </View>
  );
}
