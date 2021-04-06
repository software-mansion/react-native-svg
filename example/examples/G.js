'use strict';
import React, {useState, useEffect} from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, G, Circle, Line, Rect, Text, Use} from 'react-native-svg';

export const GroupPage: React.FunctionComponent<{}> = () => {
  const [fill, _setFill] = useState('purple');
  useEffect(() => {
    setTimeout(() => {
      _setFill('#856');
    }, 2000);
  });

  return (
    <Page title="G">
      <Example title="G children props inherit">
        <Svg height="100" width="100">
          <G fill={fill} stroke="pink" strokeWidth="3">
            <Circle cx="25" cy="25" r="11" />
            <Circle cx="25" cy="75" r="11" stroke="red" />
            <Circle cx="50" cy="50" r="11" fill="green" />
            <Circle cx="75" cy="25" r="11" stroke="red" />
            <Circle cx="75" cy="75" r="11" />
          </G>
        </Svg>
      </Example>
      <Example title="G transform">
        <Svg height="100" width="200">
          <G rotate="50" origin="40, 30" id="group">
            <Line
              x1="60"
              y1="10"
              x2="140"
              y2="10"
              stroke="#060"
              strokeWidth="1"
            />
            <Rect
              x="60"
              y="20"
              height="50"
              width="80"
              stroke="#060"
              strokeWidth="1"
              fill="#060"
            />
            <Text
              x="100"
              y="75"
              stroke="#600"
              strokeWidth="1"
              fill="#600"
              textAnchor="middle">
              Text grouped with shapes
            </Text>
          </G>
          <Use
            href="#group"
            x="5"
            y="40"
            rotate="-50"
            scale="0.75"
            stroke="red"
            opacity="0.5"
          />
        </Svg>
      </Example>
    </Page>
  );
};
