'use strict';
import React from 'react';
import {Example} from '../components/Example';
import {Page} from '../components/Page';
import {View} from 'react-native';
import {
  Svg,
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

export const GradientsPage: React.FunctionComponent<{}> = () => {
  return (
    <Page title="Gradients">
      <Example title="Define an ellipse with a horizontal linear gradient from yellow to red">
        <Svg height="150" width="300">
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-1)" />
          <Defs>
            <LinearGradient
              id="grad-1"
              x1="65"
              y1="0"
              x2="235"
              y2="0"
              gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="1" />
              <Stop offset="1" stopColor="red" />
            </LinearGradient>
          </Defs>
        </Svg>
      </Example>
      <Example title="Define an ellipse with a horizontal linear gradient from transparent yellow to red, buggy on android and windows">
        <Svg height="150" width="300">
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-1-bug)" />
          <Defs>
            <LinearGradient
              id="grad-1-bug"
              x1="65"
              y1="0"
              x2="235"
              y2="0"
              gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="rgb(255,255,0)" stopOpacity="0" />
              <Stop offset="1" stopColor="red" />
            </LinearGradient>
          </Defs>
        </Svg>
      </Example>
      <Example title="Define an ellipse with a rotated linear gradient from yellow to red">
        <Svg height="150" width="300">
          <Defs>
            <LinearGradient id="grad-2" x1={0} y1={0} x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="1" />
              <Stop offset="100%" stopColor="red" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-2)" />
        </Svg>
      </Example>
      <Example title="Compare gradientUnits='userSpaceOnUse' with default">
        <View
          style={{
            width: 300,
            height: 150,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Svg height="150" width="90">
            <Defs>
              <LinearGradient
                id="defaultUnits"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%">
                <Stop offset="0%" stopColor="#000" stopOpacity="1" />
                <Stop offset="100%" stopColor="#ff0" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              fill="url(#defaultUnits)"
              x="10"
              y="10"
              width="70"
              height="70"
              rx="10"
              ry="10"
            />
          </Svg>
          <Svg height="150" width="90">
            <Defs>
              <LinearGradient
                id="userSpaceOnUse"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
                gradientUnits="userSpaceOnUse">
                <Stop offset="0%" stopColor="#000" stopOpacity="1" />
                <Stop offset="100%" stopColor="#ff0" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              fill="url(#userSpaceOnUse)"
              x="10"
              y="10"
              width="70"
              height="70"
              rx="10"
              ry="10"
            />
          </Svg>
        </View>
      </Example>
      <Example title="Define a linear gradient in percent unit">
        <Svg height="150" width="300">
          <Defs>
            <LinearGradient id="grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="1" />
              <Stop offset="100%" stopColor="red" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* <Text x="25" y="70" fill="#333">
            x1=0%
          </Text>
          <Text x="235" y="70" fill="#333">
            x2=100%
          </Text> */}
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-3)" />
        </Svg>
      </Example>
      <Example title="Define an ellipse with a radial gradient from yellow to purple">
        <Svg height="150" width="300">
          <Defs>
            <RadialGradient
              id="grad-4"
              cx="150"
              cy="75"
              r="85"
              fx="150"
              fy="75"
              gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#ff0" stopOpacity="1" />
              <Stop offset="0.3" stopColor="#000" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#0f0" stopOpacity="1" />
              <Stop offset="1" stopColor="#83a" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-4)" />
        </Svg>
      </Example>
      <Example title="Define a radial gradient in percent unit">
        <Svg height="150" width="300">
          <Defs>
            <RadialGradient
              id="grad-5"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%">
              <Stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00f" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-5)" />
        </Svg>
      </Example>
      <Example title="Define another ellipse with a radial gradient from white to blue">
        <Svg height="150" width="300">
          <Defs>
            <RadialGradient
              id="grad-6"
              cx="60"
              cy="45"
              rx="90"
              ry="45"
              fx="75"
              fy="150">
              <Stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <Stop offset="100%" stopColor="#00f" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#grad-6)" />
        </Svg>
      </Example>
      <Example title="Fill a radial gradient with fillOpacity prop">
        <Svg height="150" width="300">
          <Defs>
            <RadialGradient
              id="grad-7"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%">
              <Stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00f" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx="150"
            cy="75"
            rx="85"
            ry="55"
            fill="url(#grad-7)"
            fillOpacity="0.2"
          />
        </Svg>
      </Example>
      <Example title="Fill a radial gradient inside a rect and stroke it">
        <Svg height="150" width="300">
          <Defs>
            <RadialGradient
              id="grad-8"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%">
              <Stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00f" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect
            x="5"
            y="5"
            width="290"
            height="130"
            fill="url(#grad-8)"
            stroke="pink"
            strokeWidth="5"
          />
        </Svg>
      </Example>
    </Page>
  );
};
