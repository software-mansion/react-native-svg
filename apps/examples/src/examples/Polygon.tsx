import React, {Component} from 'react';
import {Svg, G, Path, Polygon} from 'react-native-svg';

class PolygonExample extends Component {
  static title = 'The following example creates a polygon with three sides';
  render() {
    return (
      <Svg height="100" width="100">
        <Polygon
          points="40,5 70,80 25,95"
          fill="lime"
          stroke="purple"
          strokeWidth="1"
        />
      </Svg>
    );
  }
}

class FourSidePolygon extends Component {
  static title = 'The following example creates a polygon with four sides';
  render() {
    return (
      <Svg height="100" width="100">
        <Polygon
          points="70 5 90  75 45 90 25 80"
          fill="lime"
          stroke="purple"
          strokeWidth="1"
        />
      </Svg>
    );
  }
}

class StarPolygon extends Component {
  static title = 'Use the <Polygon /> element to create a star';
  render() {
    return (
      <Svg height="105" width="105">
        <G scale="0.5">
          <Polygon
            points="100,10 40,198 190,78 10,78 160,198"
            fill="lime"
            stroke="purple"
            strokeWidth="5"
          />
        </G>
      </Svg>
    );
  }
}

class EvenOddPolygon extends Component {
  static title = 'Change the fill-rule property to "evenodd"';
  render() {
    return (
      <Svg height="105" width="105">
        <G scale="0.5" fillRule="evenodd">
          <Polygon
            points="100,10 40,198 190,78 10,78 160,198"
            fill="lime"
            stroke="purple"
            strokeWidth="5"
          />
        </G>
        <Svg width="18" height="17" viewBox="0 0 18 17">
          <G fill="red" fillRule="evenodd">
            <Path d="M3.304 15.294h10.993V4.284H3.304v11.01zM16.87 2.997H.732c-.403 0-.732.29-.732.644 0 .353.33.643.732.643H1.99v11.652c0 .354.296.644.657.644H14.91c.008 0 .015-.005.022-.005.008 0 .014.005.022.005.363 0 .658-.29.658-.644V4.284h1.258c.402 0 .731-.29.731-.643 0-.353-.329-.644-.731-.644z" />
            <Path d="M7.355 13.28V6.763a.558.558 0 0 0-.562-.55.558.558 0 0 0-.563.55v6.519c0 .301.253.55.563.55a.558.558 0 0 0 .562-.55M11.442 13.28V6.763a.558.558 0 0 0-.562-.55.558.558 0 0 0-.563.55v6.519c0 .301.253.55.563.55a.558.558 0 0 0 .562-.55M12.737 1.267C12.327.498 11.435.014 10.574.004 10.07-.002 9.545 0 9.264.002 8.624 0 7.532-.002 7.028.004c-.861.01-1.752.494-2.163 1.263-.289.543-.321.85-.343 1.143h1.209c.178-1.212 1.03-1.196 1.759-1.212.056-.002 1.134-.003 1.782-.004.293.001.784.002.84.004.728.016 1.58 0 1.76 1.212h1.208c-.022-.293-.054-.6-.343-1.143" />
          </G>
        </Svg>
      </Svg>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 200 200">
    <Polygon
      points="100,10 40,198 190,78 10,78 160,198"
      fill="lime"
      stroke="purple"
      strokeWidth="10"
    />
  </Svg>
);

const samples = [PolygonExample, FourSidePolygon, StarPolygon, EvenOddPolygon];

export {icon, samples};
