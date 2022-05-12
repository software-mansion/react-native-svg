import React from 'react';
import UseNativeComponent from './UseNativeComponent';

function Use(props, ref) {
  return (
    <UseNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Use);