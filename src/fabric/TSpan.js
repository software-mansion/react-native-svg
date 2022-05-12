import React from 'react';
import TSpanNativeComponent from './TSpanNativeComponent';

function TSpan(props, ref) {
  return (
    <TSpanNativeComponent
      ref={ref}
      {...props}
    />
  );
}

export default React.forwardRef(TSpan);