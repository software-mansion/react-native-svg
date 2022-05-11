import React from 'react';
import MarkerNativeComponent from './MarkerNativeComponent';

function Marker(props, ref) {
  return (
    <MarkerNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Marker);