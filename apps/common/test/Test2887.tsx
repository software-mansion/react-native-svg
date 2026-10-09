import * as React from 'react';
import {Button, Image as RNImage, View} from 'react-native';
import Svg, {Circle, Image} from 'react-native-svg';

// On web, the PNG from toDataURL used to be missing the <Image>.
export default function Test2887() {
  const ref = React.useRef<Svg | null>(null);
  const [png, setPng] = React.useState<string | null>(null);
  return (
    <View>
      <Svg ref={ref} width={200} height={200}>
        <Circle cx={100} cy={100} r={90} fill="lightblue" />
        <Image
          href="https://picsum.photos/id/237/100/100"
          x={50}
          y={50}
          width={100}
          height={100}
        />
      </Svg>
      <Button
        title="toDataURL"
        onPress={() => ref.current?.toDataURL(setPng)}
      />
      {png && (
        <RNImage
          source={{uri: `data:image/png;base64,${png}`}}
          style={{width: 200, height: 200}}
        />
      )}
    </View>
  );
}
