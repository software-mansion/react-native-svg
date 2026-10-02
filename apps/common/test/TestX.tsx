import * as React from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';

const xml = `
<svg viewBox="0 0 30 10">
  <g font-size="none" font-weight="none" font-style="none" letter-spacing="auto">
    <rect width="10" height="10" fill="red"/>
  </g>
  <rect x="20" width="none" height="10" fill="blue"/>
</svg>`;

export default function TestInvalidValues() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <SvgXml xml={xml} width={300} height={100} />
    </View>
  );
}
