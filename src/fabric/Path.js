import React from 'react';
import PathNativeComponent from './PathNativeComponent';

function Path(props, ref) {
  return (
    <PathNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Path);