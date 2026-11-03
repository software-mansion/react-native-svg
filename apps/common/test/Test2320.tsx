import React from 'react';
import {Button, View} from 'react-native';
import {Circle, Svg, SvgUri} from 'react-native-svg';

// https://github.com/software-mansion/react-native-svg/issues/2320
// SvgUri (and the other URI components) accept an optional `headers` prop
// that is forwarded to the underlying fetch call, mirroring
// ImageURISource.headers.
export default () => {
  const [uri, setUri] = React.useState<string | null>(null);

  // Keep the headers object referentially stable so the effect does not
  // re-run and re-fetch on every render.
  const headers = React.useMemo(
    () => ({
      Authorization: 'Bearer example-token',
      'X-Custom-Header': 'react-native-svg',
    }),
    [],
  );

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
        {uri && (
          <SvgUri uri={uri} headers={headers} width={80} height={80} />
        )}
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
