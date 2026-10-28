import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Circle, Rect, Svg} from 'react-native-svg';

// Elements without onLayout should not dispatch native layout events,
// while onLayout on <Svg> and on a child element should still fire.
export default function Test2994() {
  const [svgLayout, setSvgLayout] = useState('none');
  const [rectLayout, setRectLayout] = useState('none');
  const [wide, setWide] = useState(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg
        width={200}
        height={200}
        onLayout={e => setSvgLayout(JSON.stringify(e.nativeEvent.layout))}>
        {Array.from({length: 100}, (_, i) => (
          <Circle
            key={i}
            cx={10 + (i % 10) * 20}
            cy={110 + Math.floor(i / 10) * 9}
            r={3}
            fill="red"
          />
        ))}
        <Rect
          x={10}
          y={10}
          width={wide ? 180 : 80}
          height={80}
          fill="blue"
          onLayout={e => setRectLayout(JSON.stringify(e.nativeEvent.layout))}
        />
      </Svg>
      <Text testID="svgLayout">Svg onLayout: {svgLayout}</Text>
      <Text testID="rectLayout">Rect onLayout: {rectLayout}</Text>
      <Button title="Toggle rect width" onPress={() => setWide(w => !w)} />
    </View>
  );
}
