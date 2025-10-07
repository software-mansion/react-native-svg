import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Defs, Path, Pattern, Rect, Svg, SvgProps} from 'react-native-svg';

function EmptyExample() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'gray',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: 'white',
          }}>
          <View style={{width: 100, height: 100}}>
            <TestIcon color={'red'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
EmptyExample.title = '';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Rect x="0" y="0" width="20" height="20" fill="none" stroke="black" />
  </Svg>
);
const samples = [EmptyExample];

export {icon, samples};

const TestIcon = (props: SvgProps) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id={'pattern'}
        patternUnits="userSpaceOnUse"
        width={9}
        height={9}>
        <Path d="M -1,2 l 6,0" stroke="currentColor" strokeWidth={3} />
      </Pattern>
    </Defs>
    <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${'pattern'})`} />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
