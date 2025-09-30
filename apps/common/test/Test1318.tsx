import React from 'react';
import {SvgUri} from 'react-native-svg';
import {SvgCssUri} from 'react-native-svg/css';

export default function Test() {
  return (
    <>
      <SvgCssUri
        height={100}
        width={100}
        uri={
          'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpath%20fill%3D%22%2354b847%22%20d%3D%22M0%200h100v100H0z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M61.6%2069.1h-17V38.3h8.6v25.4h8.2c5.7%200%208.1-3.9%208.1-14.1S66.8%2036.4%2061%2036.4H42.2v32.7h-8.4V36.3H21.4v-5.4h42.3c10.2%200%2015%205.3%2015%2018.6-.1%2017.4-7.3%2019.6-17.1%2019.6%22%2F%3E%3C%2Fsvg%3E'
        }
      />
      <SvgCssUri
        height={100}
        width={100}
        uri={
          'data:image/svg+xml;utf8,%3Csvg%20width%3D%22300%22%20height%3D%22700%22%20viewBox%3D%2250%2050%20100%20100%22%20preserveAspectRatio%3D%22xMidYMid%20meet%22%3E%3Crect%20x%3D%2250%22%20y%3D%2250%22%20width%3D%22100%22%20height%3D%22100%22%20fill%3D%22yellow%22%3E%3C%2Frect%3E%3C%2Fsvg%3E'
        }
      />
      <SvgUri
        height={100}
        width={100}
        uri={
          'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cpolygon%20points%3D%2250%2C15%2061%2C40%2088%2C40%2066%2C57%2075%2C84%2050%2C68%2025%2C84%2034%2C57%2012%2C40%2039%2C40%22%20fill%3D%22gold%22%2F%3E%3C%2Fsvg%3E'
        }
      />
    </>
  );
}
