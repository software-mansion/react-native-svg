import * as React from 'react';
import {Button, Dimensions, SafeAreaView, View} from 'react-native';
import Svg, {Path, type ToDataUrlOptions} from 'react-native-svg';

const SvgLogoWelcome = () => {
  const ref = React.useRef<Svg | null>(null);

  const {width, height} = Dimensions.get('screen');
  const optionsWithJPEGFormat: ToDataUrlOptions = {
    format: 'jpeg',
    width,
    height,
    quality: 100,
  };

  const optionsWithPNGFormat: ToDataUrlOptions = {
    format: 'png',
    width,
    height,
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button
        onPress={() => {
          ref.current?.toDataURL(base64Image => {
            console.log(base64Image, 'data');
          }, optionsWithJPEGFormat);
        }}
        title="log"
      />
      <Svg ref={ref} viewBox="0 0 24 24" fill="black" width={250} height={250}>
        <Path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0-2C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931L6 14.434C7.127 16.154 9.2 18 12.001 18c2.8 0 4.872-1.846 5.999-3.566l-.493-.493zM8.5 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
      </Svg>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView>
      <SvgLogoWelcome />
    </SafeAreaView>
  );
}
