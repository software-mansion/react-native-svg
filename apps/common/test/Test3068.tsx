import React from 'react';
import {View} from 'react-native';
import {SvgFromXml} from 'react-native-svg';

const xml = `<svg><text x="10" y="32" fontSize="32">&amp; &lt; &gt;</text></svg>`;

export default () => {
  return (
    <View style={{marginTop: 100}}>
      <SvgFromXml xml={xml} />
    </View>
  );
};
