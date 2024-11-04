import React from 'react';
import {SvgUri, Circle, Svg} from 'react-native-svg';
import {Button, View} from 'react-native';

export default () => {
  const [uri, setUri] = React.useState<string | null>(null);

  return (
    <View style={{flex: 1, paddingTop: 100}}>
      <Svg width={200} height={200}>
        <Circle
          cx={60}
          cy={60}
          r={50}
          stroke="black"
          strokeWidth={5}
          fill="none"
        />
        {uri && <SvgUri uri={uri} width={80} height={80} />}
      </Svg>
      <Button
        color={'#000000'}
        title="Toggle image"
        onPress={() => {
          if (!uri) {
            setUri(
              'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg',
            );
          } else {
            setUri(null);
          }
        }}
      />
    </View>
  );
};
