import React, {useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Circle, G, Line, Path, Rect, Svg} from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
    width: 200,
  },
  svg: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

function SvgExample() {
  return (
    <Svg height="100" width="100">
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
      <Rect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      />
    </Svg>
  );
}
SvgExample.title = 'SVG';

function SvgOpacity() {
  return (
    <Svg height="100" width="100" opacity="0.2">
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
      <Rect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      />
    </Svg>
  );
}
SvgOpacity.title = 'SVG with `opacity` prop';

function SvgViewbox() {
  return (
    <Svg
      height="100"
      width="100"
      viewBox="40 20 100 40"
      preserveAspectRatio="none">
      <Rect x="0" y="0" width="100" height="100" fill="red" />
      <Circle cx="50" cy="50" r="30" fill="yellow" />
      <Circle cx="40" cy="40" r="4" fill="black" />
      <Circle cx="60" cy="40" r="4" fill="black" />
      <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
    </Svg>
  );
}
SvgViewbox.title =
  'SVG with `viewBox="40 20 100 40" and preserveAspectRatio="none"';

function SvgLayout() {
  return (
    <View style={styles.container}>
      <Svg style={styles.svg}>
        <Rect
          width="80%"
          height="80%"
          x="10%"
          y="10%"
          fill="purple"
          stroke="yellow"
          strokeWidth="4"
        />
        <Line
          x1="10%"
          y1="10%"
          x2="90%"
          y2="90%"
          stroke="yellow"
          strokeWidth="4"
        />
        <Line
          x1="10%"
          y1="90%"
          x2="90%"
          y2="10%"
          stroke="yellow"
          strokeWidth="4"
        />
      </Svg>
    </View>
  );
}
SvgLayout.title = 'SVG with flex layout';

function SvgNativeMethods() {
  const [base64, setBase64] = useState('');
  const rootRef = useRef<Svg>(null);
  const circleRef = useRef<Circle>(null);

  const alert = () => {
    console.log('PRESSED');
    rootRef.current?.toDataURL(data => {
      setBase64(data);
    });

    console.log(circleRef.current?.isPointInFill({x: 200, y: 100}));
    console.log(circleRef.current?.isPointInStroke({x: 200, y: 100}));
    console.log(circleRef.current?.getTotalLength());
    console.log(circleRef.current?.getPointAtLength(25));
    console.log(circleRef.current?.getBBox({fill: true}));
    console.log(circleRef.current?.getCTM());
    console.log(circleRef.current?.getScreenCTM());
  };
  return (
    <>
      <Svg height="100" width="150" ref={rootRef}>
        <G x="40" onPress={alert}>
          <Circle cx="32" cy="32" r="4.167" fill="blue" ref={circleRef} />
          <Path
            d="M55.192 27.87l-5.825-1.092a17.98 17.98 0 0 0-1.392-3.37l3.37-4.928c.312-.456.248-1.142-.143-1.532l-4.155-4.156c-.39-.39-1.076-.454-1.532-.143l-4.928 3.37a18.023 18.023 0 0 0-3.473-1.42l-1.086-5.793c-.103-.543-.632-.983-1.185-.983h-5.877c-.553 0-1.082.44-1.185.983l-1.096 5.85a17.96 17.96 0 0 0-3.334 1.393l-4.866-3.33c-.456-.31-1.142-.247-1.532.144l-4.156 4.156c-.39.39-.454 1.076-.143 1.532l3.35 4.896a18.055 18.055 0 0 0-1.37 3.33L8.807 27.87c-.542.103-.982.632-.982 1.185v5.877c0 .553.44 1.082.982 1.185l5.82 1.09a18.013 18.013 0 0 0 1.4 3.4l-3.31 4.842c-.313.455-.25 1.14.142 1.53l4.155 4.157c.39.39 1.076.454 1.532.143l4.84-3.313c1.04.563 2.146 1.02 3.3 1.375l1.096 5.852c.103.542.632.982 1.185.982h5.877c.553 0 1.082-.44 1.185-.982l1.086-5.796c1.2-.354 2.354-.82 3.438-1.4l4.902 3.353c.456.313 1.142.25 1.532-.142l4.155-4.154c.39-.39.454-1.076.143-1.532l-3.335-4.874a18.016 18.016 0 0 0 1.424-3.44l5.82-1.09c.54-.104.98-.633.98-1.186v-5.877c0-.553-.44-1.082-.982-1.185zM32 42.085c-5.568 0-10.083-4.515-10.083-10.086 0-5.568 4.515-10.084 10.083-10.084 5.57 0 10.086 4.516 10.086 10.083 0 5.57-4.517 10.085-10.086 10.085z"
            fill="blue"
          />
        </G>
      </Svg>
      <View style={{width: 150, height: 100, borderWidth: 1, marginTop: 5}}>
        {base64 && (
          <Image
            source={{uri: `data:image/png;base64,${base64}`}}
            style={{width: 150, height: 100}}
          />
        )}
      </View>
    </>
  );
}
SvgNativeMethods.title =
  'Tap the shapes to render the Image below based on the base64-data of the Svg';

const icon = (
  <Svg height="30" width="30" viewBox="0 0 20 20">
    <Circle cx="10" cy="10" r="8" stroke="blue" strokeWidth="1" fill="green" />
    <Rect
      x="4"
      y="4"
      width="12"
      height="12"
      stroke="red"
      strokeWidth="1"
      fill="yellow"
    />
  </Svg>
);
const samples = [
  SvgExample,
  SvgOpacity,
  SvgViewbox,
  SvgLayout,
  SvgNativeMethods,
];

export {icon, samples};
