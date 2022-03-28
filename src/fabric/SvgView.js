import React from 'react';
import SvgViewNativeComponent from './SvgViewNativeComponent';
import { StyleSheet } from 'react-native';

function SvgView(props, ref) {
  return (
    <SvgViewNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(SvgView);