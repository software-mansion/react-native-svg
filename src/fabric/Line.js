import React from 'react';
import LineNativeComponent from './LineNativeComponent';

function Line(props, ref) {
  return (
    <LineNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Line);