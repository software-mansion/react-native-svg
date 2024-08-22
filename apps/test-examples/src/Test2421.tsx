import {StyleSheet, View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';

export default function App() {
  return (
    <View style={styles.main}>
      <View style={styles.main}>
        <Svg style={styles.svg} viewBox="0 0 100 100" fill="none">
          <Rect x="0" y="0" width="100%" height="100%" fill="#080" />
        </Svg>
      </View>
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
