import React, {useState} from 'react';
import Svg, {Path} from 'react-native-svg';
import {StyleSheet, Text, View, Button} from 'react-native';

export default function Test2086() {
  const [display, setDisplay] = useState(false);
  return (
    <View style={styles.container}>
      <View>
        <Text>Click on the button to crash the app</Text>
        <Button onPress={() => setDisplay(state => !state)} title="Run" />
        <MySVG style={{width: 100, height: 100}} toggle={display} />
      </View>
    </View>
  );
}

const MySVG = ({style, toggle}) => {
  return (
    <Svg viewBox="0 0 32 32" style={style}>
      {toggle && (
        <Path
          d="M 16 16 m 16, 0 a 16,16 0 1,1 -32,0 a r,r 0 1,1 32,0"
          stroke="#000"
        />
      )}
      {!toggle && (
        <Path
          d="M 16 16 m 16, 0 a 16,16 0 1,1 -32,0 a 16,16 0 1,1 32,0"
          stroke="#000"
        />
      )}
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 200,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
