import React from 'react';
import ImageNativeComponent from './ImageNativeComponent';

function Image(props, ref) {
  return (
    <ImageNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Image);