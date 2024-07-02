import React, {useRef, useState} from 'react';
import {Button, Image, View} from 'react-native';
import {Circle, Svg} from 'react-native-svg';

export default () => {
  const ref = useRef<Svg>(null);
  const [s, setS] = useState('');
  return (
    <View style={{flex: 1, paddingTop: 100}}>
      <Button
        onPress={() => {
          ref.current?.toDataURL(source => {
            setS(source);
            console.log(source);
          });
        }}
        title="log data url"
      />
      <Image
        width={400}
        height={300}
        source={{uri: `data:image/png;base64,${s}`}}
      />
      <Svg width={400} height={300} ref={ref}>
        <Circle cx={200} cy={150} r={100} fill="red" />
      </Svg>
    </View>
  );
};
