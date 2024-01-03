import * as React from 'react';
import {View, Button, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {SvgCssUri} from 'react-native-svg/css';

const URIs = {
  invalid: 'https://en.wikipedia.org/wiki/File:Vector-based_example.svg',
  valid:
    'https://upload.wikimedia.org/wikipedia/commons/3/30/Vector-based_example.svg',
};

export default function App() {
  const [uri, setUri] = React.useState(URIs.invalid);

  const handlePress = React.useCallback(() => {
    const newUri = uri === URIs.valid ? URIs.invalid : URIs.valid;
    setUri(newUri);
  }, [uri]);

  const title =
    uri === URIs.invalid
      ? 'Render fallback due to invalid SVG'
      : 'Render Valid SVG';

  const buttonTitle = `Switch to ${
    uri === URIs.invalid ? 'valid' : 'invalid'
  } SVG`;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{title}</Text>
      <View style={{paddingVertical: 20}}>
        <SvgCssUri
          onError={() => {}}
          uri={uri}
          width={100}
          height={100}
          fallback={
            <Svg
              width={100}
              height={100}
              viewBox="0 0 100 100"
              transform={[{scaleX: 1}, {scaleY: -1}]}>
              <Circle
                cx={50}
                cy={50}
                r={40}
                stroke="black"
                strokeWidth={3}
                fill="red"
              />
            </Svg>
          }
        />
      </View>
      <Button onPress={handlePress} title={buttonTitle} />
    </View>
  );
}
