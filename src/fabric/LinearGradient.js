import React from 'react';
import LinearGradientNativeComponent from './LinearGradientNativeComponent';

function LinearGradient(props, ref) {
  return (
    <LinearGradientNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(LinearGradient);