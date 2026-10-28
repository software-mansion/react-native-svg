import React, {useRef, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import Svg, {Circle, FeDropShadow, Filter} from 'react-native-svg';

// Scrolling the Svg out of a removeClippedSubviews ScrollView detaches it,
// which recycles its bitmap while the view stays registered. A toDataURL
// that lands then draws the filter against that recycled bitmap.
export default function Test3103() {
  const svgRef = useRef<Svg>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [result, setResult] = useState('not captured');

  const capture = () => {
    scrollRef.current?.scrollTo({y: 2000, animated: false});
    setTimeout(() => {
      svgRef.current?.toDataURL(base64 =>
        setResult(`captured ${base64.length} chars`),
      );
    }, 500);
  };

  return (
    <View style={{flex: 1, paddingTop: 60}}>
      <Button title="Scroll away, then toDataURL" onPress={capture} />
      <Text testID="result">{result}</Text>
      <ScrollView ref={scrollRef} removeClippedSubviews style={{flex: 1}}>
        <Svg ref={svgRef} width={120} height={120}>
          <Filter id="shadow">
            <FeDropShadow dx={2} dy={2} stdDeviation={3} />
          </Filter>
          <Circle cx={60} cy={60} r={40} fill="tomato" filter="url(#shadow)" />
        </Svg>
        <View style={{height: 3000}} />
      </ScrollView>
    </View>
  );
}
