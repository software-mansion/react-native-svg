import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Mask, Path, Rect} from 'react-native-svg';

export default function App() {
  return (
    <View style={styles.main}>
      <Svg
        height="200"
        viewBox="0 0 200 200"
        width="200"
        transform={[{scale: -2}]}>
        <Path d="M10,35 A20,20,0,0,1,50,35 A20,20,0,0,1,90,35 Q90,65,50,95 Q10,65,10,35 Z" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    width: 100,
    height: 100,
    transform: [{scale: 0}], // Causes the application to crash
  },
});
