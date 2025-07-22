import {SafeAreaView, StyleSheet} from 'react-native';
import {SvgUri} from 'react-native-svg';

export default function Test2715() {
  return (
    <SafeAreaView style={styles.container}>
      <SvgUri
        uri="https://www.healthcoachinstitute.com/wp-content/uploads/2021/03/HCI-logo-symbol-color.svg"
        width="100%"
        height="100%"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
