import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';

// viewBox scale 3, then translate(10,10), then translate(20,5) scale(0.5).
// The blue non-scaling-stroke path must lie on the red one.
const d = 'M0,0 L40,0 L40,40 Z';

export default function Test3090() {
  const ref = useRef<Path>(null);
  const [screenCtm, setScreenCtm] = useState('');
  const [ctm, setCtm] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setScreenCtm(JSON.stringify(ref.current?.getScreenCTM()));
      setCtm(JSON.stringify(ref.current?.getCTM()));
    }, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width={300} height={150} viewBox="0 0 100 50">
        <G transform="translate(10,10)">
          <G transform="translate(20,5) scale(0.5)">
            <Path d={d} fill="none" stroke="red" strokeWidth={6} />
            <Path
              ref={ref}
              d={d}
              fill="none"
              stroke="blue"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </G>
        </G>
      </Svg>
      <Text>getScreenCTM: {screenCtm}</Text>
      <Text>expected: a=1.5 d=1.5 e=90 f=45</Text>
      <Text>getCTM: {ctm}</Text>
      <Text>expected: a=0.5 d=0.5 e=30 f=15</Text>
    </View>
  );
}
