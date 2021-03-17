import React from 'react';

import {Svg, Rect} from 'react-native-svg-desktop';

const App: () => React$Node = () => {
  return (
    <Svg height="1000" width="1000">
      <Rect x="50" y="50" rx="50" ry="50" height="75" width="75" fill="blue" />
    </Svg>
  );
};

export default App;
