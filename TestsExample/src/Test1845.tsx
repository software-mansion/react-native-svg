 import React from 'react';
 import {
   SafeAreaView,
   useColorScheme,
 } from 'react-native';
 import {Svg, Ellipse} from 'react-native-svg';
 import Animated, {createAnimatedPropAdapter, processColor, useAnimatedProps, useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';
 
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
     const coordinates = {cx: 50, cy: 50, rx: 40, ry: 40};
 
     return {
       cx: coordinates.cx,
       cy: coordinates.cy,
       rx: coordinates.rx,
       ry: coordinates.ry,
       stroke: 'rgb(255,0,0)',
       fill: 'yellow',
       opacity: offset.value,
       strokeWidth: 2,
     };
   }
   , [], createAnimatedPropAdapter(
    (props) => {
      if (Object.keys(props).includes('fill')) {
        props.fill = {type: 0, payload: processColor(props.fill)}
      }
      if (Object.keys(props).includes('stroke')) {
        props.stroke = {type: 0, payload: processColor(props.stroke)}
      }
    },
    ['fill', 'stroke']));
 
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