'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Ellipse} from 'react-native-svg-desktop';

export const EllipsePage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Ellipse">
      <Example title="Ellipse">
        <Svg height="100" width="200">
          <Ellipse
            cx="50%"
            cy="50%"
            rx="45%"
            ry="40%"
            stroke="purple"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </Example>
      <Example title="The following example creates three ellipses on top of each other">
        <Svg height="120" width="200">
          <Ellipse cx="98" cy="60" rx="90" ry="30" fill="purple" />
          <Ellipse cx="94" cy="45" rx="80" ry="25" fill="lime" />
          <Ellipse cx="92" cy="30" rx="70" ry="20" fill="yellow" />
        </Svg>
      </Example>
      <Example title="The following example combines two ellipses (one yellow and one white)">
        <Svg height="100" width="200">
          <Ellipse cx="100" cy="50" rx="90" ry="30" fill="yellow" />
          <Ellipse cx="95" cy="50" rx="75" ry="20" fill="white" />
        </Svg>
      </Example>
    </Page>
  );
};
