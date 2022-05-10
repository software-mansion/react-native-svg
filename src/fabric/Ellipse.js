import React from 'react';
import EllipseNativeComponent from './EllipseNativeComponent';

function Ellipse(props, ref) {
  return (
    <EllipseNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Ellipse);