import React from 'react';
import {View, Text} from 'react-native';
import {SvgXml} from 'react-native-svg';

// SVG with unsupported feBlend mode="soft-light" — crashed Android before fix
const svg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blend">
      <feFlood flood-color="red" result="red"/>
      <feBlend in="SourceGraphic" in2="red" mode="soft-light"/>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="80" fill="blue" filter="url(#blend)"/>
</svg>
`;

export default function Test2867() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Unsupported feBlend mode=&quot;soft-light&quot; (should not crash)
      </Text>
      <SvgXml xml={svg} />
    </View>
  );
}
