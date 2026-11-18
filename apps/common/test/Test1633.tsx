import * as React from 'react';
import {View} from 'react-native';
import Svg, {Defs, G, LinearGradient, Rect, Stop} from 'react-native-svg';

const STRIPE_OFFSETS = [16, 48, 80, 112, 144, 176];

export default function Test1633() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Svg width="200" height="200" viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="rgba">
            <Stop offset="0" stopColor="rgba(255, 0, 0, 0.5)" />
            <Stop offset="1" stopColor="rgba(0, 0, 255, 0.5)" />
          </LinearGradient>
          <LinearGradient id="transparent">
            <Stop offset="0" stopColor="transparent" stopOpacity="0" />
            <Stop offset="1" stopColor="rgba(14, 14, 14, 0.45)" />
          </LinearGradient>
          <LinearGradient id="opaque">
            <Stop offset="0" stopColor="red" stopOpacity="0.5" />
            <Stop offset="1" stopColor="blue" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        <G fill="black">
          {STRIPE_OFFSETS.map(x => (
            <Rect key={x} x={x} y="0" width="16" height="200" />
          ))}
        </G>
        {/* The first row must look exactly like the last one */}
        <Rect x="8" y="16" width="184" height="48" fill="url(#rgba)" />
        <Rect x="8" y="80" width="184" height="48" fill="url(#transparent)" />
        <Rect x="8" y="144" width="184" height="48" fill="url(#opaque)" />
      </Svg>
    </View>
  );
}
