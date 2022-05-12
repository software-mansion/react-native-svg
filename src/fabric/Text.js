import React from 'react';
import TextNativeComponent from './TextNativeComponent';

function Text(props, ref) {
  return (
    <TextNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(Text);