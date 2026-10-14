import * as React from 'react';
import {Text, View} from 'react-native';
import {LocalSvg, SvgCssUri, WithLocalSvg} from 'react-native-svg/css';

const asset = require('./assets/ruby.svg');

export default function Test3015() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>LocalSvg</Text>
      <LocalSvg width="100" height="100" asset={asset} />
      <Text>WithLocalSvg</Text>
      <WithLocalSvg width="100" height="100" asset={asset} />
      <Text>SvgCssUri</Text>
      <SvgCssUri
        width="100"
        height="100"
        uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg"
      />
    </View>
  );
}
