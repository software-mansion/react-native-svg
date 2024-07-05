import React from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
<g clip-path="url(#clip0_8_3)">
<rect width="100" height="100" fill="white"/>
<mask id="mask0_8_3" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
<circle cx="50" cy="50" r="50" fill="#7e7e7e"/>
</mask>
<g mask="url(#mask0_8_3)">
<rect x="-26" y="-78" width="209" height="263" fill="#252E74"/>
</g>
</g>
<defs>
<clipPath id="clip0_8_3">
<rect width="100" height="100" fill="white"/>
</clipPath>
</defs>
</svg>
`;

export default function Test1790() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <SvgXml xml={svg} />
    </View>
  );
}
