import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Svg, {
  Defs,
  G,
  Rect,
  Text as SvgText,
  TSpan,
  Use,
} from 'react-native-svg';

// Each black shape sets pointerEvents="none", so pressing it should press the
// blue rect beneath it and add one to that row's count.
const shapes = {
  Rect: <Rect x={35} y={10} width={50} height={60} pointerEvents="none" />,
  Text: (
    <SvgText
      x={60}
      y={70}
      fontSize={84}
      fontWeight="bold"
      textAnchor="middle"
      pointerEvents="none">
      I
    </SvgText>
  ),
  TSpan: (
    <SvgText x={60} y={70} fontSize={84} fontWeight="bold" textAnchor="middle">
      <TSpan pointerEvents="none">I</TSpan>
    </SvgText>
  ),
  G: (
    <G pointerEvents="none">
      <Rect x={35} y={10} width={50} height={60} />
    </G>
  ),
  Use: (
    <>
      <Defs>
        <Rect id="shape" x={35} y={10} width={50} height={60} />
      </Defs>
      <Use href="#shape" pointerEvents="none" />
    </>
  ),
};

type Name = keyof typeof shapes;

export default function Test3106() {
  const [counts, setCounts] = useState<Record<Name, number>>({
    Rect: 0,
    Text: 0,
    TSpan: 0,
    G: 0,
    Use: 0,
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
      }}>
      <Text>Press the black shape in each box once.</Text>
      {(Object.keys(shapes) as Name[]).map(name => (
        <View
          key={name}
          style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <Svg width={120} height={80}>
            <Rect
              width={120}
              height={80}
              fill="#9ec5fe"
              onPress={() => setCounts(c => ({...c, [name]: c[name] + 1}))}
            />
            {shapes[name]}
          </Svg>
          <Text>{`<${name} pointerEvents="none">: ${counts[name]}`}</Text>
        </View>
      ))}
    </View>
  );
}
