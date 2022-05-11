import React from 'react';
import MaskNativeComponent from './MaskNativeComponent';

function Mask(props, ref) {
  return (
    <MaskNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Mask);