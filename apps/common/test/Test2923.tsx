import * as React from 'react';
import {View} from 'react-native';
import Svg, {Rect, G} from 'react-native-svg';

export default function Test2923() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="200" height="200" viewBox="0 0 200 200">
        {/* Columns: fill only | stroke only | fill + stroke */}
        <G strokeWidth={4}>
          {/* Row 1: no opacity set */}
          <Rect
            x="5"
            y="5"
            width="55"
            height="40"
            color="blue"
            fill="currentColor"
          />
          <Rect
            x="72"
            y="5"
            width="55"
            height="40"
            color="red"
            fill="none"
            stroke="currentColor"
          />
          <Rect
            x="139"
            y="5"
            width="55"
            height="40"
            color="green"
            fill="currentColor"
            stroke="currentColor"
          />
          {/* Row 2: fill-opacity=0.5 */}
          <Rect
            x="5"
            y="53"
            width="55"
            height="40"
            color="blue"
            fill="currentColor"
            fillOpacity={0.5}
          />
          <Rect
            x="72"
            y="53"
            width="55"
            height="40"
            color="red"
            fill="none"
            stroke="currentColor"
          />
          <Rect
            x="139"
            y="53"
            width="55"
            height="40"
            color="green"
            fill="currentColor"
            fillOpacity={0.5}
            stroke="currentColor"
          />
          {/* Row 3: stroke-opacity=0.5 */}
          <Rect
            x="5"
            y="101"
            width="55"
            height="40"
            color="blue"
            fill="currentColor"
          />
          <Rect
            x="72"
            y="101"
            width="55"
            height="40"
            color="red"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.5}
          />
          <Rect
            x="139"
            y="101"
            width="55"
            height="40"
            color="green"
            fill="currentColor"
            stroke="currentColor"
            strokeOpacity={0.5}
          />
          {/* Row 4: fill-opacity=0.5, stroke-opacity=0.5 */}
          <Rect
            x="5"
            y="149"
            width="55"
            height="40"
            color="blue"
            fill="currentColor"
            fillOpacity={0.5}
          />
          <Rect
            x="72"
            y="149"
            width="55"
            height="40"
            color="red"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.5}
          />
          <Rect
            x="139"
            y="149"
            width="55"
            height="40"
            color="green"
            fill="currentColor"
            fillOpacity={0.5}
            stroke="currentColor"
            strokeOpacity={0.5}
          />
        </G>
      </Svg>
    </View>
  );
}
