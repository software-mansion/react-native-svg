/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';

 // eslint-disable-next-line no-unused-vars
 import {Svg, G, Rect} from 'react-native-svg-desktop';
 
 const App: () => React$Node = () => {
   return (
     <Svg height="600" width="600">
       <Rect height="60" width="75" fill="green" />
     </Svg>
   );
 };
 
 export default App;
 