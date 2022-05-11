import React from 'react';
import RectNativeComponent from './RectNativeComponent';

function Rect(props, ref) {
  return (
    <RectNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Rect);