import React, {useRef, useState} from 'react';
import {Button, Image, ScrollView, Text, View} from 'react-native';
import Svg, {
  Circle,
  FeDropShadow,
  FeOffset,
  Filter,
  Rect,
} from 'react-native-svg';

// Scrolling the Svg out of a removeClippedSubviews ScrollView detaches it,
// which recycles its bitmap while the view stays registered. A toDataURL
// that lands then draws the filter against that recycled bitmap.
function CaptureAfterDetach() {
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
    <View style={{flex: 1}}>
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

// The filter shifts BackgroundImage, what was drawn before the circle. The
// green bar is drawn after it, so it must not appear inside the circle's
// filter region: the capture should match the live render.
function CaptureMatchesLive() {
  const svgRef = useRef<Svg>(null);
  const [uri, setUri] = useState<string | null>(null);

  return (
    <View style={{alignItems: 'center'}}>
      <Button
        title="toDataURL"
        onPress={() =>
          svgRef.current?.toDataURL(base64 =>
            setUri(`data:image/png;base64,${base64}`),
          )
        }
      />
      <Text>live</Text>
      <Svg ref={svgRef} width={200} height={100}>
        <Filter id="background">
          <FeOffset in="BackgroundImage" dx={-30} dy={0} />
        </Filter>
        <Rect x={0} y={0} width={100} height={100} fill="blue" />
        <Circle cx={100} cy={50} r={40} fill="red" filter="url(#background)" />
        <Rect x={150} y={0} width={20} height={100} fill="green" />
      </Svg>
      <Text>captured</Text>
      {uri ? (
        <Image
          testID="capture"
          source={{uri}}
          style={{width: 200, height: 100}}
        />
      ) : null}
    </View>
  );
}

export default function Test3103() {
  return (
    <View style={{flex: 1, paddingTop: 60}}>
      <CaptureMatchesLive />
      <CaptureAfterDetach />
    </View>
  );
}
