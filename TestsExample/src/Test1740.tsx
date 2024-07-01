import React from 'react';
import {SvgXml} from 'react-native-svg';

const CircleSvg = `
<svg width="290" height="500" viewBox="0 0 290 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink'>
<defs>
  <path id="text-path-a" d="M40 12 H250 A28 28 0 0 1 278 40 V460 A28 28 0 0 1 250 488 H40 A28 28 0 0 1 12 460 V40 A28 28 0 0 1 40 12 z" />
</defs>
<text>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
  <textPath startOffset="1%" xlink:href="#text-path-a">
    ahshjkdasjklsadjkldasjkldsajklkljsdakjlcsakljdjklaskljdjsakldjaksl
  </textPath>
</text>
</svg>
`;

export default function Test1740() {
  return <SvgXml xml={CircleSvg} width="100%" height="100%" />;
}
