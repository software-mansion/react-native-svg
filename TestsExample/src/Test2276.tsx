import React from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';

const xml = `<!-- sample rectangle -->
<!-- <sample rectangle -->
<!-- <sample> rectangle -->
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" x="50" y="50" fill="red" />
  <text fill="black" x="100" y="100">test</text>
</svg>
`;

export default () => {
  return (
    <View style={{marginTop: 100}}>
      <SvgXml xml={xml} />
    </View>
  );
};
