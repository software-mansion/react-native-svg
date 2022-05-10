import React from 'react';
import ClipPathNativeComponent from './ClipPathNativeComponent';

function ClipPath(props, ref) {
  return (
    <ClipPathNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(ClipPath);