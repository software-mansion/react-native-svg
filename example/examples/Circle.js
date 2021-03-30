'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Circle} from 'react-native-svg-desktop';

export const CirclePage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Circle">
      <Example title="Circle">
        <Svg height="100" width="140">
          <Circle cx="50%" cy="50%" r="40%" fill="pink" />
        </Svg>
      </Example>
      <Example title="Stroke Circle">
        <Svg height="100" width="100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="purple"
            strokeWidth="2.5"
            fill="none"
          />
        </Svg>
      </Example>
      <Example title="Circle with strokeOpacity">
        <Svg height="100" width="100">
          <Circle
            cx="50"
            cy="50"
            r="40"
            stroke="purple"
            strokeOpacity="0.5"
            strokeWidth="10"
            fill="pink"
          />
        </Svg>
      </Example>
      <Example title="Draw a Pie shape with circle">
        <Svg height="100" width="100">
          <Circle cx="50" cy="50" r="40" fill="#ddd" />
          <Circle
            origin="50, 50"
            rotate="-90"
            cx="50"
            cy="50"
            r="20"
            stroke="#0074d9"
            strokeWidth="40"
            fill="none"
            strokeDasharray="80, 160"
          />
        </Svg>
      </Example>
    </Page>
  );
};
