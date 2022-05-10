import React from 'react';
import DefsNativeComponent from './DefsNativeComponent';

function Defs(props, ref) {
  return (
    <DefsNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Defs);