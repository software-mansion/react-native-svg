import React from 'react';
import PatternNativeComponent from './PatternNativeComponent';

function Pattern(props, ref) {
  return (
    <PatternNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Pattern);