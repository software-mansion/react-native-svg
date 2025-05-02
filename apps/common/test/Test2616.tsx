import {Defs, G, Path, Pattern, Rect, Svg} from 'react-native-svg';

export default function IconWithHexAlpha() {
  return (
    <Svg height={'500'} width={'500'}>
      <Defs>
        <Pattern
          id={'pattern'}
          patternUnits="userSpaceOnUse"
          width={9}
          height={9}>
          <G stroke="#00000030" strokeWidth={3}>
            <Path d="M0,9 l9,-9" />
            <Path d="M-1,1 l2,-2" />
            <Path d="M8,10 l2,-2" />
          </G>
        </Pattern>
      </Defs>
      <Rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        fill={`url(#${'pattern'})`}
      />
    </Svg>
  );
}
