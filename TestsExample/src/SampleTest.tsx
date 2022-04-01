import React from 'react';
import { Platform, Button, SafeAreaView } from 'react-native';
import {
  Svg,
  Circle,
  Rect,
  Text,
  TSpan,
  SvgCssUri
} from 'react-native-svg';

const color = PlatformColor(Platform.select({
  ios: 'label',
  android: '@android:color/primary_text_light',
  default: 'black',
}))

export default () => {
  const [test, setTest] = React.useState(50);
  const [uri, setUri] = React.useState('https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/not_existing.svg')

  return (
    <>
      <Svg height="100" width="100" color={color}>
        <Circle
          cx="50"
          cy="50"
          r={test}
          strokeWidth="2.5"
          fill={color}
        />
        <Rect
          x="15"
          y="15"
          width="70"
          height="70"
          stroke="currentColor"
          strokeWidth="5"
        />
      </Svg>
      <Svg height="300" width="300" fill="red">
        <Text x={0} y={0} fontSize={20}>
          <TSpan dx={test} inlineSize={"100%"} fill="currentColor">
          Testing word-wrap... Testing word-wrap... Testing word-wrap... Testing word-wrap...
          </TSpan>
        </Text>
      </Svg>
      <Button title="Click me" onPress={()=> setTest(test + 1)}/>
      <SvgCssUri
        onError={() => setUri('https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg')}
        width="100"
        height="100"
        uri={uri}
      />
    </>
  );
}