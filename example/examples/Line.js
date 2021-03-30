'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Line} from 'react-native-svg-desktop';

export const LinePage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Line">
      <Example title="Line">
        <Svg height="100" width="100">
          <Line
            x1="10%"
            y1="10%"
            x2="90%"
            y2="90%"
            stroke="red"
            strokeWidth="2"
          />
        </Svg>
      </Example>
      <Example title="Line">
        <Svg height="100" width="200">
          <Line
            x1="40"
            y1="10"
            x2="160"
            y2="10"
            stroke="red"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Line
            x1="40"
            y1="40"
            x2="160"
            y2="40"
            stroke="red"
            strokeWidth="10"
            strokeLinecap="butt"
          />
          <Line
            x1="40"
            y1="80"
            x2="160"
            y2="80"
            stroke="red"
            strokeWidth="10"
            strokeLinecap="square"
          />
        </Svg>
      </Example>
    </Page>
  );
};
