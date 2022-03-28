import React from 'react';
import CircleNativeComponent from './CircleNativeComponent';

function Circle(props, ref) {
  return (
    <CircleNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Circle);