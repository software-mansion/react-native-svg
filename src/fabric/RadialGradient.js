import React from 'react';
import RadialGradientNativeComponent from './RadialGradientNativeComponent';

function RadialGradient(props, ref) {
  return (
    <RadialGradientNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(RadialGradient);