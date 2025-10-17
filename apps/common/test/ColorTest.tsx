import {Alert, View} from 'react-native';
import {Circle, G, Rect, Svg, Text} from 'react-native-svg';

export default () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Svg
        height="220"
        width="220"
        viewBox="0 0 240 240"
        onPress={() => Alert.alert('Pressed on SVG')}>
        {/* <G onPress={() => Alert.alert('Pressed on G')} collapsable={false}> */}

        <G>
          <Circle
            cx="90"
            cy="0"
            r="30"
            fill="red"
            x="20"
            onPress={() => Alert.alert('Pressed on Circle')}
          />
        </G>
        <Text
          fill="black"
          fontWeight="bold"
          fontSize="40"
          x="100"
          y="40"
          onPress={() => Alert.alert('Pressed on Text')}>
          H
        </Text>

        <Circle
          cx="90"
          cy="80"
          r="30"
          fill="green"
          x="20"
          onPress={() => Alert.alert('Pressed on Circle')}
        />

        <Circle
          cx="90"
          cy="150"
          r="30"
          fill="red"
          x="20"
          onPress={() => Alert.alert('Pressed on Circle')}
        />

        <Rect
          x="20"
          y="100"
          width="40"
          height="40"
          fill="yellow"
          onPress={() => Alert.alert('Pressed on Rect')}
        />
        {/* </G> */}
      </Svg>
    </View>
  );
};
