'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {Svg, G, Path, Circle, Defs, Rect, Polyline} from 'react-native-svg';

export const StrokingPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Stroking">
      <Example title="The stroke property defines the color of a line, text or outline of an element">
        <Svg height="80" width="225">
          <G strokeWidth="1">
            <Path stroke="red" d="M5 20 l215 0" />
            <Path stroke="black" d="M5 40 l215 0" />
            <Path stroke="blue" d="M5 60 l215 0" />
          </G>
        </Svg>
      </Example>
      <Example title="The strokeLinecap property defines different types of endings to an open path">
        <Svg height="80" width="225">
          <G stroke="red" strokeWidth="8">
            <Path strokeLinecap="butt" d="M5 20 l215 0" />
            <Path strokeLinecap="round" d="M5 40 l215 0" />
            <Path strokeLinecap="square" d="M5 60 l215 0" />
          </G>
        </Svg>
      </Example>
      <Example title="strokeDasharray">
        <Svg height="80" width="225">
          <G fill="none" stroke="black" strokeWidth="4">
            <Path strokeDasharray="5,5" d="M5 20 l215 0" />
            <Path strokeDasharray="10,10" d="M5 40 l215 0" />
            <Path strokeDasharray="20,10,5,5,5,10" d="M5 60 l215 0" />
          </G>
        </Svg>
      </Example>
      <Example title="the strokeDashoffset attribute specifies the distance into the dash pattern to start the dash.">
        <Svg height="80" width="200">
          <Circle
            cx="100"
            cy="40"
            r="35"
            strokeWidth="5"
            stroke="red"
            fill="none"
            strokeDasharray="100"
            strokeDashoffset="0"
          />
          {/* <Text
                stroke="blue"
                strokeWidth="1"
                fill="none"
                fontSize="20"
                fontWeight="bold"
                x="100"
                y="40"
                textAnchor="middle"
                strokeDasharray="100"
                strokeDashoffset="60">
                STROKE
            </Text> */}
        </Svg>
      </Example>
      <Example title="Advanced stroke example.">
        <Svg height="80" width="200">
          <Defs>
            {/* <RadialGradient
                id="advanced-stroke-grad"
                cx="50%"
                cy="50%"
                rx="80%"
                ry="80%"
                fx="50%"
                fy="50%">
                <Stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
                <Stop offset="100%" stopColor="#f00" stopOpacity="1" />
            </RadialGradient>
             <ClipPath id="advanced-stroke-clip">
                <Circle r="96" cx="100" cy="40" />
            </ClipPath> */}
          </Defs>
          <Rect
            x="5"
            y="5"
            height="70"
            width="190"
            fill="blue"
            stroke="url(#advanced-stroke-grad)"
            strokeWidth="5"
            strokeDasharray="10"
            clipPath="url(#advanced-stroke-clip)"
          />
          <Polyline
            strokeDasharray="20,10,5,5,5,10"
            points="10,10 20,12 30,20 40,60 60,70 90,55"
            fill="none"
            stroke="url(#advanced-stroke-grad)"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </Svg>
      </Example>
    </Page>
  );
};
