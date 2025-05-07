import {Svg, Defs, Pattern, Path, Rect} from 'react-native-svg';

export default function Test2615() {
  return (
    <Svg color={'red'}>
      <Defs>
        <Pattern
          id={'pattern'}
          patternUnits="userSpaceOnUse"
          width={9}
          height={9}>
          <Path d="M -1,2 l 6,0" stroke="currentColor" strokeWidth={3} />
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
