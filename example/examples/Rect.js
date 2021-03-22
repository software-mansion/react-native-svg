'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, Rect} from 'react-native-svg-desktop';

export const RectPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Rect">
      <Example title="Rect">
        <Svg width="200" height="60">
          <Rect
            x="5%"
            y="5%"
            width="90%"
            height="90%"
            fill="rgb(0,0,255)"
            strokeWidth="3"
            stroke="rgb(0,0,0)"
            strokeDasharray="5,10"
          />
        </Svg>
      </Example>
      <Example title="'stroke' or 'fill' Rect">
        <Svg width="100" height="100">
          <Rect
            x="20"
            y="20"
            width="75"
            height="75"
            fill="blue"
            fillOpacity="0.5"
            stroke="red"
            strokeWidth="5"
            strokeOpacity="0.5"
          />
        </Svg>
      </Example>
      <Example title="A rectangle with rounded corners">
        <Svg width="100" height="100">
          <Rect
            x="20"
            y="20"
            rx="20"
            ry="20"
            width="75"
            height="75"
            fill="blue"
            stroke="pink"
            strokeWidth="5"
          />
        </Svg>
      </Example>
      <Example title="Rect with different 'rx' and 'ry'">
        <Svg width="100" height="100">
          <Rect
            x="20"
            y="20"
            rx="40"
            ry="20"
            width="75"
            height="75"
            fill="blue"
            stroke="pink"
            strokeWidth="5"
          />
        </Svg>
      </Example>
      <Example title="Rect with 'rx' or 'ry' overflowed">
        <Svg width="100" height="100">
          <Rect
            x="20"
            y="20"
            ry="40"
            width="75"
            height="75"
            fill="blue"
            stroke="pink"
            strokeWidth="5"
          />
        </Svg>
      </Example>
    </Page>
  );
};
