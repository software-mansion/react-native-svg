import * as React from 'react';
import {Button, View} from 'react-native';
import Svg, {Defs, Path, Text, TextPath} from 'react-native-svg';

const UP = 'M 40 160 Q 160 40 280 160';
const DOWN = 'M 40 160 Q 160 280 280 160';

// The text should follow the arc when its `d` changes.
export default function Test3134() {
  const [up, setUp] = React.useState(true);
  const d = up ? UP : DOWN;
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="320" height="320">
        <Defs>
          <Path id="arc" d={d} />
        </Defs>
        <Path d={d} stroke="gray" strokeWidth="2" fill="none" />
        <Text fill="black" fontSize="20">
          <TextPath href="#arc">Text along the arc</TextPath>
        </Text>
      </Svg>
      <Button
        title="Bend the arc the other way"
        onPress={() => setUp(value => !value)}
      />
    </View>
  );
}
