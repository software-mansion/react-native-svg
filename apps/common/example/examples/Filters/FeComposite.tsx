import {Image, Text as RNText, View} from 'react-native';
import {
  Defs,
  FeComposite,
  FeFlood,
  FeMerge,
  FeMergeNode,
  Filter,
  G,
  Path,
  Rect,
  Svg,
  Text,
  Use,
} from 'react-native-svg';

import React from 'react';

QuickTestExample.title = 'Quick Test Example';
function QuickTestExample() {
  return (
    <Svg width="200" height="150">
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

ReferenceExample.title = 'FeComposite W3 reference';
function ReferenceExample() {
  return (
    <View style={{backgroundColor: '#fff'}}>
      <Svg width="330" height="195" viewBox="0 0 1100 650">
        <Defs>
          <Filter
            id="overFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
            <FeComposite
              in="SourceGraphic"
              in2="BackgroundImage"
              operator="over"
              result="comp"
            />
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
          <Filter
            id="inFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
            <FeComposite
              in="SourceGraphic"
              in2="BackgroundImage"
              operator="in"
              result="comp"
            />
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
          <Filter
            id="outFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
            <FeComposite
              in="SourceGraphic"
              in2="BackgroundImage"
              operator="out"
              result="comp"
            />
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
          <Filter
            id="atopFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
            <FeComposite
              in="SourceGraphic"
              in2="BackgroundImage"
              operator="atop"
              result="comp"
            />
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
          <Filter
            id="xorFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
            <FeComposite
              in="SourceGraphic"
              in2="BackgroundImage"
              operator="xor"
              result="comp"
            />
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
          <Filter
            id="arithmeticFlood"
            filterUnits="objectBoundingBox"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%">
            <FeFlood floodColor="#ffffff" floodOpacity="1" result="flood" />
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
            <FeMerge>
              <FeMergeNode in="flood" />
              <FeMergeNode in="comp" />
            </FeMerge>
          </Filter>
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
            fillOpacity=".5"
          />
          <Path
            id="Red50"
            d="M 0 125 L 0 225 L 100 125 z"
            fill="#ff00ff"
            fillOpacity=".5"
          />
          <G id="TwoBlueTriangles">
            <Use href="#Blue100" />
            <Use href="#Blue50" />
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

        <Rect fill="none" stroke="blue" x="1" y="1" width="1098" height="648" />
        <G font-family="Verdana" fontSize="40" shape-rendering="crispEdges">
          <G enable-background="new">
            <Text x="15" y="75">
              opacity 1.0
            </Text>
            <Text x="15" y="115" fontSize="27">
              (with FeFlood)
            </Text>
            <Text x="15" y="200">
              opacity 0.5
            </Text>
            <Text x="15" y="240" fontSize="27">
              (with FeFlood)
            </Text>
            <Use href="#BlueTriangles" />
            <G transform="translate(275,25)">
              <Use href="#Red100" filter="url(#overFlood)" />
              <Use href="#Red50" filter="url(#overFlood)" />
              <Text x="5" y="275">
                over
              </Text>
            </G>
            <G transform="translate(400,25)">
              <Use href="#Red100" filter="url(#inFlood)" />
              <Use href="#Red50" filter="url(#inFlood)" />
              <Text x="35" y="275">
                in
              </Text>
            </G>
            <G transform="translate(525,25)">
              <Use href="#Red100" filter="url(#outFlood)" />
              <Use href="#Red50" filter="url(#outFlood)" />
              <Text x="15" y="275">
                out
              </Text>
            </G>
            <G transform="translate(650,25)">
              <Use href="#Red100" filter="url(#atopFlood)" />
              <Use href="#Red50" filter="url(#atopFlood)" />
              <Text x="10" y="275">
                atop
              </Text>
            </G>
            <G transform="translate(775,25)">
              <Use href="#Red100" filter="url(#xorFlood)" />
              <Use href="#Red50" filter="url(#xorFlood)" />
              <Text x="15" y="275">
                xor
              </Text>
            </G>
            <G transform="translate(900,25)">
              <Use href="#Red100" filter="url(#arithmeticFlood)" />
              <Use href="#Red50" filter="url(#arithmeticFlood)" />
              <Text x="-25" y="275">
                arithmetic
              </Text>
            </G>
          </G>
          <G transform="translate(0,325)" enable-background="new">
            <Text x="15" y="75">
              opacity 1.0
            </Text>
            <Text x="15" y="115" fontSize="27">
              (without FeFlood)
            </Text>
            <Text x="15" y="200">
              opacity 0.5
            </Text>
            <Text x="15" y="240" fontSize="27">
              (without FeFlood)
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
    </View>
  );
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
const samples = [QuickTestExample, ReferenceExample];

export {icon, samples};
