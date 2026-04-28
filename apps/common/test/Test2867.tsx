import React from 'react';
import {Text, ScrollView} from 'react-native';
import {SvgXml} from 'react-native-svg';

// Each SVG uses an unsupported enum value that crashed Android before fix

const blendSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blend">
      <feFlood flood-color="red" result="red"/>
      <feBlend in="SourceGraphic" in2="red" mode="soft-light"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="blue" filter="url(#blend)"/>
</svg>
`;

const colorMatrixSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cm">
      <feColorMatrix type="badType" values="1"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="green" filter="url(#cm)"/>
</svg>
`;

// Bad type with no values attr → mType defaults to MATRIX, mValues is null
const colorMatrixNullValuesSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cmNull">
      <feColorMatrix type="badType"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="green" filter="url(#cmNull)"/>
</svg>
`;

const compositeSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="comp">
      <feFlood flood-color="orange" result="bg"/>
      <feComposite in="SourceGraphic" in2="bg" operator="badOp"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="purple" filter="url(#comp)"/>
</svg>
`;

const gaussianBlurSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blur">
      <feGaussianBlur stdDeviation="3" edgeMode="badMode"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="teal" filter="url(#blur)"/>
</svg>
`;

const filterUnitsSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="fu" filterUnits="badUnits" primitiveUnits="badUnits">
      <feFlood flood-color="pink"/>
    </filter>
  </defs>
  <circle cx="100" cy="50" r="40" fill="brown" filter="url(#fu)"/>
</svg>
`;

export default function Test2867() {
  return (
    <ScrollView contentContainerStyle={{alignItems: 'center', padding: 16}}>
      <Text style={{fontWeight: 'bold', marginBottom: 8}}>
        Unsupported filter enum values (should not crash)
      </Text>

      <Text>feBlend mode="soft-light"</Text>
      <SvgXml xml={blendSvg} />

      <Text>feColorMatrix type="badType"</Text>
      <SvgXml xml={colorMatrixSvg} />

      <Text>feColorMatrix type="badType" (no values)</Text>
      <SvgXml xml={colorMatrixNullValuesSvg} />

      <Text>feComposite operator="badOp"</Text>
      <SvgXml xml={compositeSvg} />

      <Text>feGaussianBlur edgeMode="badMode"</Text>
      <SvgXml xml={gaussianBlurSvg} />

      <Text>filter filterUnits/primitiveUnits="badUnits"</Text>
      <SvgXml xml={filterUnitsSvg} />
    </ScrollView>
  );
}
