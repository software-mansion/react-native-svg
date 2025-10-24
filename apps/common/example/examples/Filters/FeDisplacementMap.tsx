import React from 'react';
import {
  Circle,
  FeDisplacementMap,
  FeTurbulence,
  Filter,
  Image,
  Svg,
} from 'react-native-svg';

function MDNExample() {
  return (
    <Svg width="200" height="200" viewBox="0 0 220 220">
      <Filter id="displacementFilter">
        <FeTurbulence
          type="turbulence"
          baseFrequency="0.05"
          numOctaves="2"
          result="turbulence"
        />
        <FeDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale="50"
          xChannelSelector="R"
          yChannelSelector="B"
        />
      </Filter>

      <Circle cx="100" cy="100" r="100" filter="url(#displacementFilter)" />
    </Svg>
  );
}
MDNExample.title = 'MDN Example';

function CustomExample() {
  return (
    <Svg viewBox="0 0 200 200">
      <Filter id="noise">
        <FeTurbulence baseFrequency="0.1 0.01" result="NOISE" numOctaves="2" />
        <FeDisplacementMap
          in="SourceGraphic"
          in2="NOISE"
          scale="20"
          xChannelSelector="R"
          yChannelSelector="R"
        />
      </Filter>

      <Image
        href="https://live.mdnplay.dev/en-US/docs/Web/SVG/Reference/Element/feBlend/mdn_logo_only_color.png"
        x="0"
        y="0"
        width="100%"
        height="100%"
        filter="url(#noise)"
      />
    </Svg>
  );
}
CustomExample.title = 'Custom Example';

const icon = (
  <Svg width="30" height="30" viewBox="0 0 220 220">
    <Filter id="displacementFilter">
      <FeTurbulence
        type="turbulence"
        baseFrequency="0.8"
        numOctaves="2"
        result="turbulence"
      />
      <FeDisplacementMap
        in2="turbulence"
        in="SourceGraphic"
        scale="6.82"
        xChannelSelector="R"
        yChannelSelector="B"
      />
    </Filter>

    <Circle cx="100" cy="100" r="100" filter="url(#displacementFilter)" />
  </Svg>
);
const samples = [MDNExample, CustomExample];

export {icon, samples};
