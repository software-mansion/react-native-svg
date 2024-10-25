import {View} from 'react-native';
import {G, Rect, Svg} from 'react-native-svg';

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="150" height="150" viewBox="0 0 150 150">
        <G opacity="0.5">
          <Rect width="100" height="100" fill="red" />
          <Rect x="50" y="50" width="100" height="100" fill="green" />
        </G>
      </Svg>

      <Svg width="150" height="150" viewBox="0 0 150 150" opacity="0.5">
        <Rect width="100" height="100" fill="red" />
        <Rect x="50" y="50" width="100" height="100" fill="green" />
      </Svg>
    </View>
  );
}
