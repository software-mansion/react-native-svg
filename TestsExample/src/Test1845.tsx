/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   SafeAreaView,
   View,
   StyleSheet,
   Text,
   useColorScheme,
 } from 'react-native';
 import {Svg, Path, Ellipse} from 'react-native-svg';
 import Animated, {processColor, useAnimatedProps, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';
 
 import {Colors} from 'react-native/Libraries/NewAppScreen';
 
 const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
 
 const App = () => {
   const isDarkMode = useColorScheme() === 'dark';
   const offset = useSharedValue(0);
    offset.value = withRepeat(withTiming(1.0), -1, true);
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
     flex: 1,
   };
 
   const ellipseAnimatedProps = 
   useAnimatedProps(() => 
   {
     const coordinates = {cx: 50, cy: 50, rx: 40, ry: 40, fill: 'blue'};
 
     return {
       cx: coordinates.cx,
       cy: coordinates.cy,
       rx: coordinates.rx,
       ry: coordinates.ry,
       stroke: 'rgb(255,0,0)',
       fill: {type: 0, payload: processColor('blue')},
       opacity: offset.value,
       strokeWidth: 2,
     };
   }
   , []);
 
   return (
     <SafeAreaView style={backgroundStyle}>
       <Svg width="100%" height="100%">
         <AnimatedEllipse
         // {...coordinates}
         animatedProps={ellipseAnimatedProps} 
        />
       </Svg>
     </SafeAreaView>
   );
 };
 
 export default App;