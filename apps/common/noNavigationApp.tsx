/**
 * Sample React Native App for react-native-svg library
 * https://github.com/software-mansion/react-native-svg/tree/main/apps/common/example
 */

/**
 * This is a very simple render of the examples for react-native-svg library, to avoid dependencies on @react-navigation,
 * which may not be fully supported on all platforms and versions of react-native
 */
'use strict';

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {examples} from './example/examples';
import type {Example} from './example/utils/types';
import {commonStyles} from './example/utils/commonStyles';

const ExampleBlock = ({example, index}: {example: Example; index: number}) => {
  if (Array.isArray(example.samples)) {
    return (
      <View
        key={index}
        style={{borderWidth: 1, margin: 15, padding: 15, borderRadius: 5}}>
        {example.icon}
        <View style={[commonStyles.separator, {margin: 10}]} />
        {example.samples.map((sample, index) => {
          return (
            <View key={index} style={{margin: 15}}>
              <Text style={commonStyles.title}>{sample.title}</Text>
              {sample({})}
            </View>
          );
        })}
      </View>
    );
  }

  throw new Error('Unhandled Example type');
};

import {
  Svg,
  Defs,
  SvgXml,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Text as TextS,
  G,
  Path,
  Circle,
  Use,
} from 'react-native-svg';
import {useState, useEffect} from 'react';

//const fill = 'purple';

export default function App() {
  /*
  const [fill, setFill] = useState('yellow');

  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (mounted) {
        setFill('green');
      }
    }, 4000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <Svg height="100" width="100">
      <G fill={fill} stroke="pink" strokeWidth="3">
        <Circle cx="25" cy="25" r="11" />
      </G>
    </Svg>
  );
*/
  /*
  return (    <Svg height="100" width="100">
    <G fill={fill} stroke="pink" strokeWidth="3">
      <Circle cx="25" cy="25" r="11" />
      <Circle cx="25" cy="75" r="11" stroke="red" />
      <Circle cx="50" cy="50" r="11" fill="green" />
      <Circle cx="75" cy="25" r="11" stroke="red" />
      <Circle cx="75" cy="75" r="11" />
    </G>
  </Svg>);
  */
  /*
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" color="blue" >
      <Path
        d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02Z"
        fill="currentColor"
      />
    </Svg>
  );
*/
  /*
  const svgXml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14.1437 3.34932C13.9101 2.54966 13.177 2 12.3439 2L11.7427 2C10.8467 2 10.0758 2.634 9.90296 3.51321L8.85352 8.85006L9.15094 7.89102C9.39431 7.1063 10.1202 6.57143 10.9418 6.57143L14.2351 6.57143L15.6352 7.74347L16.8818 6.57143H16.4905C15.6574 6.57143 14.9242 6.02177 14.6907 5.22211L14.1437 3.34932Z" fill="url(#paint0_radial_56201_15523)"/>
  <path d="M6.0492 16.643C6.28017 17.4465 7.01519 18 7.85121 18H9.07497C10.0844 18 10.9126 17.2009 10.9488 16.1921L11.1295 11.1429L10.842 12.0954C10.6031 12.887 9.87385 13.4286 9.04701 13.4286L5.73383 13.4286L4.34959 12.5434L3.32812 13.4286H3.71324C4.54926 13.4286 5.28427 13.9821 5.51524 14.7855L6.0492 16.643Z" fill="url(#paint1_radial_56201_15523)"/>
  <path d="M12.2503 2H5.68785C3.81286 2 2.68787 4.39748 1.93788 6.79497C1.04933 9.63537 -0.113354 13.4342 3.25037 13.4342H6.11145C6.9435 13.4342 7.67548 12.8878 7.91125 12.0899C8.40466 10.4199 9.26493 7.52162 9.94109 5.31373C10.2857 4.18837 10.5728 3.22188 11.0134 2.62001C11.2604 2.28258 11.6721 2 12.2503 2Z" fill="url(#paint2_linear_56201_15523)"/>
  <path d="M12.2503 2H5.68785C3.81286 2 2.68787 4.39748 1.93788 6.79497C1.04933 9.63537 -0.113354 13.4342 3.25037 13.4342H6.11145C6.9435 13.4342 7.67548 12.8878 7.91125 12.0899C8.40466 10.4199 9.26493 7.52162 9.94109 5.31373C10.2857 4.18837 10.5728 3.22188 11.0134 2.62001C11.2604 2.28258 11.6721 2 12.2503 2Z" fill="url(#paint3_linear_56201_15523)"/>
  <path d="M7.74902 18H14.3115C16.1865 18 17.3114 15.6033 18.0614 13.2067C18.95 10.3672 20.1127 6.5697 16.7489 6.5697H13.8877C13.0557 6.5697 12.3238 7.11596 12.088 7.91383C11.5946 9.58325 10.7343 12.4804 10.0582 14.6874C9.71358 15.8124 9.42651 16.7786 8.98593 17.3802C8.73893 17.7175 8.32725 18 7.74902 18Z" fill="url(#paint4_radial_56201_15523)"/>
  <path d="M7.74902 18H14.3115C16.1865 18 17.3114 15.6033 18.0614 13.2067C18.95 10.3672 20.1127 6.5697 16.7489 6.5697H13.8877C13.0557 6.5697 12.3238 7.11596 12.088 7.91383C11.5946 9.58325 10.7343 12.4804 10.0582 14.6874C9.71358 15.8124 9.42651 16.7786 8.98593 17.3802C8.73893 17.7175 8.32725 18 7.74902 18Z" fill="url(#paint5_linear_56201_15523)"/>
  <defs>
  <radialGradient id="paint0_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.7128 8.89484) rotate(-129.141) scale(7.20751 6.76953)">
  <stop offset="0.0955758" stop-color="#00AEFF"/>
  <stop offset="0.773185" stop-color="#2253CE"/>
  <stop offset="1" stop-color="#0736C4"/>
  </radialGradient>
  <radialGradient id="paint1_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.74347 13.4008) rotate(51.7328) scale(6.58647 6.39483)">
  <stop stop-color="#FFB657"/>
  <stop offset="0.633728" stop-color="#FF5F3D"/>
  <stop offset="0.923392" stop-color="#C02B3C"/>
  </radialGradient>
  <linearGradient id="paint2_linear_56201_15523" x1="5.29507" y1="3.38547" x2="6.17192" y2="13.8705" gradientUnits="userSpaceOnUse">
  <stop offset="0.156162" stop-color="#0D91E1"/>
  <stop offset="0.487484" stop-color="#52B471"/>
  <stop offset="0.652394" stop-color="#98BD42"/>
  <stop offset="0.937361" stop-color="#FFC800"/>
  </linearGradient>
  <linearGradient id="paint3_linear_56201_15523" x1="6.11337" y1="2" x2="6.59201" y2="13.4355" gradientUnits="userSpaceOnUse">
  <stop stop-color="#3DCBFF"/>
  <stop offset="0.246674" stop-color="#0588F7" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="paint4_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.0861 5.45059) rotate(109.881) scale(15.2451 18.7446)">
  <stop offset="0.0661714" stop-color="#8C48FF"/>
  <stop offset="0.5" stop-color="#F2598A"/>
  <stop offset="0.895833" stop-color="#FFB152"/>
  </radialGradient>
  <linearGradient id="paint5_linear_56201_15523" x1="17.6045" y1="5.87186" x2="17.5982" y2="8.98507" gradientUnits="userSpaceOnUse">
  <stop offset="0.0581535" stop-color="#F8ADFA"/>
  <stop offset="0.708063" stop-color="#A86EDD" stop-opacity="0"/>
  </linearGradient>
  </defs>
  </svg>
  `;

return (  
  <SvgXml height="100" width="100" xml={svgXml} />);
*/
  /*
return (   <Svg height="30" width="30" viewBox="0 0 20 20">
  <Defs>
    <G id="reusable-path" scale="0.5">
      <Path d="M38.459,1.66A0.884,0.884,0,0,1,39,2.5a0.7,0.7,0,0,1-.3.575L23.235,16.092,27.58,26.1a1.4,1.4,0,0,1,.148.3,1.3,1.3,0,0,1,0,.377,1.266,1.266,0,0,1-2.078.991L15.526,20.6l-7.58,4.35a1.255,1.255,0,0,1-.485,0,1.267,1.267,0,0,1-1.277-1.258q0-.01,0-0.02a1.429,1.429,0,0,1,0-.446C7.243,20.253,8.6,16.369,8.6,16.29L3.433,13.545A0.743,0.743,0,0,1,2.9,12.822a0.822,0.822,0,0,1,.623-0.773l8.164-2.972,3.018-8.5A0.822,0.822,0,0,1,15.427,0a0.752,0.752,0,0,1,.752.555l2.563,6.936S37.65,1.727,37.792,1.685A1.15,1.15,0,0,1,38.459,1.66Z" />
    </G>
  </Defs>
  <Use href="#reusable-path" fill="#3a8" />
</Svg>
)
*/
  /*
return (  <Svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
  <Path d="M14.1437 3.34932C13.9101 2.54966 13.177 2 12.3439 2L11.7427 2C10.8467 2 10.0758 2.634 9.90296 3.51321L8.85352 8.85006L9.15094 7.89102C9.39431 7.1063 10.1202 6.57143 10.9418 6.57143L14.2351 6.57143L15.6352 7.74347L16.8818 6.57143H16.4905C15.6574 6.57143 14.9242 6.02177 14.6907 5.22211L14.1437 3.34932Z" fill="url(#paint0_radial_56201_15523)"/>
  <Path d="M6.0492 16.643C6.28017 17.4465 7.01519 18 7.85121 18H9.07497C10.0844 18 10.9126 17.2009 10.9488 16.1921L11.1295 11.1429L10.842 12.0954C10.6031 12.887 9.87385 13.4286 9.04701 13.4286L5.73383 13.4286L4.34959 12.5434L3.32812 13.4286H3.71324C4.54926 13.4286 5.28427 13.9821 5.51524 14.7855L6.0492 16.643Z" fill="url(#paint1_radial_56201_15523)"/>
  <Path d="M12.2503 2H5.68785C3.81286 2 2.68787 4.39748 1.93788 6.79497C1.04933 9.63537 -0.113354 13.4342 3.25037 13.4342H6.11145C6.9435 13.4342 7.67548 12.8878 7.91125 12.0899C8.40466 10.4199 9.26493 7.52162 9.94109 5.31373C10.2857 4.18837 10.5728 3.22188 11.0134 2.62001C11.2604 2.28258 11.6721 2 12.2503 2Z" fill="url(#paint2_linear_56201_15523)"/>
  <Path d="M12.2503 2H5.68785C3.81286 2 2.68787 4.39748 1.93788 6.79497C1.04933 9.63537 -0.113354 13.4342 3.25037 13.4342H6.11145C6.9435 13.4342 7.67548 12.8878 7.91125 12.0899C8.40466 10.4199 9.26493 7.52162 9.94109 5.31373C10.2857 4.18837 10.5728 3.22188 11.0134 2.62001C11.2604 2.28258 11.6721 2 12.2503 2Z" fill="url(#paint3_linear_56201_15523)"/>
  <Path d="M7.74902 18H14.3115C16.1865 18 17.3114 15.6033 18.0614 13.2067C18.95 10.3672 20.1127 6.5697 16.7489 6.5697H13.8877C13.0557 6.5697 12.3238 7.11596 12.088 7.91383C11.5946 9.58325 10.7343 12.4804 10.0582 14.6874C9.71358 15.8124 9.42651 16.7786 8.98593 17.3802C8.73893 17.7175 8.32725 18 7.74902 18Z" fill="url(#paint4_radial_56201_15523)"/>
  <Path d="M7.74902 18H14.3115C16.1865 18 17.3114 15.6033 18.0614 13.2067C18.95 10.3672 20.1127 6.5697 16.7489 6.5697H13.8877C13.0557 6.5697 12.3238 7.11596 12.088 7.91383C11.5946 9.58325 10.7343 12.4804 10.0582 14.6874C9.71358 15.8124 9.42651 16.7786 8.98593 17.3802C8.73893 17.7175 8.32725 18 7.74902 18Z" fill="url(#paint5_linear_56201_15523)"/>
  <Defs>
  <RadialGradient id="paint0_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.7128 8.89484) rotate(-129.141) scale(7.20751 6.76953)">
  <Stop offset="0.0955758" stop-color="#00AEFF"/>
  <Stop offset="0.773185" stop-color="#2253CE"/>
  <Stop offset="1" stop-color="#0736C4"/>
  </RadialGradient>
  <RadialGradient id="paint1_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.74347 13.4008) rotate(51.7328) scale(6.58647 6.39483)">
  <Stop stop-color="#FFB657"/>
  <Stop offset="0.633728" stop-color="#FF5F3D"/>
  <Stop offset="0.923392" stop-color="#C02B3C"/>
  </RadialGradient>
  <LinearGradient id="paint2_linear_56201_15523" x1="5.29507" y1="3.38547" x2="6.17192" y2="13.8705" gradientUnits="userSpaceOnUse">
  <Stop offset="0.156162" stop-color="#0D91E1"/>
  <Stop offset="0.487484" stop-color="#52B471"/>
  <Stop offset="0.652394" stop-color="#98BD42"/>
  <Stop offset="0.937361" stop-color="#FFC800"/>
  </LinearGradient>
  <LinearGradient id="paint3_linear_56201_15523" x1="6.11337" y1="2" x2="6.59201" y2="13.4355" gradientUnits="userSpaceOnUse">
  <Stop stop-color="#3DCBFF"/>
  <Stop offset="0.246674" stop-color="#0588F7" stop-opacity="0"/>
  </LinearGradient>
  <RadialGradient id="paint4_radial_56201_15523" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.0861 5.45059) rotate(109.881) scale(15.2451 18.7446)">
  <Stop offset="0.0661714" stop-color="#8C48FF"/>
  <Stop offset="0.5" stop-color="#F2598A"/>
  <Stop offset="0.895833" stop-color="#FFB152"/>
  </RadialGradient>
  <LinearGradient id="paint5_linear_56201_15523" x1="17.6045" y1="5.87186" x2="17.5982" y2="8.98507" gradientUnits="userSpaceOnUse">
  <Stop offset="0.0581535" stop-color="#F8ADFA"/>
  <Stop offset="0.708063" stop-color="#A86EDD" stop-opacity="0"/>
  </LinearGradient>
  </Defs>
  </Svg>);
  */
  /*
return (  <Svg height="30" width="30" viewBox="0 0 20 20">
<Rect x="0" y="0" width="20" height="20" fill="none" stroke="black" />
</Svg>);
*/
  /*
  return (      <Svg width="200" height="60">
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
  </Svg>)
  */
  /*
return (
    <Svg height="100" width="100">
    <Circle
      cx="50"
      cy="50"
      r="45"
      stroke="purple"
      fill="green"
      strokeWidth="2.5"
    />
  </Svg>
)
*/
  /*
    return (


<Svg height="60" width="200">
<Defs>
  <LinearGradient id="text-fill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="rgb(255,255,0)" stopOpacity="0.5" />
    <Stop offset="100%" stopColor="red" stopOpacity="1" />
  </LinearGradient>
</Defs>

<TextS
  fill="url(#text-fill-grad)"
  stroke="purple"
  strokeWidth="1"
  fontSize="20"
  fontWeight="bold"
  x="100"
  y="20"
  textAnchor="middle">
  FILL TEXT
</TextS>
</Svg>
    );
    
    */
  /*
    return (
        <Svg height="200" width="225">
        <G scale="0.5">
          <Path
            d="M 100 350 l 150 -300"
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
          <Path d="M 250 50 l 150 300" stroke="red" strokeWidth="3" fill="none" />
          <Path
            d="M 175 200 l 150 0"
            stroke="green"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d="M 100 350 q 150 -300 300 0"
            stroke="blue"
            strokeWidth="5"
            fill="none"
          />
          <G stroke="purple" strokeWidth="3" fill="purple">
            <Circle cx="100" cy="350" r="3" />
            <Circle cx="250" cy="50" r="3" />
            <Circle cx="400" cy="350" r="3" />
          </G>
          <G fontSize="30" fill="black" stroke="none" textAnchor="middle">
            <TextS x="250" y="50" dy="-50">
              B
            </TextS>
          </G>
        </G>
      </Svg>
    )
*/
  return (
    <ScrollView>
      {Object.values(examples).map((example, index) => {
        return <ExampleBlock example={example} index={index} key={index} />;
      })}
    </ScrollView>
  );
}
