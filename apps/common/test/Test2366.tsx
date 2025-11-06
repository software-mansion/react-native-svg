import React from 'react';
import {View} from 'react-native';
import {FeColorMatrix, Filter, Rect, Svg} from 'react-native-svg';

export default () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg height="200" width="200">
        <Filter id="filter">
          <FeColorMatrix
            type="matrix"
            values="
              78 -70 -7 0 0
              -21 29 -7 0 0
              -21 -70 0 0 0
              0 0 0 1 0"
          />
          <FeColorMatrix
            type="matrix"
            values="0.2126, 0.7152, 0.0722, 0, 0, 
                    0.2126, 0.7152, 0.0722, 0, 0, 
                    0.2126, 0.7152, 0, 0, 0, 
                    0, 0, 0, 1, 0"
          />
        </Filter>
        <Rect width="200" height="200" fill="red" filter="url(#filter)" />
      </Svg>
    </View>
  );
};
