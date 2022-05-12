import React from 'react';
import TextPathNativeComponent from './TextPathNativeComponent';

function TextPath(props, ref) {
  return (
    <TextPathNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(TextPath);