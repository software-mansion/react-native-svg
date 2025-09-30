import React from 'react';
import {Button, Share, View} from 'react-native';
import {Circle, G, Path, Rect, Svg} from 'react-native-svg';

const Favorite = ({color}: {color: string}): JSX.Element => {
  return (
    <Svg color={color} width="60" height="60" viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.7927 11.1242C21.359 18.5187 12.0003 22.7782 12.0003 22.7782C12.0003 22.7782 2.64153 18.5187 1.20661 11.1242C0.326598 6.58719 2.24925 2.02329 7.13701 2.00007C10.7781 1.98296 12.0003 5.65211 12.0003 5.65211C12.0003 5.65211 13.2226 1.98173 16.8624 2.00007C21.7612 2.02329 23.6727 6.58841 22.7927 11.1242Z"
        fill="currentColor"
      />
      <G color={color === 'green' ? 'red' : 'green'} fill="purple">
        <G>
          <Rect x="16" y="16" width="8" height="8" fill="currentColor" />
          <G color="pink">
            <Rect
              x="0"
              y="16"
              width="8"
              height="8"
              color="gold"
              fill="currentColor"
            />
            <Circle cx="12" cy="20" r="4" fill="currentColor" />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default () => {
  const [color, setColor] = React.useState('green');
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Favorite color={color} />
      <Button
        onPress={() => setColor(prev => (prev === 'green' ? 'red' : 'green'))}
        title="toggle color"
      />
      <Button
        title="share"
        onPress={() => Share.share({message: 'This is test message'})}
      />
    </View>
  );
};
