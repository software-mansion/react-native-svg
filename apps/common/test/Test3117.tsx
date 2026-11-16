import React, { useState } from 'react';
import { ScrollView, Text as RNText, View } from 'react-native';
import Svg, { Circle, Path, Text } from 'react-native-svg';

// #3116: onLayout is only sent for elements that have a handler. The Path
// and the Text below must still report their layout; the icons have no
// onLayout and must not dispatch any layout event.

const Icon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={10} stroke="black" fill="none" />
    <Path d="M12 6v6l4 2" stroke="black" fill="none" />
  </Svg>
);

export default function Test3117() {
  const [pathLayout, setPathLayout] = useState('waiting');
  const [textLayout, setTextLayout] = useState('waiting');
  return (
    <ScrollView>
      <Svg width={200} height={80}>
        <Path
          d="M10 10 H 90 V 70 H 10 Z"
          fill="orange"
          onLayout={(e) => setPathLayout(JSON.stringify(e.nativeEvent.layout))}
        />
        <Text
          x={110}
          y={45}
          fill="black"
          onLayout={(e) => setTextLayout(JSON.stringify(e.nativeEvent.layout))}>
          Hello
        </Text>
      </Svg>
      <RNText>Path onLayout: {pathLayout}</RNText>
      <RNText>Text onLayout: {textLayout}</RNText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: 200 }, (_, i) => (
          <Icon key={i} />
        ))}
      </View>
    </ScrollView>
  );
}
