import * as React from 'react';
import { View } from 'react-native';
import Svg, {Circle, SvgXml} from 'react-native-svg';

export default function App() {
  const svgXmlWithTransform = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="100" height="300" viewBox="0 0 100 100" transform="scale(1 -1)">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;
  const svgXmlWithEmptyStyle = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <circle style=" " cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`;

const svgg = `
<svg width="400" height="200">
  <polygon points="100 100, 180 100, 140 180" fill="black"></polygon>
  <polygon points="100 100, 180 100, 140 180" fill="red" transform="translate(0, 280), scale(1, -1)"></polygon>
</svg>
`;

  return (
    <View style={{flex: 1}}>
      <Svg
    width={100}
    height={100}
    viewBox="0 0 100 100"
    transform={[{scaleX: 1}, {scaleY: -1}]}
      >
      <Circle cx={50} cy={50} r={40} stroke="black" strokeWidth={3} fill="red" />
    </Svg>
    <SvgXml xml={svgXmlWithTransform}/>
    <SvgXml xml={svgXmlWithEmptyStyle}/>
    <SvgXml xml={svgg}/>
      </View>
  );
}
