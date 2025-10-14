import {Alert, View} from 'react-native';
import {Circle, Rect, Svg} from 'react-native-svg';

export default () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Svg height="220" width="220" viewBox="0 0 240 240" collapsable={false}>
        {/* <G onPress={() => Alert.alert('Pressed on G')} collapsable={false}> */}
        {/* <Text
              collapsable={false}
              fill="black"
              fontWeight="bold"
              fontSize="40"
              x="100"
              y="40"
              onPress={() => Alert.alert('Pressed on Text')}>
              H
            </Text> */}
        <Circle
          collapsable={false}
          cx="80"
          cy="80"
          r="30"
          fill="green"
          x="20"
          onPress={() => Alert.alert('Pressed on Circle')}
        />
        <Rect
          collapsable={false}
          x="20"
          y="20"
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
