import React, {Component} from 'react';
import {Image, Text as RNText} from 'react-native';
import {
  Defs,
  FeComposite,
  FeOffset,
  Filter,
  G,
  Path,
  Rect,
  Svg,
  Text,
  Use,
} from 'react-native-svg';

class QuickTestExample extends Component {
  static title = 'QuickTestExample';
  render() {
    return (
      <Svg width="200" height="200">
        <Filter id="offset" width="180" height="180">
          <FeComposite in="SourceGraphic" in2="BackgroundImage" operator="in" />
        </Filter>
        <Rect x="50" y="50" width="100" height="100" fill="red" />
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="blue"
          filter="url(#offset)"
        />
      </Svg>
    );
  }
}

class ReferenceExample extends Component {
  static title = 'Composite';
  render() {
    return (
      <>
        <Svg width="330" height="135" viewBox="0 0 1100 325">
          <Defs>
            <Filter
              id="overNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                operator="over"
                result="comp"
              />
            </Filter>
            <Filter
              id="inNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                operator="in"
                result="comp"
              />
            </Filter>
            <Filter
              id="outNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                operator="out"
                result="comp"
              />
            </Filter>
            <Filter
              id="atopNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                operator="atop"
                result="comp"
              />
            </Filter>
            <Filter
              id="xorNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                operator="xor"
                result="comp"
              />
            </Filter>
            <Filter
              id="arithmeticNoFlood"
              filterUnits="objectBoundingBox"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%">
              <FeComposite
                in="SourceGraphic"
                in2="BackgroundImage"
                result="comp"
                operator="arithmetic"
                k1=".5"
                k2=".5"
                k3=".5"
                k4=".5"
              />
            </Filter>
            <Path id="Blue100" d="M 0 0 L 100 0 L 100 100 z" fill="#00ffff" />
            <Path id="Red100" d="M 0 0 L 0 100 L 100 0 z" fill="#ff00ff" />
            <Path
              id="Blue50"
              d="M 0 125 L 100 125 L 100 225 z"
              fill="#00ffff"
              fillOpacity="0.5"
            />
            <Path
              id="Red50"
              d="M 0 125 L 0 225 L 100 125 z"
              fill="#ff00ff"
              fillOpacity="0.5"
            />
            <G id="TwoBlueTriangles">
              <Path id="Blue100" d="M 0 0 L 100 0 L 100 100 z" fill="#00ffff" />
              <Path
                id="Blue50"
                d="M 0 125 L 100 125 L 100 225 z"
                fill="#00ffff"
                fillOpacity="0.5"
              />
            </G>
            <G id="BlueTriangles">
              <Use transform="translate(275,25)" href="#TwoBlueTriangles" />
              <Use transform="translate(400,25)" href="#TwoBlueTriangles" />
              <Use transform="translate(525,25)" href="#TwoBlueTriangles" />
              <Use transform="translate(650,25)" href="#TwoBlueTriangles" />
              <Use transform="translate(775,25)" href="#TwoBlueTriangles" />
              <Use transform="translate(900,25)" href="#TwoBlueTriangles" />
            </G>
          </Defs>

          <Rect
            fill="none"
            stroke="blue"
            x="1"
            y="1"
            width="1098"
            height="323"
          />
          <G fontFamily="Verdana" fontSize="40" shapeRendering="crispEdges">
            <G enableBackground="new">
              <Text x="15" y="75">
                opacity 1.0
              </Text>
              <Text x="15" y="115" fontSize="27">
                (without feFlood)
              </Text>
              <Text x="15" y="200">
                opacity 0.5
              </Text>
              <Text x="15" y="240" fontSize="27">
                (without feFlood)
              </Text>
              <Use href="#BlueTriangles" />
              <G transform="translate(275,25)">
                <Use href="#Red100" filter="url(#overNoFlood)" />
                <Use href="#Red50" filter="url(#overNoFlood)" />
                <Text x="5" y="275">
                  over
                </Text>
              </G>
              <G transform="translate(400,25)">
                <Use href="#Red100" filter="url(#inNoFlood)" />
                <Use href="#Red50" filter="url(#inNoFlood)" />
                <Text x="35" y="275">
                  in
                </Text>
              </G>
              <G transform="translate(525,25)">
                <Use href="#Red100" filter="url(#outNoFlood)" />
                <Use href="#Red50" filter="url(#outNoFlood)" />
                <Text x="15" y="275">
                  out
                </Text>
              </G>
              <G transform="translate(650,25)">
                <Use href="#Red100" filter="url(#atopNoFlood)" />
                <Use href="#Red50" filter="url(#atopNoFlood)" />
                <Text x="10" y="275">
                  atop
                </Text>
              </G>
              <G transform="translate(775,25)">
                <Use href="#Red100" filter="url(#xorNoFlood)" />
                <Use href="#Red50" filter="url(#xorNoFlood)" />
                <Text x="15" y="275">
                  xor
                </Text>
              </G>
              <G transform="translate(900,25)">
                <Use href="#Red100" filter="url(#arithmeticNoFlood)" />
                <Use href="#Red50" filter="url(#arithmeticNoFlood)" />
                <Text x="-25" y="275">
                  arithmetic
                </Text>
              </G>
            </G>
          </G>
        </Svg>
        <RNText>W3 Reference</RNText>
        <Image source={require('./feComposite.png')} />
      </>
    );
  }
}

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Filter id="iconCompositeIn" width="200%">
      <FeComposite
        in="SourceGraphic"
        in2="BackgroundImage"
        operator="in"
        result="comp"
      />
    </Filter>
    <Path id="Blue100" d="M 0 0 L 20 0 L 20 20 z" fill="#00ffff" />
    <Path
      id="Red100"
      d="M 0 0 L 0 20 L 20 0 z"
      fill="#ff00ff"
      filter="url(#iconCompositeIn)"
    />
  </Svg>
);

const samples = [ReferenceExample, QuickTestExample];
export {icon, samples};
